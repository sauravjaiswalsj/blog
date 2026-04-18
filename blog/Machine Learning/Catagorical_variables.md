---
title: Understanding Categorical Variables
description: A comprehensive guide on how to handle non-numeric data in Machine Learning pipelines.
authors: [saurav]
tags: [machine-learning, data-science, preprocessing]
---

Handling Categorical Variables is one of the most critical steps in any Machine Learning pipeline. Since most algorithms are mathematical engines, they cannot process raw text directly. 

<!-- truncate -->

## 1. What are Categorical Variables?

In simple terms, categorical variables are columns that represent **labels or categories** rather than continuous numbers. Common examples include:
- **Nominal:** City names, colors, car brands, gender (no inherent order).
- **Ordinal:** Ratings (Good, Better, Best), Education level (High School, PhD).

In Pandas, these usually appear as `object` or `category` dtypes. While we often think of them as "text columns," they can also be numbers (e.g., `1=Silver, 2=Gold`) if those numbers represent specific categories.

---

## 2. Why is Encoding Mandatory?

Most classical Machine Learning models (Linear Regression, Random Forest, XGBoost, etc.) are based on mathematical equations. They require **Numeric Matrices** as input.

If you pass "Red" or "New York" directly:
1. The model will throw an error because it cannot perform math on a string.
2. Even if it doesn't crash, it wouldn't know if "Red" is greater than "Blue."

**Encoding** is the process of converting these categories into a numeric format that the model can understand without losing the underlying meaning.

---

## 3. Tabular NNs vs. NLP Transformers (Internal Pipelines)

One major confusion is whether modern deep learning models "skip" encoding. They don't—they just handle it differently.

### a. Tabular Models (Classical)
For algorithms like Random Forest, we manually choose an encoding strategy:
- **Label/Ordinal Encoding:** Giving each category a rank.
- **One-Hot Encoding:** Creating 0/1 columns for every category.

### b. Neural Networks with Categorical Features (Tabular)
In Tabular NNs (Keras, PyTorch, etc.), you still map categories to **Integers** first, then choose one of two paths:
1.  **Simple One-Hot Vectors:** (Common for small sets of categories).
2.  **Embedding Layers (Standard Modern Approach):** 
    - **What it does:** It is a **lookup table of learnable weights** — each category maps to a small dense vector (e.g., dimension 8, 16, or 32).
    - **How it works:** These vectors are updated by **backpropagation**, just like any other weight in the network. The "closeness" of similar categories (e.g., "Chicago" and "New York") is a *consequence* of shared gradient signals during training — it's not a built-in mechanism, it emerges from the data.
    - **The Chain:** `Categorical Values` → `Integer IDs` → `Embedding Lookup` → `Neural Network`.

### c. Transformers with Text (NLP)
Transformers also cannot process raw strings. They use a specialized pipeline that hides the categorical nature of text inside a library (like HuggingFace):
1.  **Tokenization:** Raw Text → Tokens (Words or sub-words, e.g., `"Hello world"` → `["Hello", "world"]`).
2.  **Integer Mapping:** Each token is assigned a unique **Integer ID** from a fixed vocabulary index.
3.  **Dense Embeddings:** These IDs pass through an embedding layer that maps them to high-dimensional dense vectors (e.g., **768-dimensional** for BERT/GPT).
4.  **Transformation:** Finally, the Transformer layers operate on these numeric vectors.

**The Key Insight:** Transformers are technically handling **categorical values** (where every token is a category), but the encoding pipeline (Tokenizer + Embeddings) is usually hidden inside the library.

---

## 4. Handling Strategies: A Comparison

When working with tabular data (like a CSV), there are three primary ways to handle these variables:

### Strategy 1: Dropping (The Baseline)
- **Action:** Simply delete all text columns.
- **Verdict:** Fast and easy, but usually results in the **worst performance** because you are losing valuable information.
- **Effect on MAE / Performance:** Because entire feature columns are discarded, the model has less information to learn from. MAE is typically the **highest** (worst) of all strategies. Think of it as the floor — the minimum your model can do. Use this only to establish a quick baseline, then beat it with encoding.

```python
# Drop all columns with object (text) dtype
X_train_drop = X_train.select_dtypes(exclude=['object'])
X_val_drop   = X_val.select_dtypes(exclude=['object'])
```

### Strategy 2: Ordinal Encoding
- **Action:** Assigns each unique value a different integer (0, 1, 2...).
- **Best Use:** Best for **genuinely ranked data** or ordinal data where the order matters (e.g., `Small < Medium < Large`).
- **Risk (model-dependent):** The severity of applying this to nominal data depends on your algorithm:
  - **Tree-based models** (Random Forest, XGBoost) can partially handle arbitrary integer labels because they split on thresholds (e.g., `City <= 1.5`), so the fake ordering does less damage. (or in simple ways: Tree-based models don't assume any ordering between categories because they split on thresholds, not by comparing values. or Can confuse the model if applied to nominal data (e.g., suggesting that "Chicago" is "greater than" "New York")).
  - **Linear models** (Linear Regression, Logistic Regression) will *literally compute* "Chicago = 2 × New York" and produce nonsense gradients. Never use ordinal encoding on nominal data with linear models.
- **Effect on MAE / Performance:** A clear step up from Dropping — the model now has access to categorical information. With tree-based models on ordinal or even nominal data, MAE **drops noticeably** compared to the baseline. However, if used on nominal data with a linear model, predictions can actually get *worse* than dropping because the false ordering adds misleading signal.

```python
from sklearn.preprocessing import OrdinalEncoder

# Identify categorical columns
cat_cols = X_train.select_dtypes(include=['object']).columns.tolist()

ordinal_enc = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)

X_train_ord = X_train.copy()
X_val_ord   = X_val.copy()

# fit on train, transform both — never fit on val/test
X_train_ord[cat_cols] = ordinal_enc.fit_transform(X_train[cat_cols])
X_val_ord[cat_cols]   = ordinal_enc.transform(X_val[cat_cols])
```

### Strategy 3: One-Hot Encoding
- **Action:** Creates a new 0/1 binary column for every unique category.
- **Best Use:** Best for **Nominal data** with a manageable number of unique values (e.g., Color: Red, Blue, Green).
- **Cons — The High Cardinality Problem:** If a column has 1,000 unique cities, you create 1,000 new columns. This is known as the **curse of dimensionality** — your feature space explodes, training slows down, and models risk overfitting.
- **Effect on MAE / Performance:** For nominal data with low cardinality, this typically produces the **best or near-best MAE** among classical encoding methods. The model sees true independence between categories (no fake ordering). With high-cardinality columns however, performance can degrade due to dimensionality blowup — and training time increases significantly.

```python
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

cat_cols = X_train.select_dtypes(include=['object']).columns.tolist()
num_cols = X_train.select_dtypes(exclude=['object']).columns.tolist()

oh_enc = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

# Encode categorical columns
oh_train = pd.DataFrame(oh_enc.fit_transform(X_train[cat_cols]),
                        columns=oh_enc.get_feature_names_out(cat_cols))
oh_val   = pd.DataFrame(oh_enc.transform(X_val[cat_cols]),
                        columns=oh_enc.get_feature_names_out(cat_cols))

# Merge back with numeric columns
X_train_oh = pd.concat([X_train[num_cols].reset_index(drop=True), oh_train], axis=1)
X_val_oh   = pd.concat([X_val[num_cols].reset_index(drop=True),   oh_val],   axis=1)
```

### Strategy 4: Target Encoding
- **Action:** Replaces each category with the **mean target value** for that group (e.g., replace `City = "Chicago"` with the average house price for Chicago).
- **Best Use:** The go-to for **high-cardinality** columns (zip codes, user IDs, product SKUs) where One-Hot would explode dimensionality.
- **Risk:** Can cause **data leakage** if not done properly — always apply it inside cross-validation folds, not on the full dataset.
- **Effect on MAE / Performance:** When done correctly (inside CV folds), Target Encoding often gives the **lowest MAE** on high-cardinality features. It directly encodes the relationship between a category and the target, so the model gets a highly informative signal without any dimensionality cost. When done incorrectly (leakage), it will look artificially great on training data but fail badly on validation/test.

```python
from sklearn.preprocessing import TargetEncoder

cat_cols = X_train.select_dtypes(include=['object']).columns.tolist()

target_enc = TargetEncoder()

X_train_te = X_train.copy()
X_val_te   = X_val.copy()

# fit_transform on train (uses y_train), transform val without y
X_train_te[cat_cols] = target_enc.fit_transform(X_train[cat_cols], y_train)
X_val_te[cat_cols]   = target_enc.transform(X_val[cat_cols])
```

> [!WARNING]
> `TargetEncoder` is available in **scikit-learn ≥ 1.3**. For older versions, use the `category_encoders` library: `pip install category_encoders`.

> [!NOTE]
> **Footnote — Binary / Hash Encoding:** Sits between Ordinal and One-Hot. It converts the integer ordinal ID into its binary representation (e.g., category `5` → `[1, 0, 1]`). Useful for medium-high cardinality where you want a compact representation without the blowup of One-Hot.

---

## 5. Summary Table

| Strategy | Order Preserved? | Dimensionality | Best For |
| :--- | :--- | :--- | :--- |
| **Drop** | — | Reduced | Quick baselines only |
| **Ordinal** | Yes (imposed) | Same | Genuinely ranked data, tree-based models |
| **One-Hot** | No (independent) | Expands | Nominal, low cardinality |
| **Target Encoding** | Implicit (via target) | Same | High cardinality, tabular ML |
| **Embeddings** | Learned from data | Compact dense | Neural Networks, high cardinality |

---

## 6. The Refined Definition (The "Pro" Version)

If you're explaining this to a teammate, here is the tighter, technically accurate formulation:

> Every ML model is fundamentally a mathematical function — it can only operate on numbers. A categorical variable is a variable whose values come from a *finite, unordered (or ordered) set of labels*. **Encoding is the bridge** between those labels and the numeric space the model needs.
>
> The right encoding depends on two things: **(1) does the category have a natural order?** and **(2) how many unique values does it have?** Ordinal encoding preserves order but invents magnitude. One-hot encoding preserves independence but explodes dimensionality. Embeddings learn *both* order and relationships from data, but require enough training signal to do so meaningfully.

- **Concept over Type:** Categories don't have to be text — numbers like `1=Silver, 2=Gold` can be categorical if they represent labels, not quantities.
- **Deep Learning Secret:** Even Transformers don't "read" words. They use a **Tokenizer + Embedding** pipeline to turn text into learned numeric vectors before processing. The encoding is the same idea, just hidden inside the library.

---

## 7. Interview-Ready Answer 🎤

**Question:** *"How do you handle categorical variables in classical ML vs. Neural Networks?"*

**Answer:** 
> "In **Classical ML** (like Random Forests), we typically use **One-Hot Encoding** for nominal data or **Ordinal Encoding** when there's a natural rank. The goal is to transform categories into a fixed numeric matrix that the model can split on.
> 
> However, in **Neural Networks** or **Transformers**, we prefer using **Embedding Layers**. Instead of hard-coding 0s and 1s, the model learns a dense vector representation for each category during training. This allows the model to capture complex relationships, where similar categories end up closer to each other in the vector space."

> [!TIP]
> **Pro-Tip:** Always mention that you check for **High Cardinality** (too many unique values) before choosing One-Hot Encoding, as it can lead to memory issues and overfitting.
