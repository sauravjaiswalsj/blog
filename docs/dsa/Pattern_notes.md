# Patterns

## HashMap and HashSet Patterns
1. Find duplicates/Uniquenes
2. Group or Map Elements - Suitable for problems that require mapping elements to other elements or groups.
3. Count Occurrences/Frequencies - Useful for counting the frequency of elements in an array or string.
4. Check for seen elements - Useful for checking if an element has been seen before in an array or string.
5. Track State - Useful for tracking the state of an element or a group of elements.

TradeOffs:
- HashMap: Space complexity is O(n) where n is the number of elements in the array or string. Time complexity is O(1) for average case and O(n) for worst case.
- HashSet: Space complexity is O(n) where n is the number of elements in the array or string. Time complexity is O(1) for average case and O(n) for worst case.

Power of HashMap and HashSet:
- Reduced time complexity from $O(n^2) $ to $O(n)$ for faster processing.
- Store and retrieve elements in constant time.
- Check for membership in constant time.
- Count occurrences of elements in linear time.
- Tracks counts, flags, states, and mappings of elements.

## Prefix Sum:

- Useful for problems that require finding the sum of a subarray or substring in constant time.
- Example: Maximum sum of a subarray of size k.

1. Range queries ```sum(l,r) = pref[r] - pref[l-1]```
2. Subarray with target sum ```prefix_sum[i] - prefix_sum[j] = target```
3. Subarray with XOR target ```prefix_xor[i] ^ prefix_xor[j] = target```
4. Difference between two subarrays ```diff = prefix_sum[r] - prefix_sum[l-1]```
5. Prefix with parity ```prefix_xor[i] ^ prefix_xor[j] = 0```

### Prefix + HashMap

Used for many O(n) subarray problems.

Example problems:

Subarray Sum Equals K

Longest Subarray With Sum K

Count of Subarrays with XOR K

Continuous Subarray Sum

Typical trick:

```java
prefix_sum
hashmap[prefix_sum]
```
Example:

```java
sum += nums[i]

if (sum - k) exists:
    answer++
```
## Sliding Window
1. Linear Structure : array/strings
2. Contigious Segment : problems that require finding a subarray or substring of a fixed size or dynamic size.
3. Problem requirement:
    - Maximum/Minimum subarray or substring
    - Longest/Shortest subarray or substring with a certain property.
    - Count Distinct/Duplicate
    - Maintain State

### Fixed Size
- Useful for problems that require finding a subarray or substring of a fixed size.
- Example: Maximum sum of a subarray of size k.
### Dynamic Size
- Useful for problems that require finding a subarray or substring of a dynamic size.
- Example: Longest substring without repeating characters.

Components of Sliding Window:
- Expand window: Add elements to the window.
- Shring window: Remove elements from the window.
- Check Validity: Check if the current window satisfies the problem requirement.
    - Hashset/ map
    - Counter/ Frequency Map
    - Running Sum
    - Min/Max queues
- Update Result: Update the result if the current window satisfies the problem requirement.

Identification:
- Problem Statement: Identify if the problem requires finding a subarray or substring of a fixed size or dynamic size.
- Constraints: Check if the problem has any constraints that limit the size of the subarray or substring.

1. Contigious/Subarray/Substring or Longest/Shorted Segment => Both (fixed + variable)
2. Min Sum/ Max Sum =>  Both (fixed + variable)
3. At most/At least k times => Shrinking window strategy
4. Unique Elements => Hashset/ Counter/ Frequency Map
5. Moving Average / Rolling Sum => Constant width window

At Most K Trick

Classic CP trick.

Example:

Subarrays with exactly K distinct

Use:

exactly(K) = atMost(K) - atMost(K-1)

Used in problems like:

subarrays with K distinct

nice subarrays

binary arrays

2️⃣ Monotonic Queue Sliding Window

For problems like:

Sliding window maximum

Use deque.

Complexity:

O(n)
3️⃣ Sliding Window + Frequency

For problems like:

Longest repeating character replacement

Where window validity depends on max frequency.

4️⃣ Sliding Window with Budget

Example:

Max consecutive ones with K flips

You maintain a budget (k).


## Suffix Sum Pattern:
- Suffix sum is the mirror of prefix sum. Instead of accumulating values from the start, you accumulate values from the end.
```suffix[i] = arr[i] + arr[i+1] + ... + arr[n-1]```
```java
arr = [2, 4, 1, 3]

suffix[3] = 3
suffix[2] = 1 + 3 = 4
suffix[1] = 4 + 1 + 3 = 8
suffix[0] = 2 + 4 + 1 + 3 = 10
---------------------------
suffix = [10, 8, 4, 3]
```
eg: 
```java
suffix[n-1] = arr[n-1];

for(int i=n-2;i>=0;i--){
    suffix[i] = suffix[i+1] + arr[i];
}
```
Used in Range Sum queries using suffix

3️⃣ Range Query Using Suffix

Suffix sums help answer queries like:

sum(i → n-1)

in O(1) time.

Example:

sum(2 → end) = suffix[2]
4️⃣ Key CP Patterns Using Suffix Sum
Pattern 1 — Right Side Contribution

Used when each element needs information about elements to its right.

Example idea:

count elements to the right
sum elements to the right
cost to convert right side

Typical problem pattern:

for i in range(n):
    left_part
    right_part = suffix[i+1]
Pattern 2 — Prefix + Suffix Combination (VERY COMMON)

Many problems split the array:

left side
current index
right side

Example structure:

answer = max(prefix[i] + suffix[i+1])

Typical problems:

Maximum split score

Partition problems

Maximum prefix + suffix sum

Pattern 3 — Remove Element Problems

When removing element i, we need:

sum of left
+
sum of right

Using:

prefix[i-1] + suffix[i+1]

Classic idea.

Example:

LeetCode 238 - Product of Array Except Self

### Uses prefix product + suffix product.

Pattern 4 — Suffix Minimum / Maximum

Sometimes we store min or max instead of sum.

Example:

suffixMin[i] = min(arr[i], suffixMin[i+1])

Used in problems like:

Partition array

Next smaller element style problems

Minimum difference splits

Pattern 5 — DP Optimization

Suffix sums are often used in DP to speed up transitions.

Example:

Instead of

for j in range(i,n):
    dp[i] += something[j]

Use:

dp[i] = suffix[j]

Reducing O(n²) → O(n).

5️⃣ Common Competitive Programming Problems
Product Except Self
result[i] = prefix[i-1] * suffix[i+1]

Time:

O(n)

Space:

O(1) optimized
Maximum Score After Split

Split a binary string:

score = zeros_left + ones_right

Use:

prefixZeros
suffixOnes
Trapping Rainwater (conceptually similar)

Though solved with prefix max and suffix max.

water = min(prefixMax, suffixMax) - height

When to Use

Right-side contributions

Array partition problems

Remove element calculations

Combine with prefix


## Two Pointers
When to Use

Sorted arrays

Pair problems

Opposite-direction traversal

Types
Opposite Direction

Example:

Two sum sorted.

left++
right--
Same Direction

Used in:

Removing duplicates

Partition problems

Example:

slow pointer
fast pointer
Common Problems

Two sum sorted

Container with most water

Remove duplicates

## Binary Search
When to Use

Sorted arrays

### Monotonic conditions

Search space optimization

Core Idea

Reduce search space by half. O(log n)
Classic Template
```java
while left <= right:
    mid = (left + right)//2
    
    if condition(mid):
        right = mid - 1
    else:
        left = mid + 1
```

### Binary Search on Answer

Very common in CP.

Example:

Find minimum value satisfying condition.

Problems like:

Minimum eating speed

Allocate books

Shipping packages

## Monotonic Stack
When to Use

Problems involving:

Next greater element

Previous smaller element

Range influence

Pattern

Maintain stack in sorted order.

Example:

Next greater element.

while stack and stack[-1] < current:
    stack.pop()
Common Problems

Next greater element

Daily temperatures

Largest rectangle in histogram

## Monotonic Queue

Used for sliding window min/max.

Maintain deque in decreasing order.

Example:

Sliding window maximum.

remove smaller elements
push new element

Time:

O(n)
## Greedy
When to Use

If the problem allows local optimal choices that lead to global optimal.

Examples

Activity selection

Jump game

Gas station

Typical Pattern
choose best option now
## Heap / Priority Queue
When to Use

Top K elements

Real-time min/max

Scheduling problems

Operations
Operation	Time
Insert	O(log n)
Remove	O(log n)
Examples

Top K frequent elements

K closest points

Merge K sorted lists

## Backtracking
When to Use

Problems involving:

permutations

combinations

subsets

constraint search

Template
def backtrack(path):

    if solution:
        result.append(path)
        return

    for choice in choices:
        choose
        backtrack(path)
        undo
Examples

## Permutations

N-Queens

Sudoku solver

## Dynamic Programming
When to Use

Problem has:

Overlapping subproblems

Optimal substructure

Steps

Define state

Define recurrence

Compute DP table

Example

Fibonacci:

dp[i] = dp[i-1] + dp[i-2]
Common DP Types
Type	Example
1D DP	House Robber
2D DP	LCS
Knapsack	Subset sum
Interval DP	Burst balloons
Bitmask DP	Traveling salesman
Quick Recognition Cheat Sheet
Problem Clue	Pattern
Contiguous segment	Sliding Window
Range sum	Prefix Sum
Pairs in sorted array	Two Pointers
Search sorted	Binary Search
Next greater element	Monotonic Stack
Top K	Heap
Combinations/permutations	Backtracking
Optimization with overlapping states	DP

