# Pattern 1: Transactional Outbox

I used the transactional outbox pattern in Rivo because of a small but important failure case.

What happens if the database write succeeds, but the side effect fails?

That question looks simple.

But it is one of those questions that exposes whether a backend is only working in the happy path, or whether it can survive real production behavior.

In Rivo, a user can register, request a verification code, reset a password, or complete email verification.

Each of those actions updates the database.

Each of those actions also needs something else to happen after the database update.

An email needs to be sent.

A verification code needs to reach the user.

A password reset message needs to be delivered.

A success notification may need to go out.

At first, the flow can look straightforward.

Save the user.

Send the email.

Return the response.

But the problem is hidden between those steps.

The database and the email provider are two different systems.

They do not commit together.

If the user is saved successfully but the email provider fails, the application has already changed state.

The user now exists.

The verification code may already be stored.

The password reset code may already be active.

But the user never receives the email.

The system has accepted the action, but lost the intent to continue the workflow.

That is the exact failure the outbox pattern protects against.

## The Problem We Faced

In Rivo, authentication flows depend on email delivery.

When a user signs up, they cannot log in until they verify their account.

So registration is not just a database insert.

It is a business workflow:

1. Validate the user details.
2. Create or update the user record.
3. Generate a verification code.
4. Persist the code and expiry time.
5. Send the verification email.
6. Let the user continue only after verification.

The dangerous part is step five.

Email is an external dependency.

External dependencies fail.

They timeout.

They rate limit.

They return temporary errors.

The network drops.

The application instance crashes after saving the user but before sending the email.

If the code only saves the user and then immediately calls the email service, there is a gap.

And in that gap, business intent can disappear.

The database says the user must verify their account.

But there is no durable record saying, "send this verification email."

That means the system has moved forward, but the workflow has not.

This is worse than a simple failed request.

A failed request is visible.

A lost side effect is quiet.

The user just waits for an email that never arrives.

The backend looks like it did its job because the user record exists.

Logs might show an exception, but logs are not a workflow recovery mechanism.

That was the core problem.

We needed a way to make the next step durable.

## What The Outbox Changes

With the outbox pattern, Rivo does not treat email sending as part of the direct request path.

Instead, the request writes two things:

1. The business state.
2. The intent for the side effect.

For example, when a user registers, Rivo saves the user and also creates an outbox event with type `USER_REGISTERED`.

That outbox event contains the important context:

- the aggregate type, such as `USER`
- the aggregate id, such as the user id
- the event type, such as `USER_REGISTERED`
- the payload, such as email and verification code
- the status, such as `PENDING`
- the retry metadata, such as attempts and next attempt time

Now the system has a durable record of what should happen next.

If the application crashes after saving the user, the outbox event is still there.

If the email provider is down, the outbox event is still there.

If the first processing attempt fails, the event can be retried.

The important part is this:

The workflow intent is stored in the database before the side effect is attempted.

That is the heart of the pattern.

## How Rivo Uses It

Rivo stores outbox events in MongoDB.

The event has a lifecycle:

`PENDING`

The event exists and is ready to be processed.

`PROCESSING`

A worker has claimed the event and is currently handling it.

`PROCESSED`

The side effect completed successfully.

`FAILED`

The event could not be processed after the allowed number of retries, or it was deliberately retired because a newer event replaced it.

The worker runs on a schedule.

It looks for pending events whose `nextAttemptAt` time has arrived.

It claims one event at a time by moving it from `PENDING` to `PROCESSING`.

That claim step matters.

If multiple application instances are running, they should not all process the same event at the same time.

In Rivo, the poller uses an atomic find-and-modify operation through MongoDB.

That gives the worker a safer way to say:

"Give me the next available event, and mark it as mine."

After the event is claimed, the worker checks its type.

If the event is `USER_REGISTERED`, it sends the welcome email and verification email.

If the event is `PASSWORD_RESET_REQUESTED`, it sends the password reset email.

If the event is `PASSWORD_RESET_SUCCESS`, it sends the reset success email.

If the event is `VERIFY_EMAIL_REQUESTED`, it sends the verification email again.

If the event is `VERIFY_EMAIL_SENT`, it sends the verification success email.

When the side effect succeeds, the event becomes `PROCESSED`.

When the side effect fails, the attempt count increases.

If attempts are still available, the event goes back to `PENDING` with a future `nextAttemptAt`.

The retry delay increases over time:

- 1 minute
- 5 minutes
- 15 minutes
- 1 hour

If the event reaches the maximum number of attempts, it becomes `FAILED`.

That means the system does not keep retrying forever.

It preserves the failed event for inspection.

That is important too.

Failure should not vanish just because retries were exhausted.

## Why Not Just Send The Email Directly?

Direct email sending is simpler.

For small projects, it can be enough.

But it creates an uncomfortable reliability problem once the side effect matters to the business flow.

Consider signup.

If user creation succeeds and email sending fails, what should the API return?

If it returns success, the user is stuck waiting for an email.

If it returns failure, the database may already contain the user.

If the client retries, the app may now see the username or email as already taken.

If the app tries to manually compensate, the code becomes fragile.

This is how a simple two-step flow becomes messy.

The root issue is that one operation is durable and the other is not.

The database write is persisted.

The email intent is only in memory unless we store it somewhere.

The outbox makes that intent durable.

## The Pattern Is Not Mainly About Async

This distinction matters.

A lot of people explain the outbox pattern as a way to make work asynchronous.

That can be true as a side effect.

But that is not the main reason I used it in Rivo.

I used it because I did not want to lose business intent when the process crashes between two operations.

Async is an implementation detail.

Durability is the real point.

The outbox says:

"If the system accepted this state change, it must also remember what needs to happen next."

That is a different mindset.

It turns a fragile in-memory follow-up into a recoverable workflow.

## What This Solved

The outbox gave Rivo a cleaner reliability boundary.

The API request is responsible for validating input and persisting state.

The worker is responsible for delivering side effects.

The database becomes the handoff point between them.

That means the API no longer depends on the email provider being healthy at the exact moment the user signs up.

If email sending is temporarily unavailable, the event remains pending.

If the app restarts, the event remains pending.

If processing fails once, the worker retries later.

If processing fails repeatedly, the event becomes failed instead of disappearing.

That changed the failure mode.

Before the outbox, a failed side effect could become a lost side effect.

After the outbox, a failed side effect becomes a visible pending or failed event.

That is a much better problem to have.

Visible failure can be retried, monitored, alerted on, or manually inspected.

Invisible failure usually becomes a confused user and a debugging session later.

## One Practical Issue: Stale Verification Codes

There was one extra problem in Rivo.

Verification codes can change.

A user may sign up, wait, and then request another verification email.

Or they may repeat signup while the account is still pending.

If old outbox events are still pending, they might send an older verification code after a newer one has been generated.

That would be a bad user experience.

The user receives a code.

They enter it.

The backend rejects it because a newer code is actually active.

So Rivo also retires stale pending events in specific flows.

When a pending signup is refreshed, older pending `USER_REGISTERED` events for that user are marked as `FAILED` with a reason like superseded by newer verification code.

That keeps the outbox aligned with the current business state.

This is an important lesson:

The outbox makes intent durable, but the intent still has to be correct.

For event types where newer events replace older ones, the system needs rules for retiring stale work.

## Tradeoffs

The outbox pattern is useful, but it is not free.

It adds another collection or table.

It adds a worker.

It adds statuses.

It adds retry logic.

It adds operational questions.

How often should the worker poll?

How many events should it process at once?

How many retries are enough?

What should happen to failed events?

Which failures are temporary?

Which failures should stop immediately?

It also introduces at-least-once behavior.

That means a side effect may happen more than once in some failure scenarios.

For example, the worker could send an email successfully but crash before marking the event as processed.

When it restarts, it may retry the event.

So consumers and side effects should be designed with idempotency in mind where possible.

For email, duplicate sends are not ideal, but they are usually less dangerous than losing a critical verification or reset email.

For payments or financial transfers, the idempotency requirements would be much stricter.

The pattern improves reliability, but it does not remove the need to think carefully.

It moves failure into a place where the system can see it and handle it.

## The Main Lesson

The transactional outbox is not just an architecture diagram pattern.

It solves a very real gap in application code.

The gap between:

"The database update succeeded."

And:

"The rest of the workflow definitely happened."

In Rivo, that gap showed up in user registration, verification emails, and password reset flows.

The database could save the correct state, while the side effect could still fail.

The outbox gave the system a durable memory of what needed to happen next.

That is the reason I used it.

Not because async sounds cleaner.

Not because patterns are impressive.

Because a backend should not forget business intent just because an external dependency failed at the wrong time.

That distinction matters.
