---
id: lec-1-QnA
title: "Lecture 1 — Exam Q&A: k-NN, Linear Classifiers & Representations"
sidebar_label: "Lec 1 Q&A"
---

# Lecture 1 — Exam Q&A

These notes answer the exact questions the professor hinted at in Lecture 1. Each answer is written in a clear, exam-ready format with intuition, examples, and where needed, simple maths.

> [!TIP]
> The professor explicitly said: *"This is the type of exam question you are going to get."* Pay close attention to the **K effects on k-NN**, the **linear vs non-linear question**, and the **fold-and-cut analogy**.

---

## Part 1 — k-Nearest Neighbours (k-NN)

### Q1. What is the effect of choosing K = 1 in a k-NN classifier?

**Algorithm recap:** In k-NN, when you want to classify a new point, you look at its **K nearest neighbours** in the training data (using a distance measure like Euclidean distance) and take a **majority vote** of their labels.

When **K = 1**, the rule becomes trivially simple:
> "Classify the new point with the same label as its single closest training point."

**Consequences:**

- **Very jagged, complex decision boundary:** The boundary follows every individual training point. If a training point is in an unusual position (e.g., a single spam email with very few links), that one point creates a tiny "island" in the feature space with the wrong label.
- **Sensitive to noise and outliers:** Imagine a mislabelled training example — one doctor wrote "healthy" for a patient who actually had cancer. With 1-NN, any new point landing near that mislabelled point will inherit the wrong answer.
- **High variance:** If you retrain on a slightly different dataset (say, with a few new examples), the entire decision boundary can change dramatically — it is *unstable*.
- **Training accuracy ≈ 100%:** Each training point is its own nearest neighbour (distance 0), so it always "gets itself right." But this is misleading — the model has simply memorised the training set (overfitting).

**Exam-ready summary:**
> *"K = 1 produces a highly flexible classifier with a jagged, data-dependent boundary. It is highly sensitive to noise and outliers, has high variance, and tends to overfit — performing well on training data but poorly on unseen data."*

---

### Q2. What happens when K is very large (e.g., K = total number of training samples)?

If **K = N** (where N is the total number of training points), every query point will look at *all* training examples as its neighbours.

**Majority vote on the whole dataset:** The prediction becomes:
> "Always predict whatever the most common class in the training set is."

**Consequences:**

- **Decision boundary collapses:** There is effectively no boundary — the model returns the same label for every single input point, regardless of where it is in the feature space.
- **Spatial structure is ignored:** Even if your new point looks exactly like a cancer cell (very brown, very large), the model will still output "healthy" if healthy examples are the majority in training. Location in feature space means nothing.
- **High bias, zero variance:** The model is too simple. It does not learn any pattern from the data — it just reports the global majority class.
- **Terrible on minority classes:** Any minority class will be completely suppressed. If 80% of training data is "healthy," every patient will be called healthy — clearly useless.

**Exam-ready summary:**
> *"K = N makes k-NN equivalent to a 'predict majority class always' rule. Spatial structure is ignored, generalisation is poor, and the classifier has high bias and zero variance."*

---

### Q3. Qualitatively, how does the choice of K affect k-NN behaviour?

This is the **bias-variance trade-off** expressed through K.

| K value | Boundary | Noise | Bias | Variance |
| :--- | :--- | :--- | :--- | :--- |
| Very small (1, 3) | Jagged, complex, wiggly | Very sensitive | Low | High |
| Moderate (7–15) | Smoother, balanced | Moderate | Balanced | Balanced |
| Very large (N) | Flat / collapsed | Effectively immune | High | Low |

**Intuition with an analogy:**

Imagine you are deciding whether a restaurant is good. 
- If you ask **only 1 person** (K=1), and they happened to have a bad experience on a bad day (outlier), your judgement will be wrong.
- If you ask **everyone who ever visited** (K=N), you always get the same answer regardless of the specific restaurant.
- If you ask **a sensible group of ~10 locals** (moderate K), you get a reliable, balanced opinion.

**Exam-ready summary:**
> *"Increasing K smooths the decision boundary, reduces the effect of noise, and lowers variance but increases bias. Decreasing K makes the boundary more complex, sensitive to noise, and increases variance while lowering bias. The optimal K balances this trade-off, typically chosen via cross-validation."*

---

### Q4. Is k-NN a linear or non-linear classifier? Why?

**What is a linear classifier?**

A linear classifier separates classes using a single straight decision boundary — a **line** in 2D, a **plane** in 3D, or a **hyperplane** in higher dimensions. It is described by:

$$f(x) = w^T x + b = 0$$

where $w$ and $b$ are fixed parameters. The boundary is *one global straight object*.

**Is k-NN linear?**

**No — k-NN is a non-linear classifier.** Here is why:

- k-NN does not learn a single global $w$ or $b$. There are no parameters to optimise.
- The decision boundary is *implicitly* defined by the distribution of training points in the feature space.
- The resulting boundary can take **any shape**: curved, piecewise, multi-region, even with "islands" (a pocket of class A surrounded entirely by class B).
- For K=1, the decision boundary is a **Voronoi diagram** — a collection of straight-line segments, but collectively forming a highly non-linear, irregular shape.

**Example:** Consider two classes arranged in a spiral pattern in 2D. A single straight line cannot separate them. k-NN (with a small K) can handle this naturally because its boundary adapts to the local neighbourhood of every test point.

**Exam-ready summary:**
> *"k-NN is a non-linear classifier. It does not learn a fixed hyperplane; instead, its decision boundary is implicitly defined by the training data and can be arbitrarily complex and non-linear. For K=1, the boundary corresponds to the Voronoi tessellation of the training set, which is globally non-linear."*

---

### Q5. What is a hyperparameter? Why is K a hyperparameter?

**Parameters vs Hyperparameters:**

| Type | Definition | Examples |
| :--- | :--- | :--- |
| **Parameter** | Learned *from* training data by the model itself | Weights $w, b$ in linear regression; centroids in k-means |
| **Hyperparameter** | Set *by the user* before training; controls how learning happens | K in k-NN; learning rate; tree depth; regularisation $\lambda$ |

**Why is K a hyperparameter?**

The training algorithm for k-NN does *nothing* — it just stores the training data (lazy learning). It does not adjust K based on data. **You** choose K, and then the algorithm uses that fixed K to classify every new point.

Choosing a good K requires a search process (e.g., trying K = 1, 3, 5, 7, ... and measuring validation accuracy for each) — this is called **hyperparameter tuning**.

**Professor's key insight:**
> *"This is the type of thinking I want you to develop for all models: each model has knobs (hyperparameters); what is the expected impact of a certain choice?"*

**Exam-ready summary:**
> *"A hyperparameter is a setting that controls model behaviour but is not directly learned from training data. In k-NN, K is a hyperparameter: the user sets it before training, it governs the smoothness of the decision boundary and generalisation ability, and it is typically tuned using cross-validation."*

---

## Part 2 — Linear Classifiers, Loss, and Feature Space

### Q6. What is a linear decision boundary in feature space?

**Setup:** Suppose each data point is described by two features — for a cancer cell, this might be:
- $x_1$ = brownness of the cell
- $x_2$ = size of the cell

Each cell becomes a **point** in a 2D space (brownness, size). Now we want to draw a line that best separates tumour cells from healthy ones.

**The linear classifier defines this boundary as:**

$$w_1 x_1 + w_2 x_2 + b = 0$$

Or, in compact notation using a weight vector $w$ and bias $b$:

$$f(x) = w^T x + b = 0$$

**Decision rule:**
- If $f(x) \geq 0$ → predict **Class +1** (e.g., tumour)
- If $f(x) < 0$ → predict **Class −1** (e.g., healthy)

**What does this look like geometrically?**

The equation $w^T x + b = 0$ defines a **hyperplane** — a line in 2D, a plane in 3D. The weight vector $w$ is **perpendicular** to this line and points toward the positive class. $b$ shifts the line away from the origin.

Think of it as a **single straight cut** through the feature space dividing it into exactly two half-spaces, one per class.

**Exam-ready summary:**
> *"A linear decision boundary is the set of points satisfying $w^T x + b = 0$. It is a hyperplane that partitions the feature space into two half-spaces. Points on one side are assigned to class +1, points on the other to class −1."*

---

### 📌 Deep Dive — Understanding $w^T x + b = 0$ from Scratch

If you have never seen this formula before, do not worry. It is actually just the **line equation you already know from school**, written in a more general, scalable way.

---

#### Step 1 — Start with what you know: $y = mx + c$

You already know the equation of a straight line:

$$y = mx + c$$

- $x$ = the input (a number on the x-axis)
- $y$ = the output (a number on the y-axis)
- $m$ = the **slope** (how steep the line is)
- $c$ = the **y-intercept** (where the line crosses the y-axis)

**Example:** $y = 2x + 1$

| $x$ | $y$ |
| :---: | :---: |
| 0 | 1 |
| 1 | 3 |
| 2 | 5 |

This is a line going upward. Simple.

---

#### Step 2 — Rewrite it as a boundary equation

In classification, we do not care about predicting a value of $y$. We want to know: **which side of the line is a point on?**

So instead of $y = mx + c$, rearrange to move everything to one side:

$$mx - y + c = 0$$

Now rename things to be more general. Call $m$ as $w_1$, call $-1$ as $w_2$, and $c$ as $b$:

$$w_1 x_1 + w_2 x_2 + b = 0$$

This is **exactly the same line**, just written differently — and now it works with two input features $x_1$ and $x_2$ instead of just $x$.

> **Connection:** $y = mx + c$ is a special case of $w_1 x_1 + w_2 x_2 + b = 0$ where $w_1 = m$, $w_2 = -1$, and $b = c$.

---

#### Step 3 — What are $w$, $x$, and $b$?

| Symbol | What it is | Analogy |
| :--- | :--- | :--- |
| $x$ | Your **data point** (a list of features) | A specific cancer cell: (brownness=0.7, size=12) |
| $w$ | The **weights** (how much each feature matters) | "How important is brownness vs size for the decision?" |
| $b$ | The **bias** (shifts the line left/right) | Same as $c$ in $y = mx + c$ — the y-intercept |
| $w^T x$ | The **dot product** — multiply matching entries and add them up | $w_1 \times x_1 + w_2 \times x_2$ |

---

#### Step 4 — What is a dot product ($w^T x$)?

The $T$ in $w^T$ means **transpose** — it just means "write $w$ as a row instead of a column, so multiplication works out."

The operation $w^T x$ is simply:

$$w^T x = w_1 \cdot x_1 + w_2 \cdot x_2 + \ldots + w_n \cdot x_n$$

**Concrete example:** Suppose we have two features (brownness, size) for a cancer cell:

- Cell: $x = (0.7, 12)$ → brownness = 0.7, size = 12
- Learned weights: $w = (3, -1)$ → brownness matters 3× more, size slightly negative effect
- Bias: $b = -2$

Then:

$$w^T x + b = (3 \times 0.7) + (-1 \times 12) + (-2) = 2.1 - 12 - 2 = -11.9$$

Since $-11.9 < 0$, this cell is classified as **Class −1 (healthy)**.

Now try another cell with $x = (0.9, 2)$ (very brown, very small):

$$w^T x + b = (3 \times 0.9) + (-1 \times 2) + (-2) = 2.7 - 2 - 2 = -1.3$$

Still negative — classified as healthy. Let's try a very brown, large cell $x = (0.95, 0.5)$:

$$w^T x + b = (3 \times 0.95) + (-1 \times 0.5) + (-2) = 2.85 - 0.5 - 2 = 0.35$$

Since $0.35 > 0$ → classified as **Class +1 (tumour)**. ✅

---

#### Step 5 — Why use $w^T x + b = 0$ instead of $y = mx + c$?

| | $y = mx + c$ | $w^T x + b = 0$ |
| :--- | :--- | :--- |
| **Number of features** | Works for exactly 1 input feature ($x$) | Works for any number of features ($x_1, x_2, \ldots, x_n$) |
| **Purpose** | Predicts a value of $y$ | Draws a boundary — tells you which *side* a point is on |
| **Dimensions** | Line in 2D | Line (2D), plane (3D), hyperplane (any D) |
| **When used** | Regression (predict a number) | Classification (predict a class) |

The formula $w^T x + b = 0$ is just a **generalised, scalable version** of $y = mx + c$ that works in any number of dimensions and makes the classification decision explicit.

> [!NOTE]
> **Summary in plain English:**
> - $y = mx + c$ draws a line between two variables.
> - $w^T x + b = 0$ does the exact same thing — but for data with many features.
> - Points where $w^T x + b > 0$ → one class. Points where $w^T x + b < 0$ → the other class. Points exactly on the line ($= 0$) → the decision boundary.

---



### Q7. How can we learn a linear classifier by minimising a loss?

**Intuition:** You have many possible lines that could separate the data. How do you pick the *best* one?

**Step 1 — Define "how bad" a line is:**

For any line $w^T x + b = 0$, count how many training points it classifies incorrectly. This is called the **0-1 loss**:

$$\mathcal{L}_{0-1}(w, b) = \text{number of misclassified training points}$$

A line that misclassifies 5 out of 100 points has loss 5. A line that misclassifies 20 has loss 20. Lower is better.

**Step 2 — Search for the best parameters:**

The goal becomes:

$$\min_{w, b} \; \mathcal{L}(w, b)$$

"Find the values of $w$ and $b$ that produce the minimum number of errors on training data."

**Why not just use 0-1 loss?**

In practice, 0-1 loss is hard to optimise directly because it is not smooth — a tiny change in $w$ might flip a point from correct to incorrect discontinuously. So we use smoother **surrogate losses**:
- **Logistic loss** (used in Logistic Regression)
- **Hinge loss** (used in SVM)

But the *intuition* is always the same: measure how wrong your line is, then search for the line that minimises that wrongness.

**Exam-ready summary:**
> *"A linear classifier is learned by defining a loss function (e.g., 0-1 loss = misclassification count) that measures how bad a given set of parameters $w, b$ is on training data. We then search for the parameters that minimise this loss — this is the learning problem."*

---

### Q8. What is feature space partitioning? (Cancer cell example)

**Step 1 — Represent the entity as a feature vector:**

A cancer cell has observable properties. We extract two numbers:
- $x_1$ = brownness (e.g., 0.0 to 1.0)
- $x_2$ = size in microns

The cell is now a point $(x_1, x_2)$ in a 2D "feature space."

**Step 2 — Plot all cells:**

Each cell in the dataset becomes a point. Tumour cells cluster in one region (perhaps large and dark), healthy cells in another (small and light).

**Step 3 — Find a partition:**

The classifier draws a **boundary** (line, curve, or region-based rule) that divides this space into labelled zones:
- Zone A: "tumour" — any new cell landing here is classified as tumour.
- Zone B: "healthy" — any new cell landing here is classified as healthy.

**The exam angle:** Every classifier is doing the same thing — partitioning the feature space into labelled regions. Linear classifiers use a straight line. k-NN uses Voronoi regions. Decision trees use axis-aligned rectangles.

**Exam-ready summary:**
> *"Feature space partitioning means dividing the input space into disjoint regions, each associated with a class label. For the cancer cell example, cells are represented as points (brownness, size) in 2D feature space, and the classifier learns a boundary that assigns each region of this space to either 'tumour' or 'healthy'."*

---

## Part 3 — Fold-and-Cut Theorem → Kernels and Representation

### Q9. How does the fold-and-cut analogy explain representation change and linear separability?

**The theorem (real-world version):**

The fold-and-cut theorem states:
> *Any straight-edged shape (a star, a rabbit's silhouette, any polygon) can be produced from a flat piece of paper using a finite number of folds followed by exactly **one single straight cut**.*

The folding can be complex. But the cut is always simple — just one straight line.

**The machine learning mapping:**

| Paper | Machine Learning |
| :--- | :--- |
| Flat paper (2D) | Original feature space |
| Complex shape of data (spirals, rings) | Non-linearly arranged classes |
| Folding the paper | Applying a **non-linear feature mapping** (also called a kernel) |
| Single straight cut | **Linear classifier** in the new (higher-dimensional) space |

**Example:** Suppose two classes are arranged in concentric rings in 2D — the inner ring is Class A and the outer ring is Class B. No straight line in 2D can separate them.

Now add a new feature: $x_3 = x_1^2 + x_2^2$ (the squared distance from the origin). In this new 3D space $(x_1, x_2, x_3)$, the inner ring has small $x_3$ and the outer ring has large $x_3$. A single flat plane (hyperplane) at some threshold $x_3 = c$ now perfectly separates them.

The mapping $(x_1, x_2) \to (x_1, x_2, x_1^2 + x_2^2)$ is the "folding." The separating hyperplane is the "single straight cut."

**The key insight for kernels:**

The **kernel trick** in SVM computes the dot product in this high-dimensional space *without explicitly computing the mapping* — it is computationally efficient folding.

**Exam-ready summary:**
> *"The fold-and-cut theorem provides an intuition for kernel methods: just as complex shapes can be cut with a single straight line after appropriate folding, non-linearly separable data can be separated with a linear classifier after an appropriate non-linear feature mapping (the 'folding'). Changing the representation — or equivalently, changing the distance measure via a kernel — can transform a hard non-linear problem into a simpler linear one."*

---

## Part 4 — The Five Principles of Machine Learning

The professor stated that **all machine learning models obey five philosophical principles** and that these will be revisited throughout the module.

### Q10. State and briefly explain the five principles, with examples.

---

**Principle 1 — Entities Have Representations**

Every real-world object must be described as a structured, numeric representation before a model can operate on it.

- *Example:* A cancer cell cannot be fed directly to a model. We extract features — brownness and size — and represent the cell as a vector $(0.7, 12.4)$.
- *Why it matters:* The quality of the representation largely determines the quality of the model. A bad feature choice (e.g., using cell ID number as a feature) will produce a useless model.

---

**Principle 2 — Representations Are Contextual**

The meaning of a symbol or entity depends on its context, not just its isolated value.

- *Example:* The word **"bank"** means something completely different in "river bank" versus "bank account." An isolated word vector for "bank" cannot capture both senses simultaneously.
- *Modern connection:* This is exactly why **attention mechanisms** and **transformers** were developed — they compute a word's representation based on the surrounding words in a sentence, making representations context-aware.

---

**Principle 3 — Representations Can Generate Objects (Generative Direction)**

A good internal representation can be used not only to classify but to **construct** or **generate** the object it represents.

- *Example 1:* An architectural blueprint (representation) → a building (object). The blueprint contains enough information to reconstruct the real thing.
- *Example 2:* A text prompt (latent representation) → a generated image (object) using diffusion models.
- *Why it matters:* This underpins **generative AI**: models like GPT and DALL-E turn internal representations into new text or images.

---

**Principle 4 — Representations Are Learned from Data (Inductive)**

Rather than humans hand-crafting features, models can **discover** useful representations autonomously from raw data.

- *Example:* Johannes Kepler observed planetary positions for years (raw data) and derived the laws of planetary motion (learned representation of the solar system). He did not know the answer in advance — he *inferred* the structure.
- *Modern connection:* Deep neural networks learn hierarchical visual features (edges → textures → objects) from millions of images, without any human specifying what an "edge" is.

---

**Principle 5 — Causal Representations Enable Intelligent Behaviour**

Moving beyond correlation, a truly intelligent agent must understand **cause and effect**: "If I do X, what will happen?"

- *Example:* Captain Chesley "Sully" Sullenberger landed US Airways Flight 1549 on the Hudson River after both engines failed (2009). He had never trained on that exact scenario. But his deep causal understanding of aerodynamics and his experience let him reason: "Given these conditions, a river landing will be safer than attempting to reach the airport."
- *Why it matters:* Pure pattern matching fails in novel situations. Causal representations allow generalisation to scenarios not seen in training — this is what distinguishes genuine intelligence from memorisation.

---

## Part 5 — Exam Revision Checklist

The professor explicitly asked students to be able to answer these concisely. Practice writing a 4–6 line answer for each:

### k-NN

| Question | Key Points |
| :--- | :--- |
| What is k-NN? | Store training data; for a new point, find K nearest neighbours by distance; majority vote decides class |
| K = 1: effect? | Jagged boundary, sensitive to noise/outliers, overfitting, high variance |
| K = N: effect? | Always predicts majority class, no spatial structure, underfitting, high bias |
| K small vs large? | Small → complex boundary, high variance; Large → smooth boundary, high bias; sweet spot via CV |
| Linear or non-linear? | **Non-linear** — boundary is data-dependent, takes arbitrary shape (e.g., Voronoi regions) |
| K as hyperparameter? | Not learned from data; set by user; controls smoothness; tuned via cross-validation |

### Linear Classifiers

| Question | Key Points |
| :--- | :--- |
| What is a linear decision boundary? | $w^T x + b = 0$ — a hyperplane partitioning the feature space into two half-spaces |
| How do we learn it? | Define a loss (e.g., count misclassifications); minimise that loss over $w$ and $b$ |
| Feature space partitioning? | Map entities to feature vectors → each entity is a point → classifier divides space into labelled regions |

### Fold-and-Cut / Kernels

| Question | Key Points |
| :--- | :--- |
| What does folding represent? | Non-linear feature mapping / kernel — transforming the input space |
| What does the single cut represent? | A linear classifier in the new (higher-dimensional) space |
| Why does this help? | Non-linearly separable data in original space can become linearly separable after mapping |

### Five Principles

| Principle | One-Sentence Summary |
| :--- | :--- |
| Entities have representations | Real-world objects must be encoded as vectors before ML can operate on them |
| Representations are contextual | Meaning depends on context; motivates attention and transformer models |
| Representations generate objects | Good representations can reconstruct/synthesise the original object (generative AI) |
| Representations learned from data | Models discover features automatically; no hand-crafted engineering required |
| Causal representations for intelligence | True intelligence requires understanding cause-effect, not just correlation |
