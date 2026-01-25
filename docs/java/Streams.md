# Streams

## Sort Hashmap by value

## Max from array
```java
int max = Arrays.stream(nums).max().orElse(0);
```

or 
```java
int max = Arrays.stream(nums).max().getAsInt();
```

But array must not be empty in second case.

## Read String to array 

Here is the most efficient way to read a line like "4 5 6" from a BufferedReader and convert it into an int[] using streams.
// Assuming 'br' is your BufferedReader

```java
int[] arr = Arrays.stream(br.readLine().trim().split("\\s+"))
                  .mapToInt(Integer::parseInt)
                  .toArray();
```
