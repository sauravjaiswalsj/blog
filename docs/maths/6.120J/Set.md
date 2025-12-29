# Set Theory –
## Basic Set Expressions

* `A ∪ B` — union
* `A ∩ B` — intersection
* `A \ B` — set difference
* `B \ A` — reverse difference
* `A ⊆ B` — subset
* `A ⊂ B` — proper subset
* `A ⊇ B` — superset
* `A = B` — equality
* `A ≠ B` — inequality
* `∅` — empty set
* `{a}` — singleton
* `{a, b}` — finite set

---

## Membership

* `x ∈ A` — element of
* `x ∉ A` — not an element of

---

## Power & Product

* `𝒫(A)` or `P(A)` — power set
* `A × B` — Cartesian product

---

## Indexed / Big Operations

* `⋃ A` — union of a family of sets
* `⋂ A` — intersection of a family of sets
* `⋃_{i∈I} A_i` — indexed union
* `⋂_{i∈I} A_i` — indexed intersection

---

## Relations & Functions

* `R ⊆ A × B` — relation
* `f : A → B` — function
* `dom(f)` — domain
* `ran(f)` — range
* `f(x)` — function value

---

## Special Sets

* `ℕ` — natural numbers
* `ℤ` — integers
* `ℚ` — rationals
* `ℝ` — real numbers
* `ℂ` — complex numbers

---

## Cardinality

* `|A|` — cardinality of `A`
* `|A| = |B|` — same size
* `|A| < |B|` — smaller cardinality

---

## Logic Used in Sets

* `{x ∈ A | P(x)}` — set-builder notation
* `∀x ∈ A` — for all
* `∃x ∈ A` — there exists

---

## Language

**Symbols**

* Variables: `x, y, z, a, b, A, B`
* Membership: `∈`
* Equality: `=`
* Logical symbols: `¬ ∧ ∨ → ↔`
* Quantifiers: `∀ ∃`

---

## Axioms of ZFC

### 1. Axiom of Extensionality

Two sets are equal iff they have the same elements.

```
∀x ∀y (∀z (z ∈ x ↔ z ∈ y) → x = y)
```

---

### 2. Axiom of Empty Set

There exists a set with no elements.

```
∃x ∀y (y ∉ x)
```

---

### 3. Axiom of Pairing

For any two sets, there exists a set containing exactly them.

```
∀x ∀y ∃z ∀w (w ∈ z ↔ (w = x ∨ w = y))
```

---

### 4. Axiom of Union

For any set, there exists a set containing all elements of its elements.

```
∀x ∃u ∀y (y ∈ u ↔ ∃z (y ∈ z ∧ z ∈ x))
```

---

### 5. Axiom of Power Set

For any set, there exists the set of all its subsets.

```
∀x ∃p ∀y (y ∈ p ↔ y ⊆ x)
```

where

```
y ⊆ x ≡ ∀z (z ∈ y → z ∈ x)
```

---

### 6. Axiom of Infinity

There exists an infinite set.

```
∃x (∅ ∈ x ∧ ∀y (y ∈ x → y ∪ {y} ∈ x))
```

---

### 7. Axiom Schema of Separation

Subsets defined by a property exist.

```
∀x ∃y ∀z (z ∈ y ↔ (z ∈ x ∧ φ(z)))
```

(φ is any formula)

---

### 8. Axiom Schema of Replacement

Images of sets under definable functions are sets.

```
∀x (∀y ∃!z φ(y,z) → ∃u ∀z (z ∈ u ↔ ∃y (y ∈ x ∧ φ(y,z))))
```

---

### 9. Axiom of Foundation (Regularity)

Every nonempty set has an ∈-minimal element.

```
∀x (x ≠ ∅ → ∃y (y ∈ x ∧ y ∩ x = ∅))
```

---

### 10. Axiom of Choice

Every family of nonempty sets has a choice function.

```
∀x ( (∀y (y ∈ x → y ≠ ∅)) → ∃f ∀y (y ∈ x → f(y) ∈ y))
```

---

## Standard Definitions (Formulas)

### Empty Set

```
∅ ≡ {x | x ≠ x}
```

---

### Subset

```
A ⊆ B ≡ ∀x (x ∈ A → x ∈ B)
```

---

### Proper Subset

```
A ⊂ B ≡ (A ⊆ B ∧ A ≠ B)
```

---

### Intersection

```
A ∩ B = {x | x ∈ A ∧ x ∈ B}
```

---

### Union of Two Sets

```
A ∪ B = {x | x ∈ A ∨ x ∈ B}
```

---

### Set Difference

```
A \ B = {x | x ∈ A ∧ x ∉ B}
```

---

### Ordered Pair (Kuratowski)

```
(a,b) ≡ {{a},{a,b}}
```

---

### Cartesian Product

```
A × B = {(a,b) | a ∈ A ∧ b ∈ B}
```

---

### Relation

```
R ⊆ A × B
```

---

### Function

```
f ⊆ A × B ∧ ∀x ∈ A ∃!y ((x,y) ∈ f)
```

---

### Domain

```
dom(f) = {x | ∃y ((x,y) ∈ f)}
```

---

### Range

```
ran(f) = {y | ∃x ((x,y) ∈ f)}
```

---

### Natural Numbers (von Neumann)

```
0 = ∅
n+1 = n ∪ {n}
```

---

## Notes

* ZFC generates **infinitely many formulas**
* Every theorem is a formula derived from these axioms
* This is the **standard foundation of modern mathematics**

---

If you want, I can also:

* Export this as a downloadable `.md` file
* Add **Peano arithmetic**, **ordinals**, or **cardinals**
* Rewrite using **first-order logic only**
* Simplify for **school / contest level**

Just tell me.
