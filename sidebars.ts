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
      "label": "Java Programming",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "java/Spring"
      ]
    },
    {
      "type": "category",
      "label": "System Design",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "systems/LogStore",
        "systems/overview"
      ]
    },
    {
      "type": "category",
      "label": "OS Storage",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "OS-Storage/Page-cache",
        "OS-Storage/Replication"
      ]
    },
    {
      "type": "category",
      "label": "Projects",
      "collapsible": true,
      "collapsed": false,
      "items": [
        {
          "type": "category",
          "label": "LogStores",
          "collapsible": true,
          "collapsed": true,
          "items": [
            "Projects/LogStores/Background",
            "Projects/LogStores/Design",
            "Projects/LogStores/Log",
            "Projects/LogStores/LogStore",
            "Projects/LogStores/Revisit",
            "Projects/LogStores/Work"
          ]
        }
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
