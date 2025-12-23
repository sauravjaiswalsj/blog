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
        {
          "type": "category",
          "label": "Hashing",
          "collapsible": true,
          "collapsed": true,
          "items": [
            "dsa/Hashing/leetcode14"
          ]
        },
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
        {
          "type": "category",
          "label": "6.120J",
          "collapsible": true,
          "collapsed": true,
          "items": [
            "maths/6.120J/proofs"
          ]
        }
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
