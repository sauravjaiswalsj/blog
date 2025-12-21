# MIT 6.120J Maths FOR CS

**Author:** Saurav Jaiswal

---

## Proofs

### Introduction

**Definition.**  
A proof is a method of ascertaining truth.

- experiments  
- sampling  
- legal  
- investigation  
- authority  
- religion  
- inner conviction  
- logic  
- deduction  

**Definition.**  
A mathematical proof is a verification of a proposition by a chain of logical deductions from a base set of axioms.

---

## Propositions

**Definition.**  
A proposition is a statement that is true or false.

Examples:

- $2 + 2 = 4$ is a proposition.  
- $2 + 2 \neq 5$ is also a proposition.  

$$
\forall n \in \mathbb{N},\; n^2 + n + 41 \text{ is a prime}
$$

This proposition is false for all natural numbers.

$$
\exists n \in \mathbb{N},\; n^2 = n + 1
$$

This proposition is false for all natural numbers.

However,

> $n^2 + n + 41$ is a prime

is a **predicate**, not a proposition.

---

### Predicate

**Definition.**  
A predicate is a proposition except that it depends on a variable (a parameterized proposition).

Example:  
$n^2 + n + 41$ is a prime

| n  | $n^2 + n + 41$ | Prime |
|----|----------------|-------|
| 0  | 41             | Yes   |
| 1  | 43             | Yes   |
| …  | …              | …     |
| 41 | $41 \times 43$ | No    |

---

### Goldbach’s Conjecture

**Definition.**  
Goldbach's Conjecture states that every even integer greater than 2 can be expressed as the sum of two primes.

Or:

> Every number greater than 2 is the sum of two primes.

Example:

$$
12 = 7 + 5
$$

---

## Logical Propositions

### Negation

**Definition.**  
The negation of a proposition is the proposition that is true if and only if the original proposition is false.

Notation: $\neg A$, **not A**, or $\lnot A$

| A | $\neg A$ |
|---|----------|
| T | F        |
| F | T        |

---

### Conjunction

**Definition.**  
The conjunction of two propositions is true if and only if both propositions are true.

Notation: $\land$, **and**, or $\wedge$

| A | B | $A \land B$ |
|---|---|-------------|
| T | T | T           |
| T | F | F           |
| F | T | F           |
| F | F | F           |

---

### Disjunction

**Definition.**  
The disjunction of two propositions is true if and only if at least one proposition is true.

Notation: $\lor$, **or**, or $\vee$

| A | B | $A \lor B$ |
|---|---|------------|
| T | T | T          |
| T | F | T          |
| F | T | T          |
| F | F | F          |

---

### Implication

**Definition.**  
The implication of two propositions is true if and only if the first proposition is false or the second proposition is true.

Notation: $\implies$, **if–then**, or $\rightarrow$

| A | B | $A \implies B$ |
|---|---|----------------|
| T | T | T              |
| T | F | F              |
| F | T | T              |
| F | F | T              |

$A \implies B$ is equivalent to:

$$
B \lor \neg A
$$

- $A \implies B$  
- $B \implies A$ → **Converse**  
- $\neg B \implies \neg A$ → **Contrapositive**  
- $\neg A \implies \neg B$ → **Inverse**

**Equivalent Relations:**

- $A \implies B$ is equivalent to $\neg B \implies \neg A$ (contrapositive)  
- $\neg A \implies \neg B$ (inverse) is equivalent to $B \implies A$ (converse)

---

## Set Theory

### Set

**Definition.**  
A set is a collection of objects.

Examples:

$$
A = \{6, 1, 2, 0\}
$$

$$
B = \{2, \{3, 4\}, \varnothing\}
$$

$$
\mathbb{N} = \{0, 1, 2, 3, 4, \dots\}
$$

$$
\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, 3, \dots\}
$$

- $\mathbb{Q}$ → Rational  
- $\mathbb{R}$ → Real  
- $\mathbb{I}$ → Complex  

Empty set: $\varnothing$ or `{}`

Does $3 \in B$? **No**

---

### Subset

**Definition.**

- $x \in A$ means $x$ is an element of $A$  
- $A \subseteq B$ means $A$ is a subset of $B$

Examples:

- $\{2, 1\} \subseteq A$ → Yes  
- $\varnothing \subseteq A$ → Yes  

**Union**

$$
A \cup B = \{6, 1, 2, 0, \{3,4\}, \varnothing\}
$$

**Intersection**

$$
A \cap B = \{2\}
$$

**Set Difference**

$$
A - B = \{6, 1, 0\}
$$

---

### Set Builder Notation

**Definition.**  
A method to describe a subset using a predicate.

$$
\{ n \in \mathbb{N} \mid \text{isPrime}(n) \} = \{2, 3, 5, 7, 11, \dots\}
$$

---

### Tuples

**Definition.**  
An ordered list of elements.

- Order matters  
- Repetition allowed  
- Uses parentheses `()`

$$
(6,1,2,0) \neq (6,1,2,0,0) \neq (2,1,6,0)
$$

---

## Axioms

**Definition.**  
An axiom is a proposition assumed to be true.

**Lemma.**  
If $a = b$ and $b = c$, then $a = c$.

**Lemma.**  
For every point $p$ and line $l$ with $p \notin l$, there exists a unique line $l'$ through $p$ parallel to $l$.

**Lemma.**  
Given a line $l$ and a point $p \notin l$, there is no line through $p$ parallel to $l$.

**Lemma.**  
Given a line $l$ and a point $p \notin l$, there are infinitely many lines through $p$ parallel to $l$.

**Definition.**  
A set of axioms is **consistent** if no proposition can be both proved and disproved.

**Definition.**  
A set of axioms is **complete** if every proposition can be either proved or disproved.

**Theorem (Gödel’s Incompleteness Theorem).**  
No set of axioms is both complete and consistent.
