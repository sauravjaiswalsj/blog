import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import 'dotenv/config';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Rise Notes',
  tagline: 'Subject-wise Technical Documentation',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://notesj.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Saurav Jaiswal', // Usually your GitHub org/user name.
  projectName: 'notes', // Usually your repo name.

  // Custom fields for runtime configuration using environment variables
  customFields: {
    authPassword: process.env.NOTES_PASSWORD,
    authTitle: process.env.AUTH_TITLE || '🔒 Protected Notes',
    authSubtitle: process.env.AUTH_SUBTITLE || 'Please enter the password to access the notes section.',
    sessionDuration: process.env.SESSION_DURATION || '86400000',
  },

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'ml-blog',
        routeBasePath: 'blog/ml',
        path: './blog/Machine Learning',
        blogTitle: 'Machine Learning',
        blogDescription: 'Machine Learning articles and notes',
        blogSidebarTitle: 'Machine Learning',
        blogSidebarCount: 'ALL',
        showReadingTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        feedOptions: { type: ['rss', 'atom'], xslt: true },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'warn',
        authorsMapPath: '../authors.yml',
        tagsBasePath: 'tags',
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'dsa-blog',
        routeBasePath: 'blog/dsa',
        path: './blog/DSA',
        blogTitle: 'DSA',
        blogDescription: 'Data Structures and Algorithms',
        blogSidebarTitle: 'DSA',
        blogSidebarCount: 'ALL',
        showReadingTime: true,
        feedOptions: { type: ['rss', 'atom'], xslt: true },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'warn',
        authorsMapPath: '../authors.yml',
        tagsBasePath: 'tags',
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'bookmarks-blog',
        routeBasePath: 'blog/bookmarks',
        path: './blog/Bookmarks',
        blogTitle: 'Bookmarks',
        blogDescription: 'Useful bookmarks and resources',
        blogSidebarTitle: 'Bookmarks',
        blogSidebarCount: 'ALL',
        showReadingTime: true,
        feedOptions: { type: ['rss', 'atom'], xslt: true },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'warn',
        authorsMapPath: '../authors.yml',
        tagsBasePath: 'tags',
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'projects-blog',
        routeBasePath: 'blog/projects',
        path: './blog/log-server',
        blogTitle: 'Projects',
        blogDescription: 'Project write-ups and deep dives',
        blogSidebarTitle: 'Projects',
        blogSidebarCount: 'ALL',
        showReadingTime: true,
        feedOptions: { type: ['rss', 'atom'], xslt: true },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'warn',
        authorsMapPath: '../authors.yml',
        tagsBasePath: 'tags',
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'general-blog',
        routeBasePath: 'blog/general',
        path: './blog/general',
        blogTitle: 'General',
        blogDescription: 'General posts',
        blogSidebarTitle: 'General',
        blogSidebarCount: 'ALL',
        showReadingTime: true,
        feedOptions: { type: ['rss', 'atom'], xslt: true },
        onInlineTags: 'ignore',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'warn',
        authorsMapPath: '../authors.yml',
        tagsBasePath: 'tags',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'My Notes',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Notes',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          type: 'dropdown',
          label: 'Categories',
          position: 'left',
          items: [
            { label: '🤖 Machine Learning', to: '/blog/ml' },
            { label: '💡 DSA', to: '/blog/dsa' },
            { label: '📦 Projects', to: '/blog/projects' },
            { label: '🔖 Bookmarks', to: '/blog/bookmarks' },
            { label: '📄 General', to: '/blog/general' },
          ],
        },
        {
          href: 'https://github.com/sauravjaiswalsj/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Linkedin',
              href: 'https://www.linkedin.com/in/sauravjaiswalsj/',
            },
            {
              label: 'Website',
              href: 'https://notesj.vercel.app/',
            },
            {
              label: 'X',
              href: 'https://x.com/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/sauravjaiswalsj/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FyndCare, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
