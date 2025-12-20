#!/bin/bash

# Enhanced LaTeX to Markdown conversion using Pandoc
# Also regenerates sidebar automatically

echo "🔄 Converting LaTeX files to Markdown using Pandoc..."

# Create docs directory if it doesn't exist
mkdir -p docs

# Find all .tex files in docs directory and convert them
find docs -name "*.tex" | while read f; do
    # Generate output path (replace .tex with .md)
    out="${f%.tex}.md"
    
    echo "📝 Converting: $f -> $out"
    
    # Use pandoc to convert LaTeX to Markdown
    # --mathjax: Use MathJax for math rendering (compatible with Docusaurus)
    # --wrap=none: Don't wrap lines
    # --standalone: Include document metadata
    pandoc "$f" \
        --from latex \
        --to markdown \
        --mathjax \
        --wrap=none \
        --standalone \
        --output "$out"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully converted: $out"
    else
        echo "❌ Failed to convert: $f"
    fi
done

echo "🎉 LaTeX conversion complete!"

# Regenerate sidebar if Node.js is available
if command -v node &> /dev/null; then
    echo "🔄 Regenerating sidebar..."
    node scripts/generate-sidebar.js
else
    echo "⚠️  Node.js not found - skipping sidebar generation"
fi