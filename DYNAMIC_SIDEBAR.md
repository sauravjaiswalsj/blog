# Dynamic Sidebar System

## 🎯 Overview

The LaTeX Notes system now features a **fully automatic sidebar generation** that dynamically organizes your documentation based on the file structure. No more manual editing of `sidebars.ts`!

## ✨ Features

### 🔄 **Automatic Detection**
- **Subject Directories**: Automatically detects subject folders in `docs/`
- **File Organization**: Sorts files alphabetically within each subject
- **Nested Structure**: Supports subdirectories within subjects
- **Smart Filtering**: Only includes `.md` files, excludes `intro.md`

### 🏷️ **Smart Labeling**
- **Predefined Labels**: Common subjects get professional names
- **Auto-Formatting**: Unknown directories get formatted titles
- **Consistent Ordering**: Subjects appear in logical order

### 🧹 **Cache Management**
- **Auto-Clear**: Clears Docusaurus cache when regenerating
- **Prevents Errors**: Eliminates stale file references
- **Clean Builds**: Ensures fresh compilation

## 📋 Subject Mapping

| Directory | Display Name | Order |
|-----------|--------------|-------|
| `dsa/` | DSA (Data Structures & Algorithms) | 1 |
| `mathematics/` or `maths/` | Mathematics | 2 |
| `java/` | Java Programming | 3 |
| `algorithms/` | Algorithm Analysis | 4 |
| `systems/` or `system-design/` | System Design | 5 |
| `prompts/` | Documentation Prompts | 99 |
| Any other | Formatted Title | 50 |

## 🛠 Commands

### Generate Sidebar
```bash
npm run generate-sidebar
```
- Scans `docs/` directory
- Generates `sidebars.ts`
- Clears Docusaurus cache
- Shows structure summary

### Watch Mode
```bash
npm run watch-sidebar
```
- Monitors file changes
- Auto-regenerates on add/remove/rename
- Real-time updates

### Integrated Workflow
```bash
npm run dev          # Convert LaTeX + Generate sidebar + Start dev
npm run build        # Convert LaTeX + Generate sidebar + Build
npm run clean-build  # Clear cache + Full build
```

## 📁 File Structure Example

```
docs/
├── intro.md                    # Homepage (excluded from categories)
├── dsa/                        # → "DSA (Data Structures & Algorithms)"
│   ├── arrays.md
│   ├── trees.md
│   └── graphs.md
├── mathematics/                # → "Mathematics"
│   ├── calculus.md
│   └── linear-algebra.md
├── java/                       # → "Java Programming"
│   ├── oop-basics.md
│   └── collections.md
└── machine-learning/           # → "Machine Learning" (auto-formatted)
    ├── intro.md
    └── algorithms.md
```

## 🔄 Generated Sidebar Structure

```typescript
const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'DSA (Data Structures & Algorithms)',
      collapsible: true,
      collapsed: false,
      items: ['dsa/arrays', 'dsa/graphs', 'dsa/trees']
    },
    {
      type: 'category', 
      label: 'Mathematics',
      collapsible: true,
      collapsed: false,
      items: ['mathematics/calculus', 'mathematics/linear-algebra']
    },
    // ... more categories
  ]
};
```

## 🎮 Usage Workflow

### Adding New Notes
1. **Create directory**: `docs/new-subject/`
2. **Add files**: `docs/new-subject/topic.md`
3. **Auto-update**: Sidebar regenerates automatically on build

### Removing Notes
1. **Delete files/directories**: Remove from `docs/`
2. **Auto-cleanup**: Sidebar removes references automatically
3. **Cache cleared**: No stale references remain

### Renaming/Moving
1. **Move files**: Use file manager or git
2. **Regenerate**: Run `npm run generate-sidebar`
3. **Updated**: Sidebar reflects new structure

## 🔧 Configuration

### Custom Subject Labels
Edit `scripts/generate-sidebar.js`:

```javascript
const SUBJECT_CONFIG = {
  'your-subject': {
    label: 'Your Custom Label',
    order: 10,
    collapsed: false
  }
};
```

### Exclude Directories
Add to the scanning function to skip certain directories:

```javascript
if (entry.name === 'excluded-dir') continue;
```

## 🚀 GitHub Actions Integration

The dynamic sidebar works seamlessly with GitHub Actions:

1. **Push LaTeX files** to repository
2. **Actions convert** `.tex` → `.md`
3. **Sidebar regenerates** automatically
4. **Site deploys** with updated navigation

## ⚡ Performance

- **Fast Scanning**: Efficient directory traversal
- **Smart Caching**: Only regenerates when needed
- **Minimal Overhead**: Lightweight file operations
- **Build Integration**: Seamless workflow integration

## 🐛 Troubleshooting

### Stale References Error
```bash
npm run clear
npm run generate-sidebar
npm run build
```

### Missing Files in Sidebar
- Check file extensions (must be `.md`)
- Ensure files are in `docs/` subdirectories
- Run `npm run generate-sidebar` manually

### Cache Issues
- The system auto-clears cache
- For manual clearing: `npm run clear`
- Use `npm run clean-build` for full reset

## 🎉 Benefits

- ✅ **Zero Manual Work**: No more editing `sidebars.ts`
- ✅ **Always Accurate**: Sidebar matches actual files
- ✅ **Error Prevention**: No broken links or stale references
- ✅ **Scalable**: Handles any number of subjects/files
- ✅ **Flexible**: Easy to customize and extend
- ✅ **Automated**: Works with CI/CD pipelines

Your sidebar now updates itself! Just focus on writing great LaTeX notes. 🚀