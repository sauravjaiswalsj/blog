import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-sidebar' to regenerate.

const sidebars: SidebarsConfig = {
  "docs": [
    "intro",
    {
      "type": "category",
      "label": "DSA (Data Structures & Algorithms)",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "dsa/arrays",
        "dsa/graphs",
        "dsa/trees"
      ]
    },
    {
      "type": "category",
      "label": "Mathematics",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "maths/calculus"
      ]
    },
    {
      "type": "category",
      "label": "System Design",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "systems/overview"
      ]
    },
    {
      "type": "category",
      "label": "Documentation Prompts",
      "collapsible": true,
      "collapsed": true,
      "items": [
        "prompts/architecture-diagram-prompt",
        "prompts/deepwiki-master-prompt",
        "prompts/sidebar-generation-prompt",
        "prompts/tex-to-markdown-prompt"
      ]
    }
  ]
};

export default sidebars;
