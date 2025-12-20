---
title: "Trees"
description: "Tree data structures, traversals, and algorithms"
---

# Trees

## Overview

Trees are hierarchical data structures consisting of nodes connected by edges. Each tree has a root node and subtrees of children with a parent node.

## Basic Properties

### Terminology
- **Root**: Top node with no parent
- **Leaf**: Node with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to node

### Mathematical Properties
For a binary tree with $n$ nodes:
- **Minimum height**: $\lfloor \log_2 n \rfloor$
- **Maximum height**: $n - 1$
- **Maximum nodes at level $i$**: $2^i$

## Binary Trees

### Traversals

#### Inorder (Left, Root, Right)
```python
def inorder(root):
    if root:
        inorder(root.left)
        print(root.val)
        inorder(root.right)
```

#### Preorder (Root, Left, Right)
```python
def preorder(root):
    if root:
        print(root.val)
        preorder(root.left)
        preorder(root.right)
```

#### Postorder (Left, Right, Root)
```python
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val)
```

### Binary Search Trees (BST)

#### Properties
- Left subtree values < root value
- Right subtree values > root value
- Inorder traversal gives sorted sequence

#### Operations
- **Search**: $O(\log n)$ average, $O(n)$ worst
- **Insert**: $O(\log n)$ average, $O(n)$ worst
- **Delete**: $O(\log n)$ average, $O(n)$ worst

## Balanced Trees

### AVL Trees
- Height difference between subtrees ≤ 1
- Guaranteed $O(\log n)$ operations
- Rotation operations for balancing

### Red-Black Trees
- Each node colored red or black
- Root is black
- Red nodes have black children
- All paths from root to leaves have same number of black nodes

## Tree Algorithms

### Lowest Common Ancestor (LCA)
```python
def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    
    if left and right:
        return root
    return left or right
```

### Tree Diameter
```python
def diameter(root):
    def height(node):
        if not node:
            return 0
        
        left_height = height(node.left)
        right_height = height(node.right)
        
        # Update diameter
        nonlocal max_diameter
        max_diameter = max(max_diameter, left_height + right_height)
        
        return 1 + max(left_height, right_height)
    
    max_diameter = 0
    height(root)
    return max_diameter
```