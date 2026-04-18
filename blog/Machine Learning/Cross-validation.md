---
title: Cross-Validation
description: A comprehensive guide on cross-validation.
authors: [saurav]
tags: [machine-learning, data-science, preprocessing]
---

# Cross‑Validation

## 1. Why do we need cross‑validation?

When we train a model, we want to know **how well it will perform on new, unseen data**, not just on the data it was trained on.

- A single **train/validation split** (e.g. 80% train, 20% validation) can give a noisy estimate.
- The result can depend a lot on **which** 20% of data ended up in the validation set.
- Cross‑validation reduces this randomness by using **multiple train/test splits** and averaging their performance.

---

## 2. Basic idea of k‑fold cross‑validation

Given a dataset \(D\) and a chosen number of folds \(k\) (e.g., 5 or 10):

1. **Split the dataset into k roughly equal parts** (called folds).  
   Example: 5‑fold CV → folds F1, F2, F3, F4, F5.

2. **Perform k rounds** of training and testing:

   - Round 1:  
     - Train on F2+F3+F4+F5  
     - Test on F1  
   - Round 2:  
     - Train on F1+F3+F4+F5  
     - Test on F2  
   - Round 3:  
     - Train on F1+F2+F4+F5  
     - Test on F3  
   - Round 4:  
     - Train on F1+F2+F3+F5  
     - Test on F4  
   - Round 5:  
     - Train on F1+F2+F3+F4  
     - Test on F5  

3. In **each round**, you compute a performance metric on that round’s test fold (e.g. accuracy, MAE, RMSE, AUC).

4. At the end, you **average the k scores**.  
   This average is your **cross‑validated performance estimate** for that model on that dataset.

Key properties:

- Every data point appears in a **test set once**, and in a **training set k−1 times**.
- The performance estimate is more stable and less dependent on a single unlucky split.

---

## 3. Cross‑validation for one model vs many models

### 3.1 For a single model

For a given model type (e.g. logistic regression with certain hyperparameters):

- You run the full k‑fold cross‑validation procedure described above.
- You get k test scores and then their mean (and optionally standard deviation).
- That mean is your **CV score** for this model configuration.

### 3.2 Comparing multiple models

To compare multiple models (e.g., Logistic Regression, KNN, SVM):

1. Fix your dataset and your CV scheme (e.g., 5 folds).
2. For each model type:
   - Run k‑fold cross‑validation.
   - Obtain the average test performance.
3. Compare the averages:
   - The model with the **best average CV score** is typically chosen (subject to other constraints like speed, interpretability, etc.).

Important:

- **You do NOT assign one fold per model.**  
  You do **k‑fold CV separately for each model**, using the same folds so the comparison is fair.

---

## 4. Pseudo‑code intuition

Think of your process as:

```pseudo
models = [LogisticRegression, KNN, SVM]
performance = {}

for model_type in models:
    performance[model_type] = cross_validate(model_type, X, y)

best_model_type = argmax(performance)  // or argmin, depending on metric
```

Where `cross_validate` might look like:

```pseudo
function cross_validate(model_type, X, y, k=5):
    folds = make_k_folds(X, y, k)
    scores = []

    for (train_idx, test_idx) in folds:
        X_train, y_train = X[train_idx], y[train_idx]
        X_test,  y_test  = X[test_idx],  y[test_idx]

        model = new instance of model_type
        model.fit(X_train, y_train)

        preds  = model.predict(X_test)
        score  = metric(y_test, preds)  // e.g. accuracy, MAE, etc.
        scores.append(score)

    return mean(scores)
```

This matches what libraries like scikit‑learn do internally with `cross_val_score` (they handle the folds, fit, predict, and averaging for you).

---

## 5. How this relates to training, validation, and test

- **Training loss** is minimized during training using only the training folds.
- **Validation/test loss** during cross‑validation is used to **evaluate** the model’s ability to generalize, not to directly update the model parameters.[web:136][web:137]
- After choosing the best model/hyperparameters via cross‑validation:
  - Often you retrain that chosen model on **all** available training data.
  - Optionally, you evaluate once on a separate **final test set** that was never used in cross‑validation (for a truly unbiased estimate).  

So:

- Optimization (gradient descent) focuses on **training folds**.
- Model selection/early stopping uses **validation folds** (or CV scores).
- Final reporting uses a **held‑out test set**, if available.

---

## 6. When to use cross‑validation vs a simple split

**Prefer cross‑validation when:**

- Dataset is **small or medium**, and you want a more robust performance estimate.
- You are comparing multiple models or hyperparameter settings and need a fair comparison.
- You care about generalization quality and cannot afford noisy estimates.

**A single train/validation split is often enough when:**

- Dataset is **large** (hundreds of thousands / millions of examples).
- Training is expensive and k‑fold CV would be too slow.
- You just need a quick, approximate estimate of performance.

---

## 7. Key sentences to remember

- Cross‑validation = “**multiple train/test splits** + **average performance**”.
- Each model/hyperparameter setting gets its **own full cross‑validation run**.
- We minimize loss on **training data**; we use cross‑validation losses/metrics to **choose** between models.
