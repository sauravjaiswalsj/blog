const fs = require('fs');
const path = require('path');
const { convertLatexToMarkdown } = require('../plugins/latex-loader');

// Function to recursively find all .tex files
function findTexFiles(dir, texFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTexFiles(filePath, texFiles);
    } else if (path.extname(file) === '.tex') {
      texFiles.push(filePath);
    }
  }
  
  return texFiles;
}

// Function to convert a single LaTeX file
function convertTexFile(texPath) {
  console.log(`Converting: ${texPath}`);
  
  try {
    const latexContent = fs.readFileSync(texPath, 'utf8');
    const markdownContent = convertLatexToMarkdown(latexContent, texPath);
    
    // Create output path (replace .tex with .md)
    const outputPath = texPath.replace(/\.tex$/, '.md');
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write converted markdown
    fs.writeFileSync(outputPath, markdownContent);
    console.log(`✓ Converted to: ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    console.error(`✗ Error converting ${texPath}:`, error.message);
    return null;
  }
}

// Main conversion function
function convertAllLatexFiles() {
  const docsDir = path.join(__dirname, '../docs');
  const texFiles = findTexFiles(docsDir);
  
  console.log(`Found ${texFiles.length} LaTeX files to convert:`);
  
  const convertedFiles = [];
  for (const texFile of texFiles) {
    const converted = convertTexFile(texFile);
    if (converted) {
      convertedFiles.push(converted);
    }
  }
  
  console.log(`\n✓ Successfully converted ${convertedFiles.length} files`);
  return convertedFiles;
}

// Run if called directly
if (require.main === module) {
  convertAllLatexFiles();
}

module.exports = {
  convertAllLatexFiles,
  convertTexFile,
  findTexFiles,
};