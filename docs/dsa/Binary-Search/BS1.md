# Binary Search
Binary Search is a fast algorithm for searching in a sorted arra of keys `S`. To search for key q, we compare `q` to the middle key `S[n\2]`. If `q` appears before `S[n\2]`, it must reside in the top half; if not, it must reside in the bottom half of `S`. If repeating this process recusively on the correct half, we locatte the key in a total of `log[n]` comparisions.

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

do until low `<=` high:
    find mid = low + (high - low) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        low = mid + 1
    else:
        high = mid - 1

return -1

or 

```java
int binarySearch(int[] S, int q, int low, int high){
    if (low > high)
        return -1;
    int mid = low + (high - low) /2;

    if (S[mid] == 0)
        return mid;
    else if (S[mid] < q)
        return binarySearch(S, q, mid + 1, high);
    else 
        return binarySearch(S, q, low, mid - 1);
}
```

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
