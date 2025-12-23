# Longest Common Prefix
Write a function to find the longest common prefix string amongst an array of strings.
If there is no common prefix, return an empty string `""`.

ex
```python
strs = ["flower","flow","flight"]
longest_common_prefix(strs)
```
output
```python
"fl"
```

ex
```python
strs = ["aaa","aa","aaaa"]
longest_common_prefix(strs)
```
output
```python
"aa"
```

# Intuition
<!-- Describe your first thoughts on how to solve this problem. -->
Take first String as prefix.
Then we iterate from next Set of strings.
For each string, we check  
We match string s with prefix, if not -> we eliminate last string of prefix
We do this until we match prefix is same as string.
We continue to do so until:
Either:
 we reach end of list, then we have prefix
or
our prefix is empty
e.g.
prefix = flower
str[1] = flow

Steps 1: (prefix = flower)
- flow == flower ❌ (we reduce prefix)
- flow == flowe  ❌ (we reduce prefix)
- flow == flow   ✅ 
prefix = flow
Step 2: (prefix = flow)
- flight == flow ❌ (we reduce prefix)
- flight == flo  ❌ (we reduce prefix)
- flight == fl   ✅ 

prefix = fl

# Complexity
- Time complexity: O(n * m) 
- m is length of prefix
<!-- Add your time complexity here, e.g. $$O(n)$$ -->

- Space complexity: O(1)
<!-- Add your space complexity here, e.g. $$O(n)$$ -->

# Code
```java []
class Solution {
    public String longestCommonPrefix(String[] strs) {
        String prefix = strs[0];

        for (int i = 1; i < strs.length; i++){
            while (!strs[i].startsWith(prefix))
                prefix = prefix.substring(0, prefix.length()-1);
            
            if (prefix.isEmpty())
                return "";
        }
        return prefix;
    }
}
```