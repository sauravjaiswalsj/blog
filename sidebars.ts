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
          "label": "Binary Search",
          "collapsible": true,
          "collapsed": true,
          "items": [
            "dsa/Binary-Search/BS1",
            "dsa/Binary-Search/LowerBound-UpperBound"
          ]
        },
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
        "dsa/Patterns",
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
            "maths/6.120J/proofs",
            "maths/6.120J/Set"
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
        "java/Spring",
        "java/Streams"
      ]
    },
    {
      "type": "category",
      "label": "System Design",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "systems/Latency vs Throughput",
        "systems/LogStore",
        "systems/overview"
      ]
    },
    {
      "type": "category",
      "label": "ML",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "ML/LossFunction",
        "ML/ML-Algo",
        "ML/ML"
      ]
    },
    {
      "type": "category",
      "label": "OS Storage",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "OS-Storage/Fsync",
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
      "label": "Quant",
      "collapsible": true,
      "collapsed": false,
      "items": [
        "Quant/month2",
        "Quant/Roadmap"
      ]
    },
    {
      "type": "category",
      "label": "Warwick",
      "collapsible": true,
      "collapsed": false,
      "items": [
        {
          "type": "category",
          "label": "DA CS910",
          "collapsible": true,
          "collapsed": true,
          "items": [
            {
              "type": "category",
              "label": "Project",
              "collapsible": true,
              "collapsed": true,
              "items": [
                "Warwick/DA-CS910/Project/chap-1",
                "Warwick/DA-CS910/Project/learning"
              ]
            },
            "Warwick/DA-CS910/Slide1",
            "Warwick/DA-CS910/Slide2"
          ]
        },
        {
          "type": "category",
          "label": "HPC",
          "collapsible": true,
          "collapsed": true,
          "items": [
            "Warwick/HPC/Into",
            "Warwick/HPC/notes1"
          ]
        },
        {
          "type": "category",
          "label": "ML",
          "collapsible": true,
          "collapsed": true,
          "items": [
            "Warwick/ML/Lec2",
            "Warwick/ML/Slide1"
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
        "prompts/Learning",
        "prompts/sidebar-generation-prompt",
        "prompts/tex-to-markdown-prompt"
      ]
    }
  ]
};

export default sidebars;
