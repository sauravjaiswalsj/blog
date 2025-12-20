---
title: "Arrays"
description: "Array data structures, operations, and algorithms"
---

# Arrays

## Overview

Arrays are fundamental data structures that store elements in contiguous memory locations. This section covers array operations, algorithms, and complexity analysis.

## Basic Operations

### Access
- **Time Complexity**: $O(1)$
- **Space Complexity**: $O(1)$

### Search
- **Linear Search**: $O(n)$
- **Binary Search** (sorted): $O(\log n)$

### Insertion
- **At end**: $O(1)$
- **At arbitrary position**: $O(n)$

### Deletion
- **From end**: $O(1)$
- **From arbitrary position**: $O(n)$

## Common Algorithms

### Two Pointers Technique
Used for problems involving pairs or subarrays.

```python
def two_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

### Sliding Window
Efficient for subarray problems.

```python
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i-k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

## Advanced Topics

### Dynamic Arrays
- Amortized $O(1)$ insertion
- Automatic resizing
- Memory management

### Multi-dimensional Arrays
- Matrix operations
- Space-time trade-offs
- Cache efficiency considerations