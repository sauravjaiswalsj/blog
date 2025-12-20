const fs = require('fs');
const path = require('path');

// Configuration for subject display names and ordering
const SUBJECT_CONFIG = {
  'dsa': {
    label: 'DSA (Data Structures & Algorithms)',
    order: 1,
    collapsed: false
  },
  'mathematics': {
    label: 'Mathematics',
    order: 2,
    collapsed: false
  },
  'maths': {
    label: 'Mathematics',
    order: 2,
    collapsed: false
  },
  'java': {
    label: 'Java Programming',
    order: 3,
    collapsed: false
  },
  'algorithms': {
    label: 'Algorithm Analysis',
    order: 4,
    collapsed: false
  },
  'systems': {
    label: 'System Design',
    order: 5,
    collapsed: false
  },
  'system-design': {
    label: 'System Design',
    order: 5,
    collapsed: false
  },
  'prompts': {
    label: 'Documentation Prompts',
    order: 99,
    collapsed: true
  }
};

// Function to scan directory for markdown files
function scanDirectory(dirPath, basePath = '') {
  const items = [];
  
  if (!fs.existsSync(dirPath)) {
    return items;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Sort entries: directories first, then files alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      const subItems = scanDirectory(fullPath, relativePath);
      if (subItems.length > 0) {
        items.push({
          type: 'category',
          label: formatLabel(entry.name),
          collapsible: true,
          collapsed: true,
          items: subItems
        });
      }
    } else if (entry.name.endsWith('.md') && entry.name !== 'intro.md') {
      // Add markdown files (exclude intro.md as it's handled separately)
      const docId = relativePath.replace(/\.md$/, '');
      items.push(docId);
    }
  }
  
  return items;
}

// Function to format directory names into readable labels
function formatLabel(dirName) {
  return dirName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to generate sidebar configuration
function generateSidebar() {
  const docsPath = path.join(__dirname, '../docs');
  const subjects = {};
  
  // Scan docs directory for subject folders
  const entries = fs.readdirSync(docsPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subjectPath = path.join(docsPath, entry.name);
      const items = scanDirectory(subjectPath, entry.name);
      
      if (items.length > 0) {
        const config = SUBJECT_CONFIG[entry.name] || {
          label: formatLabel(entry.name),
          order: 50,
          collapsed: false
        };
        
        subjects[entry.name] = {
          ...config,
          items: items
        };
      }
    }
  }
  
  // Sort subjects by order
  const sortedSubjects = Object.entries(subjects)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, config]) => ({
      type: 'category',
      label: config.label,
      collapsible: true,
      collapsed: config.collapsed,
      items: config.items
    }));
  
  // Generate the complete sidebar configuration
  const sidebarConfig = {
    docs: [
      'intro',
      ...sortedSubjects
    ]
  };
  
  return sidebarConfig;
}

// Function to write the sidebar file
function writeSidebarFile() {
  const sidebarConfig = generateSidebar();
  
  const sidebarContent = `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-sidebar' to regenerate.

const sidebars: SidebarsConfig = ${JSON.stringify(sidebarConfig, null, 2)};

export default sidebars;
`;
  
  const sidebarPath = path.join(__dirname, '../sidebars.ts');
  fs.writeFileSync(sidebarPath, sidebarContent);
  
  console.log('✅ Sidebar generated successfully!');
  console.log(`📁 Found ${sidebarConfig.docs.length - 1} subject categories`);
  
  // Log the structure
  sidebarConfig.docs.slice(1).forEach(category => {
    console.log(`   📚 ${category.label}: ${category.items.length} items`);
  });
  
  // Clear Docusaurus cache to prevent stale references
  const cacheDir = path.join(__dirname, '../.docusaurus');
  if (fs.existsSync(cacheDir)) {
    console.log('🧹 Clearing Docusaurus cache...');
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Cache cleared successfully');
    } catch (error) {
      console.log('⚠️  Could not clear cache:', error.message);
    }
  }
}

// Function to watch for file changes and regenerate sidebar
function watchFiles() {
  const docsPath = path.join(__dirname, '../docs');
  
  console.log('👀 Watching for file changes...');
  console.log('Press Ctrl+C to stop watching\n');
  
  const watcher = fs.watch(docsPath, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.md') || filename.endsWith('.tex'))) {
      console.log(`📝 File ${eventType}: ${filename}`);
      console.log('🔄 Regenerating sidebar...');
      writeSidebarFile();
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping file watcher...');
    watcher.close();
    process.exit(0);
  });
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'watch') {
    writeSidebarFile(); // Generate initial sidebar
    watchFiles();
  } else {
    writeSidebarFile();
  }
}

module.exports = {
  generateSidebar,
  writeSidebarFile,
  watchFiles
};