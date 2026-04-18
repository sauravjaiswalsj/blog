---
title: "K-Nearest Neighbors (KNN): In-Depth Intuition and Failure Modes"
tags: [Machine Learning, KNN, Classification]
---

# K-Nearest Neighbors (KNN): Core Concepts & Intuition

The K-Nearest Neighbors (KNN) algorithm is one of the simplest yet most powerful baseline models in Machine Learning. 

## What is KNN?
KNN is an algorithm that classifies a new data point based on how its neighbors are classified. It is an **Instance-Based Learning** or **Lazy Learning** algorithm because it doesn't explicitly "learn" a global model during training (like finding weights in Logistic Regression). Instead, it memorizes the entire training dataset and does all the computational work (distance calculations) at prediction time.

### Is it a Linear or Non-Linear Classifier?
**KNN is a Non-Linear Classifier.** 
Unlike Logistic Regression or plain Support Vector Machines which draw straight lines (or flat hyperplanes) to divide classes, KNN creates highly flexible, jagged, and curved decision boundaries that easily adapt to complex, irregular patterns in the data.

### 1-NN vs 2-NN vs $K$-NN
- **1-NN (1-Nearest Neighbor):** The model looks at exactly *one* closest training point and copies its label. It is extremely sensitive to noise and highly likely to overfit.
- **2-NN (2-Nearest Neighbors):** The model looks at the 2 closest points. *(Note: Even numbers for $K$ are usually avoided in binary classification to prevent 1-vs-1 tie votes).*
- **$K$-NN:** Looks at $K$ closest points. The label with the highest majority vote wins. 

### Why do we need KNN?
- **No Training Time:** Since it just stores data, training is effectively instant.
- **No Assumptions:** It makes zero mathematical assumptions about the underlying data distribution (it doesn't assume the data must be linearly separable).
- **Baseline Metric:** It is incredibly easy to understand and serves as a fantastic baseline model to compare against complex Neural Networks or Tree models.
- **Versatile:** It can be used for Classification (majority vote) and Regression (averaging the numerical values of the neighbors).

## Distance Metrics: How do we measure "Nearest"?
To find the "nearest" neighbors, we must define distance mathematically. 

1. **Euclidean Distance (L2 Norm):** The standard "straight-line" physical distance between two points. It is the default and most common metric.
   - Formula: $\sqrt{\sum|x_i - y_i|^2}$
2. **Manhattan Distance (L1 Norm):** The distance between two points measured exactly along axes at right angles. Imagine a taxi navigating a grid of city blocks.
   - Formula: $\sum|x_i - y_i|$
   - *Why use Manhattan?* It is often preferred over Euclidean distance when dealing with higher-dimensional spaces because it doesn't heavily amplify the differences (via squaring), making it more robust to outliers in specific features.

---

The core logic of KNN is built squarely around these **distance metrics** and simple **majority voting**. 

In an implementation (like coding it from scratch), KNN simply calculates the distance between a test point and *all* training points, ranks them by closest distance, takes the top $K$ neighbors, and assigns the label with the highest vote. 

However, writing the code is just step one. To truly understand KNN for exams and real-world application, we need to explore its conceptual limitations—specifically **where it performs well, where it fails, and why.**

---

## 1. Where KNN Fails: The "Curse of Dimensionality"

A fundamental question you should be able to answer is: **Why does KNN perform badly when we have a lot of irrelevant features?**

### The Setup
Imagine you generate a dataset with $D$ features (columns). Only **2 of those features hold actual useful information (signal)** about the label, while the remaining features are completely random numbers (**noise**).

- You are not "manually adding meaningful features". You are increasing the width of the feature space with random noise.
- Low $D$ (e.g., $D=2$): Shape `(samples, 2)` -> Signal dominates.
- High $D$ (e.g., $D=100$): Shape `(samples, 100)` -> Noise dominates.

### What happens to the Distance?
KNN relies entirely on distance calculations: $\sqrt{\sum (x_i - y_i)^2}$. 
When dimensions increase, every irrelevant feature adds a random distance measurement to this formula.

| Dimensionality ($D$) | What Happens to Distance | KNN Performance |
| :--- | :--- | :--- |
| **2D / Low D** | Distances are meaningful; signal is clear. | KNN works incredibly well. |
| **10D**        | Slightly noisy, but the signal is still detectable. | Accuracy starts to drop slightly. |
| **50D**        | Noise dominates. Distances get corrupted by useless features. | Noticeable degradation. |
| **100D+**      | Distances become almost random and meaningless. | KNN fails completely. |

In very high-dimensional spaces, a strange geometric phenomenon occurs: **all points start to become almost equally far away from each other.** The Euclidean distance loses its discriminative power. This is officially known as the **Curse of Dimensionality**.

> **Key takeaway:** In KNN, more dimensions $\neq$ better performance. 

---

## 2. Where KNN Fails: Class Imbalance

Another critical flaw in KNN is how it handles datasets where one class heavily outnumbers the other.

Suppose you have 100 cats (Class A) and 5 dogs (Class B). If you introduce a new test image of a dog and ask for its $k=5$ nearest neighbors, what happens? 
Because there are so many cats everywhere in the feature space, it is highly likely that your 5 nearest neighbors will happen to be cats, outvoting the dogs.

KNN implicitly assumes that classes are relatively balanced. In severely imbalanced datasets, **majority voting heavily biases predictions toward the majority class.**

---

## 3. The Effect of Hyperparameter $K$: Bias vs. Variance

How does changing the number of neighbors ($K$) impact the model's accuracy on Training data versus unseen Test data? Let's analyze different scenarios:

### What is the accuracy of $k=1$ on TRAINING Data? Why?
- **Accuracy is exactly 100%.** 
- **Why?** When determining the nearest neighbor for a specific *training* point, the model looks at the training set. The point mathematically closest to it is *itself* (with a distance of exactly 0). Therefore, it perfectly predicts its own true label every single time.

### What is the accuracy of $k=1$ on TEST Data?
- **Typically Poor / Suboptimal.** 
- **Why?** Because $k=1$ creates a highly complex model that simply memorizes the training data, noise, and outliers. It has extremely high variance and **overfits**. A single noisy point will heavily skew the prediction of a nearby test point.

### What is the accuracy of $k=3$ on TRAINING Data?
- **High, but usually LESS than 100%.**
- **Why?** Since $k=3$ looks at the 3 closest points (voting), a particular training point could be surrounded by two noisy outliers of the opposite class. The outliers outvote the point’s own true label, causing a misclassification within the training set itself.

### What is the accuracy of $k=3$ on TEST Data?
- **Generally Better than $k=1$.**
- **Why?** Expanding the vote to 3 neighbors smooths out the model. Single noisy points no longer dictate the prediction entirely. It makes the model more robust and less susceptible to the training set's random noise.

### What is the accuracy of $k=31$ on TRAINING and TEST Data?
- **Accuracy drops significantly for both (compared to optimal $k$).**
- **Why?** Using an excessively large $k$ (like 31) causes the model to suffer from high bias (**underfitting**). You are asking the model to look at *so many* points that it loses the concept of a "local" neighborhood. It just ends up predicting the globally most frequent class in the overall dataset, completely blurring out the distinct patterns in the feature space.

---

## 4. Visualizing Classification Boundaries

You can build an intuitive understanding of bias and variance by visually analyzing the decision boundary for different values of $k$:

1. **$k = 1$:** The decision boundary is highly **jagged, disjointed, and complex**. It creates tiny isolated islands around outlier points to make sure it gets 100% training accuracy. This is the definition of overfitting.
2. **$k \approx 5 \text{ to } 15$:** The decision boundary becomes **smooth** and captures the general overall "shape" or trend of the classes, ignoring tiny random blips of noise. This is usually the optimal "sweet spot".
3. **Huge $k$ (e.g., $k = \text{Half the dataset}$):** The decision boundary becomes a single massive block that completely overrides local clusters, effectively devolving into a simple, straight, uniform division or purely predicting the majority class. This is severe underfitting.


## KNN in Java

```java
import java.util.*;

public class KNN {

    // Function to compute Euclidean distance
    public static double distance(double[] a, double[] b) {
        double sum = 0;
        for (int i = 0; i < a.length; i++) {
            sum += Math.pow(a[i] - b[i], 2);
        }
        return Math.sqrt(sum);
    }

    // KNN prediction
    public static int[] predict(double[][] X_train, int[] y_train,
                                double[][] X_test, int k) {

        int[] predictions = new int[X_test.length];

        for (int i = 0; i < X_test.length; i++) {

            // Store (distance, label)
            ArrayList<double[]> distances = new ArrayList<>();

            for (int j = 0; j < X_train.length; j++) {
                double dist = distance(X_test[i], X_train[j]);

                distances.add(new double[]{dist, y_train[j]});
            }

            // Sort by distance
            distances.sort(Comparator.comparingDouble(a -> a[0]));

            // Get k nearest neighbors
            HashMap<Integer, Integer> count = new HashMap<>();

            for (int n = 0; n < k; n++) {
                int label = (int) distances.get(n)[1];
                count.put(label, count.getOrDefault(label, 0) + 1);
            }

            // Majority vote
            int bestLabel = -1;
            int maxCount = -1;

            for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
                if (entry.getValue() > maxCount) {
                    maxCount = entry.getValue();
                    bestLabel = entry.getKey();
                }
            }

            predictions[i] = bestLabel;
        }

        return predictions;
    }

    // Example usage
    public static void main(String[] args) {

        double[][] X_train = {
            {1}, {3}, {5}, {7}
        };

        int[] y_train = {0, 0, 1, 1};

        double[][] X_test = {
            {2}, {6}
        };

        int k = 3;

        int[] result = predict(X_train, y_train, X_test, k);

        System.out.println(Arrays.toString(result));
    }
}
```