# Lower Bound and Upper Bound

## Lower Bound
Lower bound is the index of the first element in the array that is greater than or equal to the target.

eg:
```
arr = [1, 2, 3, 4, 5,  5, 6, 7, 8, 9, 10]
target = 5
 o/p: 4
```
code:
```java
public int lowerBound(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    int ans = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;   

        if (arr[mid] >= target) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return ans;
}
```

## Upper Bound
Upper bound is the index of the first element in the array that is greater than the target.

eg:
```
arr = [1, 2, 3, 4, 5,  5, 6, 7, 8, 9, 10]
target = 5
 o/p: 6
```
code:
```java
public int upperBound(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    int ans = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;   

        if (arr[mid] > target) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return ans;
}
```

