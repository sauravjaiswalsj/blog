# Streams

## Sort Hashmap by value

## Max from array

int max = Arrays.stream(nums).max().orElse(0);

or 

int max = Arrays.stream(nums).max().getAsInt();

But array must not be empty in second case.
