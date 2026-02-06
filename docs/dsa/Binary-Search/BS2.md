# Binary Search on Answer

## What?

We apply the same binary search logic in this case as well. However, the caveat is that the we need to develop a criterion to check if the mid element is the answer or not.

We need to develop a criterion to check if the mid element is the answer or not. If it is, we return the mid element. If not, we move to the left or right half of the array depending on the criterion.

Binary search on answer is applied when we need to find the minimum or maximum value of a function that is monotonically increasing or decreasing.

BS can still be applied on the unsorted array, using this technique.

## Problems for BS on Answer
- [x] Peak Index in a Mountain Array
- [ ] Bitonic Array Maximum
- [ ] Search in a Bitonic Array
- [ ] Search in a row-wise + Col wise sorted array
- [ ] Find element in a sorted array that appears only once
- [ ] Allocate min number of pages 


# Bitonic Array

An array which is monotonically increasing first and then later monotonically decreasing.

```java
arr[] = {1, 2, 3, 4, 5, 4, 3, 2, 1}
```

```md
5 is the peak element
```


```md
    *   -> peak element
   /\  
  /  \
 /    \
```

Find maximum element in bitonic array = Peak element

## Time Complexity

- **Worst Case**: $O(\log n)$
- **Best Case**: $O(1)$
- **Average Case**: $O(\log n)$

### Space Complexity

- **Space Complexity**: $O(1)$

### Problems

#### Search in a bitonic array:

```java
public int search(int[] arr, int target) {
    int peak = findPeak(arr);
    int left = binarySearch(arr, target, 0, peak);
    if (left != -1) {
        return left;
    }
    return binarySearch(arr, target, peak + 1, arr.length - 1);
}
```

### Allocate min number of pages related problem

Book Allocation Problem (GFG)
Aggressive cow (spoj)
Prata and roti (spoj)
EKO (spoj)
Google kickstart A Q-3 2020