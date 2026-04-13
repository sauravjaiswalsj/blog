import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './blog.module.css';

type Category = {
  title: string;
  description: string;
  emoji: string;
  to: string;
  accent: string;
  tag: string;
};

const CATEGORIES: Category[] = [
  {
    title: 'Machine Learning',
    description:
      'Algorithms, mathematics, neural networks, and deep learning — from fundamentals to state-of-the-art.',
    emoji: '🤖',
    to: '/blog/ml',
    accent: '#6366f1',
    tag: 'AI & ML',
  },
  {
    title: 'DSA',
    description:
      'Data Structures and Algorithms — patterns, problem breakdowns, and competitive programming insights.',
    emoji: '💡',
    to: '/blog/dsa',
    accent: '#f59e0b',
    tag: 'Computer Science',
  },
  {
    title: 'Projects',
    description:
      'Deep dives into real systems — distributed databases, backend architecture, and engineering decisions.',
    emoji: '⚙️',
    to: '/blog/projects',
    accent: '#10b981',
    tag: 'Engineering',
  },
  {
    title: 'Bookmarks',
    description:
      'Curated links, papers, tools, and resources — things worth bookmarking and coming back to.',
    emoji: '🔖',
    to: '/blog/bookmarks',
    accent: '#ec4899',
    tag: 'Resources',
  },
  {
    title: 'General',
    description:
      'Thoughts, experiments, and miscellaneous writing that doesn\'t fit neatly into a box.',
    emoji: '📄',
    to: '/blog/general',
    accent: '#8b5cf6',
    tag: 'Misc',
  },
];

function CategoryCard({ title, description, emoji, to, accent, tag }: Category): ReactNode {
  return (
    <Link to={to} className={styles.card} style={{ '--accent': accent } as React.CSSProperties}>
      <div className={styles.cardAccentBar} />
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <span className={styles.cardEmoji}>{emoji}</span>
          <span className={styles.cardTag}>{tag}</span>
        </div>
        <Heading as="h2" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardDescription}>{description}</p>
        <span className={styles.cardCta}>
          Browse posts
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function BlogIndex(): ReactNode {
  return (
    <Layout
      title="Blog"
      description="Browse all blog categories — Machine Learning, DSA, Projects, Bookmarks, and more."
    >
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>✍️ Writing</div>
          <Heading as="h1" className={styles.heroTitle}>
            Blog
          </Heading>
          <p className={styles.heroSubtitle}>
            Notes, projects, and things worth writing down.
            <br />
            Pick a category to dive in.
          </p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.to} {...cat} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
