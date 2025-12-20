const fs = require('fs');
const path = require('path');

// Robust LaTeX to Markdown converter
function convertLatexToMarkdown(latexContent, filePath) {
  let markdown = latexContent;
  
  // Extract title from LaTeX
  const titleMatch = markdown.match(/\\title\{([^}]+)\}/);
  const title = titleMatch ? titleMatch[1].replace(/\\textbf\{([^}]+)\}/, '$1').replace(/\\\\/g, ' ') : path.basename(filePath, '.tex');
  
  // Remove LaTeX document structure
  markdown = markdown.replace(/\\documentclass.*?\n/, '');
  markdown = markdown.replace(/\\usepackage.*?\n/g, '');
  markdown = markdown.replace(/\\begin\{document\}/, '');
  markdown = markdown.replace(/\\end\{document\}/, '');
  markdown = markdown.replace(/\\maketitle/, '');
  markdown = markdown.replace(/\\thispagestyle\{empty\}/, '');
  markdown = markdown.replace(/\\author\{.*?\}/, '');
  markdown = markdown.replace(/\\date\{.*?\}/, '');
  markdown = markdown.replace(/\\title\{.*?\}/, '');
  
  // Remove LaTeX comments and problematic constructs
  markdown = markdown.replace(/^%.*$/gm, '');
  markdown = markdown.replace(/\\usepackage.*$/gm, '');
  
  // Convert sections FIRST (before other replacements)
  markdown = markdown.replace(/\\section\*?\{([^}]+)\}/g, '## $1');
  markdown = markdown.replace(/\\subsection\*?\{([^}]+)\}/g, '### $1');
  markdown = markdown.replace(/\\subsubsection\*?\{([^}]+)\}/g, '#### $1');
  markdown = markdown.replace(/\\subparagraph\{([^}]+)\}/g, '##### $1');
  
  // Handle display math BEFORE inline math
  markdown = markdown.replace(/\\\[([\s\S]*?)\\\]/g, (match, content) => {
    return `$$${content.trim()}$$`;
  });
  
  // Handle math environments
  markdown = markdown.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (match, content) => {
    return `$$${content.trim()}$$`;
  });
  
  markdown = markdown.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (match, content) => {
    return `$$${content.trim()}$$`;
  });
  
  // Handle problematic constructs that break MDX
  markdown = markdown.replace(/\{\s*\\Large\s*([\s\S]*?)\}/g, '$1');
  markdown = markdown.replace(/\\Large/g, '');
  
  // Convert text formatting
  markdown = markdown.replace(/\\textbf\{([^}]+)\}/g, '**$1**');
  markdown = markdown.replace(/\\textit\{([^}]+)\}/g, '*$1*');
  markdown = markdown.replace(/\\emph\{([^}]+)\}/g, '*$1*');
  markdown = markdown.replace(/\\text\{([^}]+)\}/g, '$1');
  
  // Convert lists
  markdown = markdown.replace(/\\begin\{itemize\}/g, '');
  markdown = markdown.replace(/\\end\{itemize\}/g, '');
  markdown = markdown.replace(/\\begin\{enumerate\}/g, '');
  markdown = markdown.replace(/\\end\{enumerate\}/g, '');
  markdown = markdown.replace(/\\item\s*/g, '- ');
  
  // Convert code listings with better handling
  markdown = markdown.replace(/\\begin\{lstlisting\}\[style=python\]([\s\S]*?)\\end\{lstlisting\}/g, (match, code) => {
    return `\`\`\`python${code}\`\`\``;
  });
  
  markdown = markdown.replace(/\\begin\{lstlisting\}\[language=([^\]]+)\]([\s\S]*?)\\end\{lstlisting\}/g, (match, lang, code) => {
    return `\`\`\`${lang.toLowerCase()}${code}\`\`\``;
  });
  
  markdown = markdown.replace(/\\begin\{lstlisting\}([\s\S]*?)\\end\{lstlisting\}/g, (match, code) => {
    return `\`\`\`${code}\`\`\``;
  });
  
  // Convert tables
  markdown = markdown.replace(/\\begin\{table\}\[.*?\]/g, '');
  markdown = markdown.replace(/\\end\{table\}/g, '');
  markdown = markdown.replace(/\\centering/g, '');
  markdown = markdown.replace(/\\caption\{([^}]+)\}/g, '\n*$1*\n');
  markdown = markdown.replace(/\\label\{[^}]+\}/g, '');
  
  // Convert tabular environment
  markdown = markdown.replace(/\\begin\{tabular\}\{[^}]+\}/g, '');
  markdown = markdown.replace(/\\end\{tabular\}/g, '');
  markdown = markdown.replace(/\\hline/g, '');
  markdown = markdown.replace(/\\toprule|\\midrule|\\bottomrule/g, '');
  
  // Clean up other LaTeX commands
  markdown = markdown.replace(/\\boxed\{([^}]+)\}/g, '**$1**');
  markdown = markdown.replace(/\\boldmath/g, '');
  
  // Remove theorem environments but keep content
  markdown = markdown.replace(/\\begin\{theorem\}/g, '**Theorem:**');
  markdown = markdown.replace(/\\end\{theorem\}/g, '');
  markdown = markdown.replace(/\\begin\{proof\}/g, '**Proof:**');
  markdown = markdown.replace(/\\end\{proof\}/g, '');
  
  // Clean up remaining curly braces that aren't part of math
  // Be very careful here - only remove braces that are clearly not math
  markdown = markdown.replace(/([^$])\{([^${}]*)\}([^$])/g, '$1$2$3');
  
  // Fix table formatting
  markdown = markdown.replace(/\s*&\s*/g, ' | ');
  markdown = markdown.replace(/\s*\\\\\s*/g, ' |\n');
  
  // Clean up spacing
  markdown = markdown.replace(/\n\s*\n\s*\n+/g, '\n\n');
  markdown = markdown.replace(/^\s+/gm, '');
  markdown = markdown.replace(/\s+$/gm, '');
  
  // Add frontmatter
  const cleanTitle = title.replace(/[{}\\]/g, '').trim();
  const frontmatter = `---
title: "${cleanTitle}"
description: "Algorithm analysis and complexity theory"
---

# ${cleanTitle}

`;
  
  return frontmatter + markdown.trim();
}

function latexLoaderPlugin(context, options) {
  return {
    name: 'latex-loader-plugin',
    configureWebpack(config, isServer, utils) {
      return {
        module: {
          rules: [
            {
              test: /\.tex$/,
              use: [
                {
                  loader: 'raw-loader',
                },
              ],
            },
          ],
        },
      };
    },
    async contentLoaded({content, actions}) {
      // This will be called during the build process
    },
  };
}

module.exports = {
  latexLoaderPlugin,
  convertLatexToMarkdown,
};