#!/bin/bash

# Enhanced LaTeX to Markdown conversion using Pandoc
# This script preprocesses LaTeX files to remove preamble and then converts

echo "🔄 Converting LaTeX files to Markdown using Pandoc..."

# Function to preprocess LaTeX file
preprocess_latex() {
    local input_file="$1"
    local temp_file=$(mktemp)
    
    # Extract content between \begin{document} and \end{document}
    sed -n '/\\begin{document}/,/\\end{document}/p' "$input_file" | \
    sed '1d;$d' > "$temp_file"
    
    echo "$temp_file"
}

# Function to post-process Markdown
postprocess_markdown() {
    local file="$1"
    local title="$2"
    
    # Create proper frontmatter and clean up
    cat > "$file.tmp" << EOF
---
title: "$title"
description: "Algorithm analysis and complexity theory"
---

# $title

EOF
    
    # Add the converted content, skipping any remaining LaTeX commands at the start
    sed '/^\\[a-zA-Z]/d' "$file" >> "$file.tmp"
    mv "$file.tmp" "$file"
}

# Find all .tex files and convert them
find docs -name "*.tex" | while read f; do
    # Generate output path
    out="${f%.tex}.md"
    
    echo "📝 Converting: $f -> $out"
    
    # Extract title from LaTeX file
    title=$(grep -o '\\title{[^}]*}' "$f" | sed 's/\\title{\(.*\)}/\1/' | sed 's/\\textbf{\(.*\)}/\1/')
    if [ -z "$title" ]; then
        title=$(basename "$f" .tex)
    fi
    
    # Preprocess LaTeX file
    temp_latex=$(preprocess_latex "$f")
    
    # Convert with Pandoc
    pandoc "$temp_latex" \
        --from latex \
        --to markdown \
        --mathjax \
        --wrap=none \
        --output "$out"
    
    if [ $? -eq 0 ]; then
        # Post-process the markdown
        postprocess_markdown "$out" "$title"
        echo "✅ Successfully converted: $out"
    else
        echo "❌ Failed to convert: $f"
    fi
    
    # Clean up temp file
    rm -f "$temp_latex"
done

echo "🎉 Conversion complete!"