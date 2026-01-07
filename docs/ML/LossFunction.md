Think of a loss function as a **score of how bad your predictions are**. It lets a model know “how wrong was I?” so it can improve during training.  



## 1. Why we need a loss function

When a model predicts something, we need a number that tells us how good or bad that prediction was. This number is the **loss**.  

- If predictions are perfect → loss is 0 (or very small).
- If predictions are bad → loss is large.
- During training, the algorithm changes its parameters to **minimize** this loss (gradient descent etc.).

So: **loss function = rule for turning prediction errors into a single number the model can optimize.**  



## 2. What is an outlier?

An **outlier** is a data point that is *far away* from most of the others.

- Example: Test scores: 55, 60, 58, 62, 59, **10**.  
  - Most scores are around 60.  
  - The score 10 is extremely low compared to the rest → that’s an outlier.  
- Outliers can be:
  - Real rare cases (e.g., one customer spends 1,000,000 when most spend 100).
  - Or errors (someone typed an extra 0).

Outliers matter because some loss functions react very strongly to them, which can distort training.  



## 3. Mean Squared Error (MSE)

### 3.1 What it is (concept)

MSE measures the **average squared difference** between actual values and predicted values.

- For each data point:
  - Error = actual − predicted  
  - Square the error → error²  
- Average all squared errors → MSE.  

If predictions are close to reality, errors are small → MSE small. If predictions are far off, errors big → MSE large.

### 3.2 Formula and symbols

For \(n\) data points:  

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$


- $(y_i)$: true/actual value for point $(i)$
- $(\hat{y}_i)$: predicted value for point $(i)$
- $(y_i - \hat{y}_i)$: error for point $(i)$  
- Squared and averaged.  

### 3.3 Simple numeric example

Suppose you predict a person’s weight 3 times (in kg):  

- Actual: 60, 65, 70  
- Predicted: 58, 70, 69  

Errors:  
- Person 1: $(60 - 58 = 2)$  
- Person 2: $(65 - 70 = -5)$  
- Person 3: $(70 - 69 = 1)$  

Square them:  
- $(2^2 = 4)$  
- $((-5)^2 = 25)$  
- $(1^2 = 1)$  

Average:  
$$
\text{MSE} = (4 + 25 + 1)/3 = 30/3 = 10
$$

So MSE = 10.  

### 3.4 Why squares? (and outliers)

Squaring means **big errors get punished much more** than small errors.

- In the example above, the error 5 contributes 25 to the sum, much more than errors 2 and 1 (4 and 1).  
- If you have one outlier prediction that is very wrong, MSE can become huge.  

**Outlier effect example** (movie ratings 1–5):  

- Suppose actual ratings: 4, 4, 4, 4, 4  
- Model A predicts: 3.5, 3.5, 3.5, 3.5, **3.5**  
  - Errors: 0.5 five times.  
  - MSE contribution: $(5 × 0.5^2 = 5 × 0.25 = 1.25)$  
- Model B predicts: 4, 4, 4, 4, **0**  
  - Errors: 0, 0, 0, 0, 4.  
  - MSE contribution: $(0^2 + 0^2 + 0^2 + 0^2 + 4^2 = 16)$

Both have “some mistakes”, but because Model B has *one huge error*, its MSE is much worse.  

- This is why we say **MSE has high outlier sensitivity**.
- Use when large mistakes are **very bad** and must be heavily punished (e.g., predicting medicine dosage, crash risk).  



## 4. Mean Absolute Error (MAE)

### 4.1 What it is (concept)

MAE measures the **average size** of the errors, ignoring direction.

- For each point:
  - Error = actual − predicted  
  - Take absolute value: $(|\text{error}|)$ (drop the sign)  
- Average these absolute errors → MAE.  

It tells you: “On average, how far off are my predictions?” in the same units as the data.

### 4.2 Formula and symbols

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|
$$

- Same $(y_i)$, $(\hat{y}_i)$, but no square.

### 4.3 Simple numeric example

Take the same weight example:  

Actual: 60, 65, 70  
Predicted: 58, 70, 69  

Errors: 2, −5, 1  

Absolute errors: $(|2| = 2)$, $(|-5| = 5)$, $(|1| = 1)$  

$$
\text{MAE} = (2 + 5 + 1)/3 = 8/3 ≈ 2.67
$$

Interpretation: on average, you are off by about 2.67 kg.  

### 4.4 Relation to outliers

MAE **adds errors linearly**; no squaring.

Using the movie rating example:  

- Model A: errors: 0.5, 0.5, 0.5, 0.5, 0.5  
  - MAE = $(0.5 × 5)/5 = 0.5$  
- Model B: errors: 0, 0, 0, 0, 4  
  - MAE = $(0 + 0 + 0 + 0 + 4)/5 = 0.8$  

MAE increased from 0.5 to 0.8; not as dramatic as MSE jump (1.25 → 16).  
So **MAE is less sensitive to outliers** and treats each error more uniformly.

Use MAE when:
- You care about “typical error size”.  
- You don’t want one extreme point to dominate everything (robustness to outliers).  



## 5. MSE vs MAE – intuitive comparison

```
| Aspect | MSE | MAE |
|--------|-----|-----|
| Formula | Average of squared errors \\((y - \\hat{y})^2\\) | Average of absolute errors \\(|y - \\hat{y}|\\) |
| Punishment | Big errors explode (square) | Big errors increase linearly |
| Outlier effect | Very high (one outlier can dominate) | Lower (outlier still matters but not insanely) |
| Units | Squared units (e.g., kg²) | Same as data (e.g., kg) |
```
| Use when | Large mistakes are especially dangerous | Want robustness and easy interpretation |



## 6. Bringing it all together in ML

In supervised learning (regression):

1. Model makes predictions $(\hat{y}_i)$ for each training example.  
2. Loss function (MSE or MAE) computes **how bad** those predictions are.  
3. Optimization algorithm adjusts parameters to **minimize** that loss.  
4. Loss ↓ → predictions generally get better.  

So:

- **Loss function** = training signal. Without it, the model has no idea whether to change or how.  
- **MSE** = “I really hate big mistakes; punish them hard.”  
- **MAE** = “Treat all mistakes fairly; don’t freak out over one weird data point.”  

If you want, next step can be to write a tiny Python snippet together and compute MSE and MAE for a toy example, so you see the numbers changing.

Binary cross-entropy (BCE) is the **loss function** most commonly used when the task is: “Is this 0 or 1?” (spam vs not, cat vs not, click vs no click).



## 1. Setup: what kind of problem?

Binary classification:  
- Each example has a **true label** $(y)$: either 0 or 1.  
- The model outputs a **probability** $(\hat{y})$ between 0 and 1 (e.g. 0.93 = 93% chance it is class 1).
- Later, you might threshold at 0.5 to turn that into a hard Yes/No, but BCE works directly with the probability.

Examples of such problems:  
- Email spam: spam = 1, not spam = 0.  
- Fraud transaction: fraud = 1, normal = 0.  
- Tumor malignant: malignant = 1, benign = 0.  

---

## 2. The formula (per example)

For one data point:  

$$
\text{BCE}(y, \hat{y}) = -\big( y \log(\hat{y}) + (1 - y)\log(1 - \hat{y}) \big)
$$

- $(y)$ is 0 or 1 (true label).
- $(\hat{y})$ is the predicted probability that the label is 1 (between 0 and 1).

For many data points, you just average over all of them.



## 3. Intuition: two cases

Because $(y)$ is either 0 or 1, only **one** of the two log terms is active each time.

### Case A: true label \(y = 1\)

Then the loss becomes:  

$$
-\log(\hat{y})
$$

- If $(\hat{y} = 0.99)$:  
  - Loss = $(-\log(0.99))$ ≈ 0.01 → **tiny loss** (model is confident and correct).  
- If $(\hat{y} = 0.5)$:  
  - Loss ≈ $(-\log(0.5))$ ≈ 0.69 → medium loss.  
- If $(\hat{y} = 0.01)$:  
  - Loss ≈ $(-\log(0.01))$ ≈ 4.6 → **huge loss** (very confident but wrong).  

So: **for positive examples, BCE punishes giving low probability to 1**.

### Case B: true label \(y = 0\)

Then the loss becomes:  

$$
-\log(1 - \hat{y})
$$

- If $(\hat{y} = 0.01)$ (you predict 1% chance of being class 1):  
  - Loss ≈ $(-\log(0.99))$ ≈ 0.01 → tiny.  
- If $(\hat{y} = 0.5)$:  
  - Loss ≈ $(-\log(0.5))$ ≈ 0.69 again.  
- If $(\hat{y} = 0.99)$:  
  - Loss ≈ $(-\log(0.01))$ ≈ 4.6 → huge.  

So: **for negative examples, BCE punishes giving high probability to 1**.

This matches what we want: be **confident and correct**, not confident and wrong.  



## 4. Why log? What is it doing?

The log has two useful properties here:

- $(\log(1) = 0)$ → if you predict probability 1 for the correct class, loss = 0 (perfect).  
- $(\log(\text{number close to 0}))$ is a large negative number → after the minus sign, **loss becomes very large** when you assign tiny probability to the correct class.  

So log-loss / BCE:  
- Grows slowly when you’re already reasonably correct (0.8 → 0.9 → 0.95).  
- Explodes when you’re confidently wrong (0.99 on the wrong class).  

This encourages models to output **well-calibrated probabilities** instead of just “0 or 1”.



## 5. Concrete numeric example (4 emails)

Imagine spam detection.  
- 1 = spam, 0 = not spam.  

You have 4 emails:  

```
| Email | True label $(y)$ | Model’s probability $(\hat{y})$ (spam) |
|------|------------------|-----------------------------------------|
| A | 1 | 0.9 |
| B | 1 | 0.6 |
| C | 0 | 0.2 |
| D | 0 | 0.9 |
```

Now compute loss per email.  

1) Email A: spam, $(y=1)$, $(\hat{y}=0.9)$  

$$
\text{loss}_A = -\log(0.9) \approx 0.105
$$

Small (good).  

2) Email B: spam, $(y=1)$, $(\hat{y}=0.6)$  

$$
\text{loss}_B = -\log(0.6) \approx 0.511
$$

Medium (you only gave 60% spam probability).  

3) Email C: not spam, $(y=0)$, $(\hat{y}=0.2)$  

$$
\text{loss}_C = -\log(1 - 0.2) = -\log(0.8) \approx 0.223
$$

Small-ish (you said 20% spam, so mostly correct).  

4) Email D: not spam, $(y=0)$, $(\hat{y}=0.9)$  

$$
\text{loss}_D = -\log(1 - 0.9) = -\log(0.1) \approx 2.303
$$

Huge (you were 90% confident it *was* spam, but it’s actually not).  

Average BCE over all 4:  

$$
\text{BCE} \approx (0.105 + 0.511 + 0.223 + 2.303)/4 \approx 0.785
$$

The big mistake on Email D dominates the loss, which is exactly what BCE is designed to do.



## 6. How is this different from MSE/MAE?

MSE/MAE look at **numeric distance** between true and predicted values (e.g., house price).

BCE is different:  
- Works with **probabilities** and **labels 0/1**.  
- Cares not only about right/wrong, but **how confident** the model was.
- Strongly punishes being confidently wrong on classification tasks.

That’s why BCE (also called **log-loss**) is the standard for training logistic regression, neural nets, etc. in binary classification.



## 7. Summary in newbie-friendly terms

- You tell the model: “Give me how likely this is class 1 (0–1).”  
- BCE checks: “For the true class, did you give a high probability? If yes, small loss. If no, **big** loss.”  
- Training tries to **reduce** this loss over all examples, so over time probabilities become sharper and more accurate.

If you want, next step can be to compare BCE and MSE numerically on the *same* binary data so you see why BCE is preferred for classification.

[1-Slide](https://www.geeksforgeeks.org/deep-learning/binary-cross-entropy-log-loss-for-binary-classification/)
[2-Deechecks](https://www.deepchecks.com/glossary/binary-cross-entropy/)
[3-Codeskiller](https://codeskiller.codingblocks.com/library/articles/what-is-binary-cross-entropy-loss)
[4-Towardsdatascience](https://towardsdatascience.com/intuition-behind-log-loss-score-4e0c9979680a/)
[5-Databasecamp](https://databasecamp.de/en/ml/binary-cross-entropy-en)
[6-Slide](https://www.niser.ac.in/~smishra/teach/cs460/23cs460/lectures/lec23.pdf)
[7-Activeloop](https://www.activeloop.ai/resources/glossary/log-loss/)
[8-Linkedin](https://www.linkedin.com/pulse/understanding-log-loss-classification-evaluation-michael-stroud-zu4pc)
[9-Datascience](https://datascience.oneoffcoder.com/log-loss.html)
[10-Wiki](https://en.wikipedia.org/wiki/Mean_squared_error)
[11-Giskard](https://www.giskard.ai/glossary/mean-absolute-error)
[12-Tensorflow](https://www.tensorflow.org/api_docs/python/tf/keras/losses/BinaryCrossentropy)
[13-Datacamp](https://www.datacamp.com/tutorial/the-cross-entropy-loss-function-in-machine-learning)
[14-Slide](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs910/2025_l2.pdf)
[15-Youtube](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/12932362/e5082b3a-f96f-42f4-bc83-0bb0b5f60bde/image.jpg)
[16-Youtube](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/12932362/d69bbdc9-4fb4-4be3-bda0-9a5b3e33b4b2/image.jpg)
[17-Arize](https://arize.com/blog-course/binary-cross-entropy-log-loss/)
[18-Youtube](https://www.youtube.com/watch?v=DPSXVJF5jIs)
[19-Youtube](https://www.youtube.com/watch?v=ZiqqRjRMLbk)
[20-Towardsai](https://towardsai.net/p/l/how-did-binary-cross-entropy-loss-come-into-existence)
[21-Youtube](https://www.youtube.com/watch?v=nrNCinHw0os)
[22-Coralogix](https://coralogix.com/ai-blog/understanding-binary-cross-entropy-and-log-loss-for-effective-model-monitoring/)
[23-BiCE](https://sassafras13.github.io/BiCE/)
[24-Wandb](https://wandb.ai/mostafaibrahim17/ml-articles/reports/Understanding-the-Difference-in-Performance-Between-Binary-Cross-Entropy-and-Categorical-Cross-Entropy--Vmlldzo0Nzk4NDI2)
[25-Sklearn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html)

[1-Wiki](https://en.wikipedia.org/wiki/Mean_squared_error)
[2-Jim](https://statisticsbyjim.com/regression/mean-squared-error-mse/)
[3-Byjus](https://byjus.com/maths/mean-squared-error/)
[4-Wiki](https://en.wikipedia.org/wiki/Outlier)
[5-Geeksforgeeks](https://www.geeksforgeeks.org/maths/outlier/)
[6-Geeksforgeeks](https://www.geeksforgeeks.org/maths/mean-squared-error/)
[7-Giskard](https://www.giskard.ai/glossary/mean-absolute-error)
[8-Jim](https://statisticsbyjim.com/glossary/mean-absolute-error/)
[9-Statisticshowto](https://www.statisticshowto.com/absolute-error/)
[10-Slide](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs910/2025_l2.pdf)
[11-Youtube](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/12932362/e5082b3a-f96f-42f4-bc83-0bb0b5f60bde/image.jpg)
[12-Youtube](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/12932362/d69bbdc9-4fb4-4be3-bda0-9a5b3e33b4b2/image.jpg)
[13-Wiki](https://www.britannica.com/science/mean-squared-error)
[14-Statlect](https://www.statlect.com/glossary/mean-squared-error)
[15-Deepchecks](https://www.deepchecks.com/glossary/mean-square-error-mse/)
[16-Freecodecamp](https://www.freecodecamp.org/news/what-is-an-outlier-definition-and-how-to-find-outliers-in-statistics/)
[17-Wiki](https://en.wikipedia.org/wiki/Mean_square_error)
[18-Doubtnut](https://www.doubtnut.com/qna/277388897)
[19-Study](https://study.com/learn/lesson/outlier-statistics-examples.html)
[20-Youtube](https://www.youtube.com/watch?v=beIgcdf0YDE)
[21-Deepchecks](https://www.deepchecks.com/glossary/mean-absolute-error/)
[22-Nist](https://www.itl.nist.gov/div898/handbook/prc/section1/prc16.htm)
[23-Sciencedirect](https://www.sciencedirect.com/topics/engineering/mean-square-error)