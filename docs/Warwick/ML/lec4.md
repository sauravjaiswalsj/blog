A linear discriminant model represents a binary classification problem with a linear score function, then learns parameters by minimizing a suitable loss (often a convex surrogate of 0–1 loss) using optimization such as gradient descent. A perceptron is a particular linear classifier trained with a simple update rule, and a convex function is one whose epigraph is a convex set, which guarantees no bad local minima for optimization. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/)

## General model structure

For binary classification:

- **Representation**  
  - Input feature vector \(x \in \mathbb{R}^d\).  
  - Class label \(y \in \{-1, +1\}\).  
  - Linear score (discriminant) function:  
    \[
      f(x) = w^{\top}x + b
    \]  
    where \(w \in \mathbb{R}^d\) and \(b \in \mathbb{R}\). [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/)
  - Prediction rule:  
    \[
      \hat y = \text{sign}(f(x))
    \]. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/)

- **Evaluation**  
  - Accuracy on a dataset \(\{(x_i, y_i)\}_{i=1}^n\):  
    \[
      \text{Accuracy} = \frac{1}{n}\sum_{i=1}^n \mathbf{1}\{ \text{sign}(f(x_i)) = y_i \}.
    \] [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/)

- **Optimization**  
  - Directly minimizing misclassification (0–1 loss) is difficult, so convex surrogate losses such as logistic or hinge loss are used instead. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/)

## Zero–one loss and why it is “bad” to optimize

- **Zero–one loss**  
  \[
    L_{0/1}(y, f(x)) = \mathbf{1}\{y \neq \text{sign}(f(x))\}.
  \]  
  Empirical risk:
  \[
    E(w,b) = \frac{1}{n}\sum_{i=1}^n L_{0/1}(y_i, f(x_i)).
  \]

- **Issues for optimization**  
  - Not **differentiable**: the indicator jumps discontinuously when the sign of \(f(x)\) changes, so gradients are undefined almost everywhere.  
  - Not **convex** in \((w,b)\): many local minima and flat regions, so gradient-based methods have no useful global guarantees.  
  - Not **smooth**: small parameter changes do not give informative gradient signals.

Because of these properties, standard gradient descent cannot be applied in a principled way to minimize zero–one loss.

## Convex surrogate loss functions

Convex surrogates upper-bound or approximate the 0–1 loss with a function that is convex and differentiable (or subdifferentiable) in \(w\). [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/)

### Logistic loss

- **Definition**  
  \[
    L_{\text{log}}(y, f(x)) = \log\big(1 + \exp(-y f(x))\big).
  \]

- **Properties**  
  - Convex in \(f(x)\), hence convex in \(w\) for linear \(f\).  
  - Differentiable and smooth, so standard gradient-based optimization works well.  
  - For large positive margins \(y f(x) \gg 0\), loss tends to \(0\); for negative margins, loss grows approximately linearly.

### Hinge loss

- **Definition**  
  \[
    L_{\text{hinge}}(y, f(x)) = \max(0, 1 - y f(x)).
  \]  

- **Interpretation**  
  - Zero when \(y f(x) \ge 1\), i.e. correct with margin at least 1.  
  - Increases linearly when \(y f(x) < 1\), penalizing both misclassified and “low-margin” correct points.  
  - A convex upper bound of zero–one loss.

- **Properties**  
  - Convex but not differentiable at \(y f(x) = 1\); however, it has subgradients, so subgradient or stochastic gradient methods can be used.  
  - Forms the basis of the hard-margin and soft-margin SVM objectives.

### Convex empirical risk

Given a convex loss \(L(y, f(x))\) (e.g. logistic or hinge), empirical risk is
\[
  E(w,b) = \frac{1}{n}\sum_{i=1}^n L(y_i, w^{\top}x_i + b).
\]
This function is convex in \((w,b)\) for linear models, so any local minimum is a global minimum.

## Optimization with gradient (subgradient) descent

- **Objective**  
  Often regularized:
  \[
    \min_{w,b} \; \frac{1}{n}\sum_{i=1}^n L(y_i, w^{\top}x_i + b) + \lambda \|w\|^2,
  \]
  where \(\lambda \ge 0\) controls regularization.

- **Gradient examples**

  - Logistic loss:
    \[
      \frac{\partial L_{\text{log}}}{\partial f} = -\frac{y}{1 + \exp(y f(x))}.
    \]  
    So  
    \[
      \nabla_w E = \frac{1}{n}\sum_{i=1}^n \left(-\frac{y_i}{1 + \exp(y_i f(x_i))}\right) x_i + 2\lambda w,
    \]
    \[
      \frac{\partial E}{\partial b} = \frac{1}{n}\sum_{i=1}^n \left(-\frac{y_i}{1 + \exp(y_i f(x_i))}\right).
    \]

  - Hinge loss: subgradient with respect to \(f(x)\) is  
    \[
      \partial L_{\text{hinge}}(y, f(x)) =
      \begin{cases}
        -y & \text{if } y f(x) < 1,\\
        0 & \text{if } y f(x) > 1,\\
        \text{any value in }[-y,0] & \text{if } y f(x) = 1.
      \end{cases}
    \]  
    A common choice is:
    \[
      g_i =
      \begin{cases}
        -y_i x_i & \text{if } y_i f(x_i) < 1,\\
        0 & \text{otherwise}.
      \end{cases}
    \]  
    Then
    \[
      \nabla_w E \approx \frac{1}{n}\sum_{i: y_i f(x_i) < 1} -y_i x_i + 2\lambda w,
    \]
    \[
      \frac{\partial E}{\partial b} \approx \frac{1}{n}\sum_{i: y_i f(x_i) < 1} -y_i.
    \]

  Note the indicator \(\mathbf{1}\{y_i \neq \hat y_i\}\) should not appear in gradients for convex surrogates; instead the condition is on the margin \(y_i f(x_i)\).

- **Gradient descent algorithm (batch version)**  

  Given data \(\{(x_i, y_i)\}_{i=1}^n\), learning rate \(\eta > 0\), iterations \(T\):

  1. Initialize \(w^{(0)}, b^{(0)}\) (e.g. zeros or small random values).  
  2. For \(t = 0,1,\dots,T-1\):  
     - Compute gradients  
       \(\nabla_w E(w^{(t)}, b^{(t)})\), \(\partial E / \partial b\).  
     - Update  
       \[
         w^{(t+1)} = w^{(t)} - \eta \, \nabla_w E(w^{(t)}, b^{(t)}),
       \]
       \[
         b^{(t+1)} = b^{(t)} - \eta \, \frac{\partial E}{\partial b}(w^{(t)}, b^{(t)}).
       \]
  3. Return final parameters \(w^{(T)}, b^{(T)}\).

Stochastic gradient descent (updating using single examples or mini-batches) is typically used in practice.

## Perceptron: what it is

- **Model**  
  The perceptron uses the same linear decision function:
  \[
    f(x) = w^{\top}x + b, \quad \hat y = \text{sign}(f(x)).
  \]

- **Update rule** (online form)  
  For each training example \((x_i, y_i)\):

  - If correctly classified, i.e. \(y_i f(x_i) > 0\), do nothing.  
  - If misclassified, i.e. \(y_i f(x_i) \le 0\), update
    \[
      w \leftarrow w + \eta\, y_i x_i,
    \]
    \[
      b \leftarrow b + \eta\, y_i,
    \]
    where \(\eta > 0\) is a learning rate (often \(\eta = 1\) in the classic algorithm).

- **Key properties**  
  - If the data are linearly separable, the perceptron is guaranteed to find a separating hyperplane in a finite number of updates (Perceptron convergence theorem).  
  - The perceptron uses a piecewise-constant implicit loss (zero when correctly classified, positive when misclassified) that is non-convex; its update rule is derived directly from misclassification, not from minimizing a convex objective.

## Convex function: definition and intuition

- **Definition**  
  A real-valued function \(g : \mathbb{R}^d \to \mathbb{R}\) is **convex** if, for all \(u, v \in \mathbb{R}^d\) and all \(\theta \in [0,1]\),
  \[
    g(\theta u + (1 - \theta)v) \le \theta g(u) + (1 - \theta) g(v).
  \]
  Geometrically, the line segment between any two points on the graph of \(g\) lies above the graph.

- **Consequences for optimization**  
  - Any local minimum is a global minimum.  
  - Gradient descent (for differentiable convex functions) or subgradient methods (for non-smooth convex functions like hinge loss) converge to a global minimizer under suitable step-size conditions.  
  - This is why convex surrogate losses are preferred for training linear classifiers: they make learning well-behaved and theoretically tractable.

  ## Emperical Risk Minimization

  So far, our ml models looks like the following empirical error minimization:

  \[
    f^* = (argmin_f)L(X_train, Y_train; f)
    w^* = (argmin_w)L(X_train, Y_train; f)
  \]

  This is called ERM
  - learning only from the teaining data
  - but it is not guaranteed to generalize well to new data
  - this is called the bias-variance tradeoff
  