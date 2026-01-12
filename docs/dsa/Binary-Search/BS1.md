# Binary Search

Search for an element in a sorted array.

eg:
```
arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
target = 5
```

ps:
- The array is sorted in ascending order.
- The array may contain duplicates.

low = 0
high = len(arr) - 1

do until low <= high:
    find mid = low + (high - low) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        low = mid + 1
    else:
        high = mid - 1

return -1

code:
```java
public int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return -1;
}
```

Why mid = low + (high - low) / 2
- To avoid overflow in case of large values of low and high.
- It is equivalent to (low + high) // 2, but it prevents overflow.
