# LaTeX Notes System - Setup Guide

## 🎯 Overview

Your Docusaurus site now automatically converts LaTeX files to Markdown for web display. This allows you to write notes in LaTeX and have them rendered beautifully on the web with proper math notation.

## 📁 Directory Structure

Organize your notes by subject:

```
docs/
├── intro.md                    # Homepage
├── dsa/                        # Data Structures & Algorithms
│   ├── arrays.tex
│   ├── trees.tex
│   └── graphs.tex
├── mathematics/                # Math subjects
│   ├── calculus.tex
│   ├── linear-algebra.tex
│   └── discrete-math.tex
├── java/                       # Java programming
│   ├── oop.tex
│   ├── collections.tex
│   └── concurrency.tex
├── system-design/              # System Design
│   ├── scalability.tex
│   ├── databases.tex
│   └── distributed-systems.tex
└── algorithms/                 # Algorithms (your existing)
    └── algo.tex               # ✅ Already converted!
```

## 🚀 Quick Start

### 1. Add New LaTeX Files

Create `.tex` files in the appropriate subject directory:

```latex
\documentclass[a4paper,11pt]{article}
\usepackage{amsmath, amssymb}

\title{Binary Search Trees}
\begin{document}
\maketitle

\section{Introduction}
A Binary Search Tree (BST) is a tree data structure where:
- Left subtree values < root value
- Right subtree values > root value

\subsection{Time Complexity}
Search operation: $O(\log n)$ average case

\begin{lstlisting}[language=Java]
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
\end{lstlisting}

\end{document}
```

### 2. Convert to Markdown

```bash
# Convert all LaTeX files
npm run convert-latex

# Watch for changes (auto-convert on save)
npm run watch-latex
```

### 3. Update Sidebar

Add new files to `sidebars.ts`:

```typescript
{
  type: 'category',
  label: 'DSA',
  items: [
    'dsa/arrays',
    'dsa/trees',
    'dsa/binary-search-trees',  // New file
  ],
}
```

### 4. Build & Serve

```bash
# Development (with auto-conversion)
npm run dev

# Production build
npm run build
npm run serve
```

## 🔧 LaTeX Conversion Features

### ✅ Supported LaTeX Elements

- **Sections**: `\section{}`, `\subsection{}`, `\subsubsection{}`
- **Math**: `$$...$$`, `\begin{equation}`, `\begin{align}`
- **Text Formatting**: `\textbf{}`, `\textit{}`, `\emph{}`
- **Lists**: `\begin{itemize}`, `\begin{enumerate}`
- **Code**: `\begin{lstlisting}[language=...]`
- **Tables**: `\begin{tabular}` → Markdown tables
- **Special**: `\boxed{}` → **bold text**

### 📝 LaTeX → Markdown Examples

**Input LaTeX:**
```latex
\section{Complexity Analysis}
Time complexity: $O(n \log n)$

\begin{lstlisting}[language=Python]
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    return left
\end{lstlisting}
```

**Output Markdown:**
```markdown
## Complexity Analysis
Time complexity: $O(n \log n)$

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    return left
```
```

## 📋 Workflow

### Daily Usage

1. **Write notes** in LaTeX using your favorite editor
2. **Save files** in appropriate subject directories
3. **Auto-convert** with `npm run watch-latex` (runs in background)
4. **Preview** with `npm run dev`
5. **Build** for production with `npm run build`

### Adding New Subjects

1. Create new directory: `docs/new-subject/`
2. Add LaTeX files: `docs/new-subject/topic.tex`
3. Update `sidebars.ts`:
   ```typescript
   {
     type: 'category',
     label: 'New Subject',
     items: ['new-subject/topic'],
   }
   ```
4. Convert and build

## 🎨 Math & Code Rendering

### Mathematical Notation
- **Inline**: `$O(n)$` → $O(n)$
- **Block**: `$$\sum_{i=1}^n i$$` → $$\sum_{i=1}^n i$$
- **Aligned equations** with `\begin{align}`

### Code Highlighting
Supports multiple languages:
- `[language=Python]` → Python syntax
- `[language=Java]` → Java syntax  
- `[language=C++]` → C++ syntax

## 🔍 Troubleshooting

### Common Issues

**LaTeX not converting?**
- Check file extension is `.tex`
- Ensure file is in `docs/` directory
- Run `npm run convert-latex` manually

**Math not rendering?**
- Use `$$...$$` for block math
- Use `$...$` for inline math
- Check KaTeX syntax compatibility

**Code not highlighting?**
- Specify language: `\begin{lstlisting}[language=Python]`
- Supported: Python, Java, C++, JavaScript, etc.

### File Watching Issues

If auto-conversion stops working:
```bash
# Stop current watcher (Ctrl+C)
# Restart watcher
npm run watch-latex
```

## 📚 Best Practices

### LaTeX Writing
- Use clear section hierarchies
- Include language tags for code blocks
- Use standard math environments
- Keep files focused on single topics

### Organization
- Group related topics in same directory
- Use descriptive filenames
- Update sidebar after adding files
- Test conversion before committing

### Performance
- Keep LaTeX files reasonably sized
- Use `npm run convert-latex` before builds
- Consider splitting large documents

## 🎯 Your Current Setup

✅ **algo.tex** already converted to **algo.md**  
✅ **Sidebar configured** for subject-based organization  
✅ **Math rendering** enabled with KaTeX  
✅ **Auto-conversion** scripts ready  

**Next Steps:**
1. Create subject directories (`dsa/`, `mathematics/`, `java/`)
2. Add your LaTeX files
3. Run `npm run watch-latex` for auto-conversion
4. Start writing notes in LaTeX!

Your LaTeX notes system is ready to use! 🚀