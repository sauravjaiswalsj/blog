---
title: "Graphs"
description: "Graph data structures, algorithms, and applications"
---

# Graphs

## Overview

Graphs are collections of vertices (nodes) connected by edges. They model relationships and connections in various domains.

## Graph Representations

### Adjacency Matrix
- **Space**: $O(V^2)$
- **Edge lookup**: $O(1)$
- **Add vertex**: $O(V^2)$

```python
class GraphMatrix:
    def __init__(self, vertices):
        self.V = vertices
        self.graph = [[0] * vertices for _ in range(vertices)]
    
    def add_edge(self, u, v, weight=1):
        self.graph[u][v] = weight
        self.graph[v][u] = weight  # For undirected graph
```

### Adjacency List
- **Space**: $O(V + E)$
- **Edge lookup**: $O(V)$
- **Add vertex**: $O(1)$

```python
from collections import defaultdict

class GraphList:
    def __init__(self):
        self.graph = defaultdict(list)
    
    def add_edge(self, u, v):
        self.graph[u].append(v)
        self.graph[v].append(u)  # For undirected graph
```

## Graph Traversals

### Depth-First Search (DFS)
- **Time**: $O(V + E)$
- **Space**: $O(V)$

```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

### Breadth-First Search (BFS)
- **Time**: $O(V + E)$
- **Space**: $O(V)$

```python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        print(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

## Shortest Path Algorithms

### Dijkstra's Algorithm
For non-negative weighted graphs.

**Time Complexity**: $O((V + E) \log V)$ with binary heap

```python
import heapq

def dijkstra(graph, start):
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_distance, current_vertex = heapq.heappop(pq)
        
        if current_distance > distances[current_vertex]:
            continue
        
        for neighbor, weight in graph[current_vertex]:
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances
```

### Bellman-Ford Algorithm
Handles negative weights, detects negative cycles.

**Time Complexity**: $O(VE)$

```python
def bellman_ford(graph, start):
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start] = 0
    
    # Relax edges V-1 times
    for _ in range(len(graph) - 1):
        for vertex in graph:
            for neighbor, weight in graph[vertex]:
                if distances[vertex] + weight < distances[neighbor]:
                    distances[neighbor] = distances[vertex] + weight
    
    # Check for negative cycles
    for vertex in graph:
        for neighbor, weight in graph[vertex]:
            if distances[vertex] + weight < distances[neighbor]:
                return None  # Negative cycle detected
    
    return distances
```

## Minimum Spanning Tree

### Kruskal's Algorithm
**Time Complexity**: $O(E \log E)$

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

def kruskal(edges, n):
    edges.sort(key=lambda x: x[2])  # Sort by weight
    uf = UnionFind(n)
    mst = []
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
    
    return mst
```

### Prim's Algorithm
**Time Complexity**: $O(E \log V)$

```python
def prim(graph):
    start = next(iter(graph))
    visited = {start}
    edges = [(weight, start, neighbor) 
             for neighbor, weight in graph[start]]
    heapq.heapify(edges)
    mst = []
    
    while edges:
        weight, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        
        visited.add(v)
        mst.append((u, v, weight))
        
        for neighbor, w in graph[v]:
            if neighbor not in visited:
                heapq.heappush(edges, (w, v, neighbor))
    
    return mst
```