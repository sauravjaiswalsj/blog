# LaTeX Notes Website

A Docusaurus-based website that automatically converts LaTeX files to Markdown for web display, organized by academic subjects.

## 🚀 Quick Start

### Prerequisites
- Node.js (v20+)
- Pandoc (for LaTeX conversion)

### Installation
```bash
npm install
```

### Development
```bash
# Convert LaTeX files and start development server
npm run dev

# Or run separately:
npm run convert-latex  # Convert .tex files to .md
npm start              # Start development server
```

### Production Build
```bash
npm run build
npm run serve
```

## 📁 Project Structure

```
docs/
├── intro.md                    # Homepage
├── dsa/                        # Data Structures & Algorithms
│   ├── arrays.md
│   ├── trees.md
│   └── graphs.md
├── maths/                      # Mathematics
│   └── calculus.md
├── java/                       # Java Programming
│   └── oop-basics.md
├── algorithms/                 # Algorithm Analysis
│   ├── algo.tex               # LaTeX source
│   ├── algo.md                # Auto-generated
│   └── overview.md
└── systems/                    # System Design
    └── overview.md
```

## 🔒 Authentication System

Your notes are now **password protected**! Only users with the correct password can access the documentation section.

### Features
- **Password Protection**: Secure access to all notes
- **24-Hour Sessions**: Stay logged in for a full day
- **Responsive Design**: Works on all devices
- **Easy Configuration**: Simple password management

### Setup
1. **Change Password**: Edit `src/config/auth.ts`
   ```typescript
   export const AUTH_CONFIG = {
     password: 'your-secure-password-here',
   };
   ```

2. **Build & Deploy**: Normal deployment process
3. **Share Password**: Give to authorized users only

### User Experience
- Visit any `/docs/` page → Password prompt appears
- Enter password → Full access to all notes
- Session lasts 24 hours → Automatic logout for security
- Manual logout available anytime

**Default Password**: `notes2025` (⚠️ **Change this immediately!**)

## 🔄 Dynamic Sidebar Generation

The sidebar is **automatically generated** based on your file structure:

- **Subject Detection**: Automatically detects subject directories
- **File Organization**: Sorts files alphabetically within subjects
- **Auto-Update**: Regenerates when files are added/removed
- **Custom Labels**: Uses predefined labels for common subjects

### Supported Subjects
- `dsa/` → "DSA (Data Structures & Algorithms)"
- `mathematics/` or `maths/` → "Mathematics"
- `java/` → "Java Programming"
- `algorithms/` → "Algorithm Analysis"
- `systems/` or `system-design/` → "System Design"
- Any other directory → Formatted title (e.g., `machine-learning/` → "Machine Learning")

## 📝 Adding New Notes

### 1. Create LaTeX Files
Add `.tex` files in appropriate subject directories:

```latex
\documentclass[a4paper,11pt]{article}
\usepackage{amsmath, amssymb}

\title{Your Topic Title}
\begin{document}
\maketitle

\section{Introduction}
Your content here with math: $O(n \log n)$

\begin{lstlisting}[language=Python]
def example():
    return "Hello World"
\end{lstlisting}

\end{document}
```

### 2. Convert to Markdown
```bash
# Convert all LaTeX files and regenerate sidebar
npm run convert-latex

# Watch for changes (auto-convert and regenerate sidebar)
npm run watch-sidebar
```

### 3. Sidebar Auto-Updates

**No manual sidebar editing needed!** The system automatically:
- Detects new subject directories
- Adds/removes files from navigation
- Maintains proper organization
- Updates on every build

## 🔧 LaTeX Conversion

Uses **Pandoc** for robust LaTeX → Markdown conversion:

- ✅ **Math notation**: `$...$` and `$$...$$`
- ✅ **Code blocks**: `\begin{lstlisting}[language=Python]`
- ✅ **Sections**: `\section{}` → `## Section`
- ✅ **Tables**: LaTeX tables → Markdown tables
- ✅ **Formatting**: `\textbf{}` → **bold**

### Conversion Script
```bash
./scripts/tex-to-md.sh
```

## 📚 Subjects Organization

### DSA (Data Structures & Algorithms)
- Arrays, Trees, Graphs
- Algorithm complexity analysis
- Implementation examples

### Mathematics
- Calculus, Linear Algebra
- Discrete Mathematics
- Mathematical proofs

### System Design
- Distributed systems
- Scalability patterns
- Architecture principles

### Algorithms
- Algorithm analysis
- Complexity theory
- Problem-solving techniques

## 🎨 Features

- **LaTeX Support**: Write in LaTeX, display on web
- **Math Rendering**: KaTeX for beautiful equations
- **Code Highlighting**: Syntax highlighting for multiple languages
- **Responsive Design**: Mobile-friendly interface
- **Search**: Built-in search functionality
- **Dark Mode**: Automatic dark/light theme switching

## 🛠 Scripts

- `npm run dev` - Development with LaTeX conversion + sidebar generation + auth
- `npm run convert-latex` - Convert all .tex files + regenerate sidebar
- `npm run generate-sidebar` - Regenerate sidebar from current files
- `npm run watch-sidebar` - Watch files and auto-regenerate sidebar
- `npm run build` - Production build (includes conversion + sidebar + auth)
- `npm run serve` - Serve built site locally (test auth system)
- `npm start` - Start development server only

## 📖 Writing LaTeX Notes

### Best Practices
1. **One topic per file**: Keep files focused
2. **Clear sections**: Use `\section{}`, `\subsection{}`
3. **Code examples**: Include `[language=...]` for syntax highlighting
4. **Math notation**: Use standard LaTeX math environments
5. **Descriptive titles**: Use meaningful `\title{}`

### Supported LaTeX Elements
- Document structure (`\section`, `\subsection`)
- Math environments (`equation`, `align`, inline math)
- Code listings (`lstlisting` with language support)
- Text formatting (`\textbf`, `\textit`, `\emph`)
- Lists (`itemize`, `enumerate`)
- Tables (`tabular`)

## 🚀 Deployment

### GitHub Actions (Automated)

The repository includes GitHub Actions workflows for automatic deployment:

#### Main Deployment (`deploy.yml`)
- **Triggers**: Push to `main` branch
- **Process**: 
  1. Install Pandoc
  2. Convert all `.tex` files to `.md`
  3. Commit converted files
  4. Build Docusaurus site
  5. Deploy to GitHub Pages

#### Pull Request Testing (`deploy.yml`)
- **Triggers**: Pull requests to `main`
- **Process**: Test LaTeX conversion and build without deploying

#### Manual Development Build (`dev.yml`)
- **Triggers**: Manual dispatch or daily schedule
- **Process**: Test conversion and build, generate report

### Setup GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

2. **Update Configuration**:
   ```typescript
   // In docusaurus.config.ts
   url: 'https://your-username.github.io',
   baseUrl: '/your-repo-name/',
   organizationName: 'your-username',
   projectName: 'your-repo-name',
   ```

3. **Push to main branch** - deployment happens automatically!

### Manual Deployment

The site builds to static files in the `build/` directory and can be deployed to:
- GitHub Pages (recommended with Actions)
- Netlify
- Vercel  
- Any static hosting service

## 🔄 Workflow

### Local Development
1. **Write** notes in LaTeX (`.tex` files)
2. **Convert** with `npm run convert-latex`
3. **Preview** with `npm run dev`
4. **Update** sidebar in `sidebars.ts`
5. **Build** with `npm run build`
6. **Deploy** the `build/` directory

### GitHub Actions (Automated)
1. **Write** LaTeX files and push to repository
2. **GitHub Actions automatically**:
   - Converts `.tex` → `.md` using Pandoc
   - Commits converted files
   - Builds Docusaurus site
   - Deploys to GitHub Pages
3. **Your site is live!** 🎉

### Workflow Files
- `.github/workflows/deploy.yml` - Main deployment workflow
- `.github/workflows/dev.yml` - Development/testing workflow
- `scripts/tex-to-md.sh` - LaTeX conversion script

Your LaTeX notes are now web-ready! 📚✨