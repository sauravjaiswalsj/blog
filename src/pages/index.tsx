import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const EXPERIENCE = [
  { company: 'Commonwealth Bank', role: 'Software Engineer', period: '2024 – 2025', detail: 'Worked in the Retail division to build various AI and insurance applications.' },
  { company: 'DataCore Software', role: 'Software Development Engineer II', period: '2021 – 2024', detail: 'Worked on Petabyte-scale storage & distributed systems.' },
  { company: 'WorldQuant', role: 'Research Consultant', period: '2025 – Present', detail: 'Working on building quantitative models for financial markets.' },
];

const TOPICS = [
  { emoji: '🤖', label: 'Machine Learning', to: '/blog/ml' },
  { emoji: '💡', label: 'DSA', to: '/blog/dsa' },
  { emoji: '⚙️', label: 'Distributed Systems', to: '/blog/projects' },
  { emoji: '📐', label: 'HPC & AI', to: '/blog/ml' },
  { emoji: '☕', label: 'Java', to: '/blog/projects' },
  { emoji: '🔖', label: 'Resources', to: '/blog/bookmarks' },
];

const STACK = ['Java', 'Python', 'TypeScript', 'React', 'Node.js', 'C++', 'MongoDB', 'MySQL'];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Notes, blogs and technical writing by Saurav Jaiswal — ML, DSA, Distributed Systems and more."
    >
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            MSc Computer Science · University of Warwick
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>
            Software Alchemist · 5+ yrs in Distributed Systems & AI
          </p>
          <p className={styles.heroBody}>
            Notes, projects, and technical writing on Machine Learning,
            algorithms, and building systems that scale.
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
            <Link className={styles.ctaGhost} to="https://sauravjaiswalsj.vercel.app/">
              Portfolio ↗
            </Link>
            <Link className={styles.ctaGhost} to="/tracker">
              Tracker ↗
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Experience ── */}
        <section className={styles.expSection}>
          <p className={styles.expLabel}>Experience</p>
          <div className={styles.expGrid}>
            {EXPERIENCE.map(({ company, role, period, detail }) => (
              <div key={company} className={styles.expCard}>
                <span className={styles.expCompany}>{company}</span>
                <span className={styles.expRole}>{role}</span>
                {period && <span className={styles.expPeriod}>{period}</span>}
                <span className={styles.expDetail}>{detail}</span>
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

        {/* ── Stack ── */}
        <section className={styles.stackSection}>
          <p className={styles.expLabel}>Tech Stack</p>
          <div className={styles.stackGrid}>
            {STACK.map((tech) => (
              <span key={tech} className={styles.stackBadge}>{tech}</span>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <span className={styles.ctaCardEmoji}>👋</span>
            <Heading as="h2" className={styles.ctaCardTitle}>Let's connect</Heading>
            <p className={styles.ctaCardText}>
              I'm open to research engineering and technical leadership roles in London.
            </p>
            <div className={styles.socialLinks}>
              <Link className={styles.socialLink} to="https://linkedin.com/in/sauravjaiswalsj/">LinkedIn</Link>
              <Link className={styles.socialLink} to="https://github.com/sauravjaiswalsj/">GitHub</Link>
              <Link className={styles.socialLink} to="https://sauravjaiswalsj.vercel.app/">Portfolio</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
