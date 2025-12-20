const fs = require('fs');
const path = require('path');
const { convertTexFile } = require('./convert-latex');

// Simple file watcher for LaTeX files
function watchLatexFiles() {
  const docsDir = path.join(__dirname, '../docs');
  
  console.log('👀 Watching for LaTeX file changes...');
  console.log('Press Ctrl+C to stop watching\n');
  
  // Recursive function to watch directories
  function watchDirectory(dir) {
    try {
      const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.tex')) {
          const fullPath = path.join(dir, filename);
          
          if (eventType === 'change' && fs.existsSync(fullPath)) {
            console.log(`📝 LaTeX file changed: ${filename}`);
            convertTexFile(fullPath);
          }
        }
      });
      
      return watcher;
    } catch (error) {
      console.error(`Error watching directory ${dir}:`, error.message);
    }
  }
  
  const watcher = watchDirectory(docsDir);
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping LaTeX file watcher...');
    if (watcher) {
      watcher.close();
    }
    process.exit(0);
  });
}

// Run if called directly
if (require.main === module) {
  watchLatexFiles();
}

module.exports = { watchLatexFiles };