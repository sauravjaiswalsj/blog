## 1. What is machine learning?

- Machine learning: algorithms that learn from **data (experience)** to improve **task performance** (knowledge) without being explicitly programmed with rules.
- Example: digit recognition – task is to classify handwritten images, performance is % correct, experience is a labeled dataset (MNIST).

### Traditional vs ML way

- Traditional approach: programmer writes explicit rules for decisions (“if pixels like this, then digit 3”), which is hard for complex tasks.
- ML approach: define a model, feed data + labels, use a learning algorithm to fit the model to data.



## 2. Main ML task types

### Supervised learning

- Given input $(X)$ and output labels $(Y)$, learn a mapping $(f: \mathcal{X} \to \mathcal{Y})$.
- **Classification**: output is discrete (classes). Example:  
  - Inputs: images of digits; outputs: labels 0–9.
- **Regression**: output is continuous (numbers). Example:  
  - Inputs: number of Google searches; output: flu prevalence.

### Unsupervised learning

- Given inputs $(X)$ only, learn structure/functions without labels.
- **Clustering**: group similar items; model $(f: X \to \{1, \dots, K\})$ where $(K)$ is also unknown.
- **Dimensionality reduction**: map high‑dimensional data (e.g. images) to low‑dimensional coordinates $(F(\text{image}) = (x, y))$ that capture main variability (e.g. pose, expression).

### Reinforcement learning

- Agent interacts with an environment, takes actions, receives **rewards/penalties**, and learns a policy that maximises cumulative reward.



## 3. Experience: train, validation, test

- Training data: used to fit the model parameters.
- Validation data: used to tune hyperparameters (e.g. $(k)$ in k‑NN, learning rate) without biasing evaluation.
- Test data: unseen during training/tuning; used once to evaluate final generalisation.

### Overfitting and generalisation

- Overfitting: model memorises training data (e.g. 100% train accuracy) but performs poorly on test data.
- Goal: high performance on **unseen** data, so test set must remain untouched during training.



## 4. Loss functions (core exam topic)

### General idea

- A **loss function** (cost function) measures how bad a prediction is compared to the true label.
- Large error → large loss; small error → small loss. Learning = **minimise** the loss over the dataset (optimisation).



## 5. Kaggle & tools (short answer fodder)

- Kaggle: Google‑owned platform offering ML competitions, datasets, shared code, and courses (e.g. Titanic survival prediction).
- Typical competition flow: join, download data, build model, submit predictions, check leaderboard, iterate using community insights.
- Key tools:  
  - Scikit‑learn (classical ML), PyTorch/TensorFlow/Keras (deep learning), Google Colab & Jupyter for notebooks.



# Deep, beginner‑friendly explanation of loss, MSE, MAE, cross‑entropy, outliers

## Why do we need a loss function?

Think of learning as “how wrong is my model?” quantified by a number.

- For each example, model outputs a prediction $(\hat{y})$; there is a true value $(y)$.
- Loss tells you “distance” between $(y)$ and $(\hat{y})$. If you **sum/average** loss across all training examples, you get how bad your model is overall.
- Optimisation algorithms (e.g. gradient descent) try to change model parameters to **reduce** this average loss – like descending a hill until you reach the bottom.

Without a loss function, the model has no numerical signal telling it which direction is “better” when adjusting parameters.



## What are outliers?

Intuitively: points that “don’t fit” the general pattern of the data.

- Example: most exam scores are between 30 and 90, but one score is 2 and another is 100; those extreme points are outliers.  
- Example in regression: predicting house prices from size; almost all points follow a rough line, but one house of 50 m² sold for £5M due to a billionaire – that point is an outlier.  

Why they matter:

- Some loss functions (especially MSE) punish large errors very heavily, so **one** outlier can dominate the loss and pull the fitted line/curve toward it.
- This can make the model worse for the majority of “normal” points, so you must detect and treat outliers carefully (cleaning, robust losses, or domain‑based exclusion).  



## Mean Squared Error (MSE)

### Definition and maths

For $(n)$ examples:

- True values: $(y_1, y_2, \dots, y_n)$  
- Predictions: $(\hat{y}_1, \hat{y}_2, \dots, \hat{y}_n)$  

The **MSE** is:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^n (y_i - \hat{y}_i)^2
$$



- $(y_i - \hat{y}_i)$: prediction error for example $(i)$.
- $((y_i - \hat{y}_i)^2)$: squared error (always non‑negative).
- Average over all examples: mean squared error.

Sometimes **RMSE** is used:

$$
\text{RMSE} = \sqrt{\text{MSE}}
$$



This is in the same units as the target (e.g. pounds, degrees).

### Intuition

- Squaring errors makes **big mistakes** much more expensive than small ones.
- Example: if the true value is 10:  
  - Predict 12 → error = 2 → squared error = 4.  
  - Predict 20 → error = 10 → squared error = 100.  
- One large mistake of size 10 counts as 25 times worse than 5 mistakes of size 2 (because \(10^2 = 100\) vs \(5 \times 2^2 = 20\)).  

### Simple numerical example

Suppose true values: $(y = [10, 8, 9])$, predictions $(\hat{y} = [9, 11, 9])$.

- Errors: $([-1, 3, 0])$  
- Squared errors: $([1, 9, 0])$  
- MSE $(= (1 + 9 + 0)/3 = 10/3 \approx 3.33)$).  

If you improve the second prediction from 11 → 9 (error 3 → 1):

- New squared errors: $([1, 1, 0])$, MSE $(= 2/3 \approx 0.67)$).  
- Loss drops a lot, telling the optimiser this direction is good.  

### Sensitivity to outliers

- If one data point has error 50, its squared error is $(50)^2 = 2500$, which can dominate the sum.
- Thus, MSE is **not robust** to outliers; it tries hard to fit them.  



## Mean Absolute Error (MAE)

### Definition and maths

For the same setup:

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^n |y_i - \hat{y}_i|
$$



- Uses **absolute value** instead of square.
- Units of MAE are the same as the target variable (e.g. euros, degrees).

### Intuition

- Penalises errors **linearly**: an error of 10 is exactly twice as bad as an error of 5.
- Less sensitive to outliers than MSE because there is no squaring.

### Simple numerical example

Same true/predictions as before: $(y = [10, 8, 9])$, $(\hat{y} = [9, 11, 9])$.

- Absolute errors: $(|y_i - \hat{y}_i| = [1, 3, 0])$.  
- MAE $(= (1 + 3 + 0)/3 = 4/3 \approx 1.33)$.  

If one prediction is very bad, say $(\hat{y}_2 = 30)$ (error $(= 22)$):

- New absolute errors: $(|y_i - \hat{y}_i| = [1, 22, 0])$.  
- MAE $(= 23/3 \approx 7.67)$.  
- Compare with MSE: errors $([-1, 22, 0])$, squared = $([1, 484, 0])$, MSE $(= 485/3 \approx 161.67)$
- MSE explodes far more than MAE; this shows MAE is more robust to large outliers.  

---

## Binary Cross‑Entropy (Log Loss)

Used mainly for **binary classification** with probabilistic outputs.

### Setting

- Each example has true label $(y_i \in \{0,1\})$.
- Model predicts a **probability** $(\hat{y}_i \in (0,1))$ that the label is 1.

The **binary cross‑entropy loss** for one example is:

$$
L_i = -\big( y_i \log(\hat{y}_i) + (1 - y_i) \log(1 - \hat{y}_i) \big)
$$



Overall loss is the average of $(L_i)$ across all examples.

### Intuition with cases

- If $(y_i = 1)$: loss becomes $(L_i = -\log(\hat{y}_i))$.  
  - If model says $(\hat{y}_i = 0.9)$: loss $(= -\log(0.9))$ (small).  
  - If model says $(\hat{y}_i = 0.01)$: loss $(= -\log(0.01))$ (huge).  
- If $(y_i = 0)$: loss becomes $(L_i = -\log(1 - \hat{y}_i))$.  
  - If model says $(\hat{y}_i = 0.1)$: loss $(= -\log(0.9))$ (small).  
  - If model says $(\hat{y}_i = 0.99)$: loss $(= -\log(0.01))$ (huge).

So:

- The closer the predicted probability is to the **true label** (1 for positives, 0 for negatives), the **smaller** the loss.
- Being **confident and wrong** (e.g. predicting 0.99 when the truth is 0) is heavily punished; this encourages calibrated probabilities.

### Why not use MSE for classification?

- MSE treats this as a regression to 0/1, but it does not naturally correspond to probabilities and has weaker gradients when predictions saturate at 0 or 1.  
- Cross‑entropy aligns with maximum likelihood for Bernoulli outcomes and gives better learning dynamics for probabilistic classifiers.  



## How everything fits together in training

- You choose a model (e.g. linear regression, logistic regression, neural network).  
- You choose a loss function suited to the task:  
  - Regression → often MSE or MAE.
  - Binary classification → binary cross‑entropy.
- You run an optimisation algorithm that changes parameters to **minimise** the chosen loss on training data, evaluating on validation and test sets to check generalisation and avoid overfitting.

If you want, the next step can be concrete worked examples:  
- Small synthetic regression with MSE vs MAE.  
- Toy binary classification with cross‑entropy values computed step by step.

[1-Slide](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs910/2025_l2.pdf)
[2-Youtube](https://www.youtube.com/watch?v=E0bwEAWmVEM)
[3-Kaggle](https://www.kaggle.com/code/kanncaa1/machine-learning-tutorial-for-beginners)
[4-Datacamp](https://www.datacamp.com/tutorial/machine-learning-python)