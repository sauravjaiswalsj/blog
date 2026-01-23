# Lecture 4: 

## General structure of how model works
## Steps of building a model

1. Represent the problem
2. Evaluate the model
3. Optimize the model
## Building Linear Discriminants

- Representation
    - $x \in \mathbb{R}^n$
    - $y \in \{-1, 1\}$
    - Features
    - Linear Function $f(x) = w^T x + b$
    - Decision Rule $y = \text{sign}(f(x))$

- Evaluation
    - Accuracy $Accuracy = \frac{1}{n} \sum_{i=1}^n \text{sign}(f(x_i)) = y_i$

-Optimization
    - Find a  line that minimizes misclassification

## Classification of a loss function:

* Zero-One Loss: $L(y, f(x)) = \text{1}_{y \neq f(x)}$

    - our error function is $E(w, b) = \frac{1}{n} \sum_{i=1}^n L(y_i, f(x_i))$
    - we want to minimize $E(w, b)$
    - we can use gradient descent to minimize $E(w, b)$
    - the gradient of $E(w, b)$ with respect to $w$ is $\frac{1}{n} \sum_{i=1}^n -y_i x_i \text{1}_{y_i \neq f(x_i)}$
    - the gradient of $E(w, b)$ with respect to $b$ is $\frac{1}{n} \sum_{i=1}^n -y_i \text{1}_{y_i \neq f(x_i)}$
    - why it is bad way of optimization?
        - it is not differentiable, so we cannot use gradient descent
        - it is not convex, so we cannot use gradient descent
        - it is not smooth, so we cannot use gradient descent

    Surrogate Classification Loss
    - $L(y, f(x)) = \log(1 + \exp(-y f(x)))$
    - why it is better than zero-one loss?
        - it is differentiable, so we can use gradient descent
        - it is convex, so we can use gradient descent
        - it is smooth, so we can use gradient descent
        - it is a convex function, so we can use gradient descent to minimize it
        - it is a surrogate loss function, so we can use it to minimize the zero-one loss
    
    $l(f(x), y) = \{ (0, y(f(x) > 1) = (0, 1-yf(x) < 0>)) ,( 1 - y f(x), yf(x) \leq 1 = (1-yf(x) , 1-yf(x) >=0) \}$

    or $l(f(x), y) = \max(0, 1 - y f(x))$

 * Hinge Loss: $L(y, f(x)) = \max(0, 1 - y f(x))$
  - A convex over-approximation of the 0-1 loss
  - It is zero when the prediction is correct, and increases linearly with the margin
  - It is a convex function, so we can use gradient descent to minimize it

* Convex Loss Functions:
    - Logistic Loss: $L(y, f(x)) = \log(1 + \exp(-y f(x)))$
    - Hinge Loss: $L(y, f(x)) = \max(0, 1 - y f(x))$
    - these loss functions are convex, so we can use gradient descent to minimize them


### Optimization:
- We can use gradient descent to minimize the convex loss functions
- The gradient of the loss function with respect to $w$ is $\frac{1}{n} \sum_{i=1}^n -y_i x_i \text{1}_{y_i \neq f(x_i)}$
- The gradient of the loss function with respect to $b$ is $\frac{1}{n} \sum_{i=1}^n -y_i \text{1}_{y_i \neq f(x_i)}$
 
 \[
    min_w L(X, Y; w) = \sum_{i=1}^n L(0, 1 - y_i, f(x_i))
 ]


