# Transactional Outbox Pattern in Rivo

How and why I used the Outbox pattern to make email-driven workflows more reliable.

## The Problem

Rivo has a few flows where one user action does two important things.

It changes application state.

And it triggers a side effect.

For example:

- a user signs up
- a verification code is generated
- the user record is saved
- a verification email must be sent

At first, this looks like a normal backend flow.

```text
Request
  -> Save user in database
  -> Send verification email
  -> Return response
```

But there is a failure case hiding in the middle.

What happens if the database write succeeds, but the email fails?

The user exists in the database.

The account is marked as unverified.

The verification code may be stored.

But the user never receives the email.

The system has changed state, but the next step in the workflow has been lost.

That is the problem the Outbox pattern solves.

## Why This Matters

This is not only about email.

The same problem appears whenever an application does a database write and then tries to notify another system.

Examples:

- save an order, then publish `OrderCreated`
- create a payment, then notify a ledger service
- update inventory, then emit a stock event
- register a user, then send a verification email
- reset a password, then send a reset confirmation

The core issue is that the database and the external system do not commit together.

The database may succeed.

The broker, email provider, or downstream service may fail.

The application may crash between the two operations.

So this flow is unsafe:

```text
BEGIN
  Save business data
COMMIT

Send side effect
```

The side effect is not durable.

It only exists as an in-memory intention inside the running process.

If the process dies, the intention dies with it.

## Presenting The Outbox Pattern

The Outbox pattern changes the flow.

Instead of sending the side effect directly, the application first stores an event in an outbox collection.

That event says what should happen next.

In Rivo, the event may say:

- `USER_REGISTERED`
- `VERIFY_EMAIL_REQUESTED`
- `VERIFY_EMAIL_SENT`
- `PASSWORD_RESET_REQUESTED`
- `PASSWORD_RESET_SUCCESS`

The important part is that the business write and the outbox write happen together.

```text
BEGIN
  Save business data
  Save outbox event
COMMIT
```

Now the system has durable business state and durable business intent.

The side effect can happen later.

A background worker can pick up the event, process it, retry it, or mark it as failed.

The message is no longer lost just because the request process crashed at the wrong time.

## The Shape Of The Outbox Event

In Rivo, outbox events are stored in MongoDB.

The model contains enough information for the worker to process the event without needing to reconstruct the original request.

```java
public class OutboxEvent {
    private String id;

    private EventType eventType;
    private String aggregateType;
    private String aggregateId;

    private Map<String, Object> payload;

    private OutboxStatus outboxStatus;
    private int attempts;
    private int maxAttempts;

    private Date nextAttemptAt;
    private Date createdAt;
    private Date updatedAt;
    private Date processedAt;

    private String lastError;
}
```

The fields are simple, but each one has a job.

`eventType` tells the worker what action to perform.

`aggregateType` and `aggregateId` connect the event back to the domain object.

`payload` carries the data needed for the side effect, such as email and verification code.

`outboxStatus` tracks where the event is in its lifecycle.

`attempts`, `maxAttempts`, and `nextAttemptAt` make retries controlled instead of random.

`lastError` keeps failure visible.

This matters because an outbox is not just a queue.

It is also an operational record of what the system tried to do.

## Event Lifecycle

Rivo uses four states.

```text
PENDING
  The event is ready to be processed.

PROCESSING
  A worker has claimed the event.

PROCESSED
  The side effect completed successfully.

FAILED
  The event was exhausted or deliberately retired.
```

The happy path looks like this:

```text
PENDING -> PROCESSING -> PROCESSED
```

The retry path looks like this:

```text
PENDING -> PROCESSING -> PENDING -> PROCESSING -> PROCESSED
```

The exhausted path looks like this:

```text
PENDING -> PROCESSING -> FAILED
```

This gives the system a clear answer to an important question:

What happened to the side effect?

Without an outbox, that answer often lives only in logs.

With an outbox, it lives in data.

## How Rivo Creates An Outbox Event

During registration, Rivo creates the user first.

Then it creates an outbox event for the verification email workflow.

The simplified flow looks like this:

```text
validate user
generate verification code
save user
create USER_REGISTERED outbox event
return response
```

The outbox event contains the email address and verification code.

```java
private OutboxEvent generateOutboxEvent(User user, EventType eventType) {
    OutboxEvent event = new OutboxEvent();
    event.setEventType(eventType);
    event.setAggregateType("USER");
    event.setAggregateId(user.getId());
    event.setOutboxStatus(OutboxStatus.PENDING);
    event.setAttempts(0);
    event.setMaxAttempts(5);
    event.setNextAttemptAt(convertLocalDateTimeToDate());
    event.setCreatedAt(convertLocalDateTimeToDate());
    event.setUpdatedAt(convertLocalDateTimeToDate());

    Map<String, Object> payload = new HashMap<>();
    payload.put("username", user.getUsername());
    payload.put("email", user.getEmail());

    if (user.getVerificationCode() != null) {
        payload.put("verificationCode", user.getVerificationCode());
    }

    event.setPayload(payload);
    return event;
}
```

The key decision is this:

Rivo stores the intent before attempting the side effect.

That means the system can always come back later and continue the workflow.

## The Message Relay

Putting an event in the outbox does not send the email by itself.

Something still has to process it.

That component is usually called a relay, dispatcher, poller, or worker.

In Rivo, it is `OutboxPoller`.

The worker runs on a schedule.

It looks for events that are:

- `PENDING`
- due for processing based on `nextAttemptAt`
- oldest first based on `createdAt`

Then it claims an event.

Claiming matters because multiple workers may be running at the same time.

If two workers pick the same event, the side effect may happen twice.

Rivo uses MongoDB `findAndModify` to atomically move one event from `PENDING` to `PROCESSING`.

Conceptually, it does this:

```text
Find the oldest pending event
Mark it as processing
Return it to this worker
```

That makes the claim operation atomic.

Only one worker gets that specific event.

## Processing The Event

Once the worker claims an event, it reads the event type and executes the matching side effect.

```text
USER_REGISTERED
  -> send welcome email
  -> send verification email

PASSWORD_RESET_REQUESTED
  -> send password reset email

PASSWORD_RESET_SUCCESS
  -> send password reset success email

VERIFY_EMAIL_REQUESTED
  -> send verification email

VERIFY_EMAIL_SENT
  -> send verification success email
```

If processing succeeds, the worker marks the event as `PROCESSED`.

If processing fails, the worker increments the attempt count and stores the error.

If attempts remain, the event goes back to `PENDING` with a later `nextAttemptAt`.

If attempts are exhausted, the event becomes `FAILED`.

That is the difference between a lost side effect and a recoverable side effect.

The system can see what failed.

The system can retry.

The system can stop after a defined limit.

## Retry Strategy

Retries are useful, but retrying immediately can make an outage worse.

If the email provider is down, hammering it every millisecond will not help.

Rivo uses a simple backoff strategy:

```text
attempt 1 -> retry after 1 minute
attempt 2 -> retry after 5 minutes
attempt 3 -> retry after 15 minutes
later attempts -> retry after 1 hour
```

This gives temporary failures time to recover.

It also prevents the worker from creating unnecessary pressure on the failing dependency.

After the maximum number of attempts, the event is marked as `FAILED`.

That failed event is still valuable.

It can be inspected.

It can be logged.

It can become the basis for an admin retry tool later.

Failure is not hidden.

## Why At-Least-Once Delivery Matters

The Outbox pattern usually gives at-least-once delivery.

That means the side effect should happen one or more times.

It should not be silently lost.

But duplicates are possible.

Here is the classic failure case:

```text
Worker claims event
Worker sends email successfully
Application crashes before marking event as PROCESSED
Worker starts again
Event is retried
Email may be sent again
```

This is why outbox-based systems should assume handlers may run more than once.

For some workflows, a duplicate is annoying but acceptable.

For example, sending two verification emails is not ideal, but it is usually better than sending none.

For other workflows, such as payments, duplicate processing can be dangerous.

Those workflows need stronger idempotency controls.

The Outbox pattern does not magically give exactly-once behavior.

It gives a practical reliability model:

At-least-once delivery plus idempotent processing.

## The Problem Of Stale Events

Rivo had one practical issue that is easy to miss.

Verification codes can change.

A user might register, wait, and then request another verification code.

Or they might repeat the signup flow while the account is still pending.

That creates a subtle risk.

An old outbox event may still contain an old verification code.

If the worker later sends that stale event, the user receives a code that no longer works.

That is bad UX.

The user did what the email told them to do, but the backend rejects the code.

So Rivo retires stale pending events in the pending signup refresh flow.

Older `USER_REGISTERED` events for the same user are marked as `FAILED`.

The reason is stored as:

```text
Superseded by newer verification code
```

This is an important lesson.

The Outbox pattern makes intent durable.

But durable intent still has to represent the current business truth.

If newer events replace older events, the application needs rules for retiring stale work.

## Why Not Just Use A Queue Directly?

A queue or broker is useful.

But directly publishing to a broker after a database commit still leaves the same gap.

```text
Save user in database
Publish event to broker
```

If the database save succeeds and the publish fails, the event is lost.

If the publish succeeds but the database transaction later fails, consumers may hear about a change that never committed.

The Outbox pattern avoids that by making the database the source of truth for both:

- the state change
- the intent to publish or send the side effect

The relay can publish later.

That small change removes a dangerous timing dependency from the request path.

## Why Not Make The Whole Thing Synchronous?

Synchronous side effects are easier to understand.

They also make the user wait for external systems.

If the email provider is slow, signup becomes slow.

If the email provider is down, signup may fail even though the user data could be safely stored.

That couples the request path to the health of a dependency that does not need to be part of the immediate response.

The Outbox pattern creates a boundary.

The API accepts and persists the business operation.

The worker handles the side effect.

The database connects the two.

This is not only about making the system asynchronous.

It is about making the handoff durable.

## Tradeoffs

The Outbox pattern is powerful, but it is not free.

It adds storage.

Outbox records need indexes, cleanup, and possibly archival.

It adds a worker.

The worker needs scheduling, concurrency control, logs, and retry behavior.

It adds latency.

Events are processed in the background, so delivery is not immediate.

It adds duplicate risk.

At-least-once processing means handlers must be safe to retry.

It adds operational responsibility.

Failed events need to be visible.

Retries need limits.

Metrics and alerts become important once the system is production-facing.

The pattern is worth it when the side effect matters.

If losing the side effect would break a user flow, create inconsistent state, or require manual repair, the outbox is usually a good tradeoff.

## Common Pitfalls

### Treating Logs As Recovery

Logs can tell you something failed.

They cannot reliably continue the workflow.

An outbox event can.

### Retrying Forever

Infinite retries can hide poison events and overload dependencies.

Use attempt counts, backoff, and terminal failure states.

### Forgetting Idempotency

The worker can process the same event more than once in rare failure scenarios.

Design consumers and side effects with that in mind.

### Letting The Table Grow Forever

Processed and failed events should eventually be archived or purged based on business and audit needs.

An outbox is operational data.

It needs lifecycle management.

### Ignoring Stale Business Intent

Some events become invalid when newer state replaces them.

Verification codes are a good example.

If the code changes, old email events may need to be retired.

## The Main Lesson

The Outbox pattern is not about adding architecture for the sake of architecture.

It solves a specific reliability gap.

The gap between:

```text
The database changed.
```

And:

```text
The rest of the system was told about it.
```

In Rivo, that gap appeared in authentication workflows.

User registration, verification emails, password reset emails, and success notifications all depended on side effects happening after database changes.

Without an outbox, those side effects could be lost if the process crashed or the email provider failed at the wrong moment.

With an outbox, the system remembers what needs to happen next.

The worker can process it later.

It can retry.

It can fail visibly.

That distinction matters.

The goal was not simply to make the flow asynchronous.

The goal was to avoid losing business intent.

That is why I used the Transactional Outbox pattern in Rivo.
