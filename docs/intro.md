---
title: "My Notes"
description: "Subject-wise technical documentation and study materials"
slug: /intro
---

# My Notes

## Overview

This documentation contains my subject-wise notes and study materials, automatically converted from LaTeX sources. The content is organized by academic subjects for easy navigation and reference.

## Subjects

### DSA (Data Structures & Algorithms)
Comprehensive coverage of fundamental data structures and algorithms including:
- **Arrays** - Basic operations, searching, sorting
- **Trees** - Binary trees, BST, balanced trees, traversals
- **Graphs** - Representations, traversals, shortest paths, MST

### Mathematics 6.120
Mathematical concepts, proofs, and problem-solving techniques covering:
- [Proofs](maths/6.120J/proofs.md) 

### Java
Java programming concepts, syntax, and advanced topics:
- Object-Oriented Programming
- Collections Framework
- Concurrency and Multithreading
- Design Patterns

### System Design
Large-scale system architecture and design principles:
- Scalability patterns
- Database design
- Distributed systems
- Performance optimization

## LaTeX Integration

All notes are written in LaTeX and automatically converted to Markdown for web display. This ensures:

- **Mathematical Notation** - Proper rendering of complex equations using KaTeX
- **Code Highlighting** - Syntax highlighting for multiple programming languages  
- **Professional Formatting** - Clean, academic-style presentation
- **Version Control** - Easy tracking of changes in source LaTeX files

## Mathematical Notation

Mathematical expressions are rendered using KaTeX. Examples:

**Inline math**: The time complexity is $O(n \log n)$

**Block equations**:
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Code Examples

Code blocks support syntax highlighting:

```java
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1;
    }
}
```

## Usage

To add new notes:

1. Create `.tex` files in the appropriate subject directory
2. Run `npm run convert-latex` to convert LaTeX to Markdown
3. Update `sidebars.ts` to include new files
4. Build and deploy with `npm run build`

The conversion process preserves mathematical notation, code blocks, and document structure while making content web-accessible.