```markdown
# Machine Learning Notes (Based on Kaggle Intro + Intermediate ML)

These notes summarize what we covered so far: core ML ideas, evaluation, data prep, pipelines, XGBoost, cross‑validation, and data leakage.[web:91][web:93][page:90]

---

## 1. What a Machine Learning Model Does

A machine learning model learns patterns from historical data so it can make predictions on new, unseen data.[web:94]  
We typically have:

- **Features (X)**: Input variables (e.g., number of rooms, location, age of house).[page:1]  
- **Target (y)**: What we want to predict (e.g., house price).[page:2]  

### Decision Trees (Introductory Model)

A decision tree predicts by asking a sequence of if–else questions on features and splitting the data into smaller groups.[page:1]

Example for house prices:

- If `Rooms <= 2.5` → predict 100k.  
- Else if `Distance_to_city <= 5` → predict 300k.  
- Else → predict 200k.  

The tree learns:

- Which features to split on.  
- Where to split them.  
- The predicted value at each leaf (often the average target in that leaf).[page:1]

Trees are easy to visualize and interpret, which is why they are often used as a first model, even though more advanced models (Random Forest, XGBoost) usually perform better.[web:91]

---

## 2. Train / Validation Split and Model Evaluation

We never judge a model only on the data it was trained on, because that usually leads to over‑optimistic estimates (overfitting).[page:3]

### Train / Validation Split

We split the data into:

- **Training set**: Used to fit (`model.fit(X_train, y_train)`) the model.  
- **Validation (or dev) set**: Used only to evaluate performance and compare models.[page:3]

Typical code:

```python
from sklearn.model_selection import train_test_split

X_train, X_valid, y_train, y_valid = train_test_split(
    X, y, train_size=0.8, test_size=0.2, random_state=0
)
```

### Mean Absolute Error (MAE)

For regression, we often use **Mean Absolute Error**: the average absolute difference between predictions and true values.[web:23]

If we have true values \(x_i\) and predictions \(y_i\) for \(n\) data points,  

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} \lvert y_i - x_i \rvert
$$

Interpretation:

- “On average, our predictions are off by this many units (e.g. dollars).”[web:23][web:28]  
- Lower MAE is better.  

Using MAE on the validation set gives a more realistic picture of how the model will perform on new data.[page:3]

---

## 3. Underfitting and Overfitting

### Underfitting

A model underfits when it is **too simple** to capture the important patterns in the data.[page:64]

Symptoms:

- High error on training data.  
- High error on validation data.  

Example: A very shallow decision tree (or one with very few leaves) that predicts almost the same value for many different kinds of houses.[page:64]

### Overfitting

A model overfits when it is **too complex** and learns noise or random fluctuations in the training data.[page:64]

Symptoms:

- Very low error on training data.  
- Much higher error on validation data.  

Example: A very deep decision tree with many leaves and very few examples per leaf; it “memorizes” the training set, but fails on new houses.[page:64]

### Finding the “Sweet Spot”

We tune model complexity (e.g., `max_leaf_nodes` for a decision tree) to balance underfitting and overfitting:

- Small number of leaves → underfit.  
- Extremely large number of leaves → overfit.  
- Intermediate value → best validation performance.[page:64]

Typical pattern: for several values of `max_leaf_nodes`, compute validation MAE and pick the value with minimum MAE.[page:64]

---

## 4. Missing Values

Real-world datasets often have missing values, and most ML models cannot handle them directly.[page:65]

### Strategies for Handling Missing Data

1. **Drop columns with missing values**

   - Remove any column that has at least one missing value.  
   - Pros: Very simple; avoids dealing with imputation.  
   - Cons: Can lose a lot of information if many columns have missing entries.[page:65]

   Example:

   ```python
   cols_with_missing = [col for col in X_train.columns
                        if X_train[col].isnull().any()]

   reduced_X_train = X_train.drop(cols_with_missing, axis=1)
   reduced_X_valid = X_valid.drop(cols_with_missing, axis=1)
   ```

   Here `axis=1` means “drop columns” (axis=0 would mean rows).[page:65]

2. **Simple Imputation**

   - Fill missing values with a statistic from the training data: mean, median, or most frequent value.[page:65]  
   - Use `SimpleImputer`:

   ```python
   from sklearn.impute import SimpleImputer

   my_imputer = SimpleImputer(strategy="median")
   imputed_X_train = my_imputer.fit_transform(X_train)
   imputed_X_valid = my_imputer.transform(X_valid)
   ```

   - `fit_transform` on training data computes the median and fills missing values.  
   - `transform` on validation data uses the same medians to avoid leakage.[page:65]

3. **Imputation + Indicator Columns**

   - In addition to imputation, add a binary indicator column for each imputed feature (1 if value was missing, 0 otherwise).[page:65]  
   - This lets the model learn whether “being missing” itself carries information.  

---

## 5. Categorical Variables and Encoding

Many features are **categorical**, e.g. city, color, house type, etc.[page:66]  
Most models expect numerical inputs, so categorical values must be encoded into numbers.[web:72]

### 5.1 Dropping Categorical Variables

- Remove all columns with `object` (string) dtype.  
- Pros: Easiest; no encoding.  
- Cons: Often worst performance because you discard potentially important information.[page:66]

### 5.2 Ordinal Encoding

- Map each category to an integer: e.g. `"Red" → 0`, `"Green" → 1`, `"Blue" → 2`.[page:66]  
- Implemented via `OrdinalEncoder`.  

Pros:

- Simple and compact (one column).  

Cons:

- Introduces an **artificial ordering** between categories; this is only appropriate when the categories are truly ordered (e.g. “Low, Medium, High”).[page:66]

Tree-based models are often fairly tolerant of ordinal encoding even when the variable is nominal, but the artificial ordering can still be misleading in some contexts.

### 5.3 One-Hot Encoding

- Create a new binary (0/1) column for each category.[page:66]  
- Example: Color with values `["Red", "Blue", "Green"]` becomes three columns: `is_Red`, `is_Blue`, `is_Green`.  

Using `OneHotEncoder`:

```python
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

categorical_cols = [...]
numerical_cols = [...]

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

numerical_transformer = SimpleImputer(strategy='constant')

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_cols),
        ('cat', categorical_transformer, categorical_cols)
    ]
)
```

Pros:

- No artificial ordering; great for nominal categories.[page:66]  
- Works very well with many common models.  

Cons:

- High cardinality → many dummy columns (dimensionality blowup).[page:66]

### 5.4 Target Encoding (Conceptual)

- Replace each category with the **mean target** for that category (e.g. average house price per city).[web:77][web:81]  
- Very useful for **high-cardinality** features (zip codes, user IDs, product IDs) where one-hot is too large.[web:79]  
- Needs to be done carefully (within CV folds) to avoid data leakage.[web:77][web:81]

We discussed this conceptually, even though it’s not implemented in your Kaggle notebooks.

---

## 6. Pipelines

Pipelines let you chain preprocessing and modeling into a single object, making the code cleaner and safer.[page:87]

### Why Pipelines?

Without pipelines:

- You manually call `fit_transform` on train, `transform` on validation, then fit the model.  
- Easy to make mistakes (e.g. fitting a transformer on both train and validation → leakage, or mismatched columns).[page:87]

With pipelines:

- All steps are bundled together and applied consistently.  
- Easier cross-validation and deployment.[page:87]

### Example Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(n_estimators=100, random_state=0)

my_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),  # ColumnTransformer from earlier
    ('model', model)
])

my_pipeline.fit(X_train, y_train)
preds = my_pipeline.predict(X_valid)
```

- When you call `fit`, the pipeline:
  - Fits the preprocessors on training data.  
  - Transforms the data.  
  - Fits the model.[page:87]  
- When you call `predict`, it:
  - Applies the same preprocessing to new data.  
  - Uses the model to predict.[page:87]

Pipelines are the standard way to build robust ML workflows in scikit‑learn, especially with more complex preprocessing.

---

## 7. Cross‑Validation

A single train/validation split can be noisy, especially on small datasets.  
**Cross‑validation (CV)** gives a more reliable estimate of model performance.[page:88]

### Basic k‑Fold Cross‑Validation

- Split the data into **k folds** (e.g. k=5).  
- Perform k experiments:
  - In each experiment, use one fold as validation and the remaining k−1 folds for training.  
- Collect k validation scores and average them.[page:88]

This reduces the dependence on which specific rows ended up in the validation set.

### Using `cross_val_score` with Pipelines

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    my_pipeline, X, y,
    cv=5,
    scoring='neg_mean_absolute_error'
)

print(-scores.mean())
```

- `scoring='neg_mean_absolute_error'` is used because scikit‑learn assumes higher scores are better, so it negates MAE.[page:88]  
- Taking `-scores.mean()` gives average MAE across folds.  

CV is especially useful when:

- Data is limited.  
- You want a more stable estimate to compare multiple models.[page:88]

---

## 8. XGBoost (Gradient Boosting)

**XGBoost** is a powerful gradient boosting library, often state‑of‑the‑art for tabular data.[page:89]

### Gradient Boosting Concept

- Build trees **sequentially**, not independently.  
- Each new tree is trained to correct the errors (residuals) of the combined previous trees.[page:89]  
- The final prediction is a weighted sum of all trees.

### XGBoost Regressor Basic Usage

```python
from xgboost import XGBRegressor

my_model = XGBRegressor(random_state=0)
my_model.fit(X_train, y_train)
preds = my_model.predict(X_valid)
```

### Important Hyperparameters

- `n_estimators`  
  - Number of trees (boosting rounds).  
  - Too low → underfitting; too high → risk of overfitting.[page:89]

- `learning_rate`  
  - Step size for each new tree’s contribution.  
  - Smaller learning rate + more trees → often better but slower.[page:89]

- `early_stopping_rounds` + `eval_set`  
  - Let the model stop early when validation performance stops improving.[page:89]

  ```python
  my_model = XGBRegressor(
      n_estimators=1000,
      learning_rate=0.05,
      random_state=0
  )

  my_model.fit(
      X_train, y_train,
      early_stopping_rounds=5,
      eval_set=[(X_valid, y_valid)],
      verbose=False
  )
  ```

- `n_jobs`  
  - Number of parallel threads to use (e.g. `n_jobs=4`).[page:89]

XGBoost is usually stronger than a plain random forest on well-processed tabular data, especially when tuned.

---

## 9. Data Leakage

**Data leakage** is when information from outside the training dataset (especially from the validation/test or from the future) is used to create the model, leading to unrealistically good evaluation but poor real-world performance.[page:90]

### 9.1 Target Leakage

Occurs when a feature is influenced by the target or is only available **after** the outcome.[page:90]

Example (medical):

- Target: “Does the patient have pneumonia?”  
- Feature: “Did the patient take antibiotic X?”  
- Antibiotic use is decided *after* diagnosis, so using it as a feature leaks future information.[page:90]

Consequences:

- Validation scores look excellent.  
- In deployment, this feature isn’t available at prediction time → model fails.

**Prevention**:

- Only include features that would realistically be available at prediction time.  
- For each feature, ask: “Would I know this before the target happens?”[page:90]

### 9.2 Train–Test Contamination

Occurs when information from the validation/test set influences preprocessing or model training.[page:90]

Examples:

- Fitting an imputer or scaler on the **entire** dataset (train + validation), then splitting.  
- Doing feature selection (e.g., using correlations with the target) on the full dataset and then evaluating on a supposed “validation” set.[page:90]

**Correct procedure**:

1. Split into train and validation first.  
2. Fit preprocessing steps only on **training** data.  
3. Apply the fitted transforms to both training and validation data.  
4. Then train and evaluate the model.[page:90]  

Using scikit‑learn pipelines and cross‑validation helps avoid this, because the library handles per‑fold fitting and transforming correctly.[page:87][page:88][page:90]

### Example: Credit Card Data Leakage

In the Kaggle `data-leakage` notebook:

- A feature like `expenditure` was essentially “spend on the card,” which is only known after card approval → target leakage.[page:90]  
- Dropping `expenditure` and related features reduced accuracy from ~0.98 (too good) to ~0.83 (realistic), showing the original model was leaking.[page:90]

---

## 10. Big Picture: What You Now Know

From these Kaggle lessons you now have a strong foundation for **tabular ML**:

- How models (especially trees) work at a high level.  
- How to set up train/validation splits and evaluate with MAE.  
- How to recognize and handle underfitting vs overfitting.  
- How to deal with missing values.  
- How to encode categorical features (drop, ordinal, one‑hot; conceptually target encoding).  
- How and why to build scikit‑learn pipelines.  
- How to use cross‑validation for more robust evaluation.  
- How to use XGBoost as a strong tabular model.  
- How to detect and avoid data leakage.[web:91][web:93][page:87][page:88][page:89][page:90]

These are exactly the tools you need to be productive on many real-world tabular ML problems.
```