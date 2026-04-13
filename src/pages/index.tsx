import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const STATS = [
  { value: '5+', label: 'Project Deep Dives' },
  { value: '10+', label: 'Tech Notes' },
  { value: 'MSc', label: 'CS @ Warwick' },
  { value: '∞', label: 'Things to Learn' },
];

const TOPICS = [
  { emoji: '🤖', label: 'Machine Learning', to: '/blog/ml' },
  { emoji: '💡', label: 'DSA', to: '/blog/dsa' },
  { emoji: '⚙️', label: 'Systems', to: '/blog/projects' },
  { emoji: '📐', label: 'Math', to: '/blog/ml' },
  { emoji: '☕', label: 'Java', to: '/blog/projects' },
  { emoji: '🔖', label: 'Resources', to: '/blog/bookmarks' },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Personal notes, blog, and technical writing by Saurav Jaiswal — ML, DSA, Systems and more."
    >
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Open to work · Software Engineer
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroBody}>
            Notes, projects, and technical writing from an MSc CS student at Warwick.
            <br />
            I write about ML, distributed systems, algorithms, and everything in between.
          </p>
          <div className={styles.ctaGroup}>
            <Link className={styles.ctaPrimary} to="/docs/intro">
              Explore Notes
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link className={styles.ctaSecondary} to="/blog">
              Read Blog
            </Link>
            <Link className={styles.ctaGhost} to="https://github.com/sauravjaiswalsj/">
              GitHub ↗
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Stats ── */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {STATS.map(({ value, label }) => (
              <div key={label} className={styles.statCard}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Topics ── */}
        <section className={styles.topicsSection}>
          <div className={styles.sectionHeader}>
            <Heading as="h2" className={styles.sectionTitle}>What I write about</Heading>
            <p className={styles.sectionSubtitle}>Pick a topic and dive in</p>
          </div>
          <div className={styles.topicsGrid}>
            {TOPICS.map(({ emoji, label, to }) => (
              <Link key={label} to={to} className={styles.topicChip}>
                <span>{emoji}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA section ── */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <span className={styles.ctaCardEmoji}>📬</span>
            <Heading as="h2" className={styles.ctaCardTitle}>Find me on the internet</Heading>
            <p className={styles.ctaCardText}>
              I share notes, projects and occasional thoughts across the web.
            </p>
            <div className={styles.socialLinks}>
              <Link className={styles.socialLink} to="https://linkedin.com/in/sauravjaiswalsj/">LinkedIn</Link>
              <Link className={styles.socialLink} to="https://github.com/sauravjaiswalsj/">GitHub</Link>
              <Link className={styles.socialLink} to="https://x.com/">X / Twitter</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
