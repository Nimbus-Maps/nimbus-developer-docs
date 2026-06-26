import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHero() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <h1>Nimbus Property Search API</h1>
        <p>
          Access comprehensive UK property data — titles, planning applications,
          constraints, sales history, comparable deals, and more across England,
          Wales, and Scotland.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/guides/getting-started">
            Get Started
          </Link>
          <Link className="button button--lg" to="/api/" style={{background: 'white', color: '#252E72', fontWeight: 600}}>
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Property Search',
    description:
      'Search UK property titles using structured queries or natural language. Filter by location, tenure, area, owner type, and more.',
  },
  {
    title: 'Comparable Deals',
    description:
      'Access commercial and residential comparable deal data including sales, lettings, investment yields, and brochures.',
  },
  {
    title: 'Rich Property Data',
    description:
      'Retrieve planning applications, environmental constraints, EPC ratings, building heights, lease terms, and sales history per title.',
  },
  {
    title: 'Secure & Scalable',
    description:
      'OAuth 2.0 and subscription key authentication, with rate limiting and query guardrails to ensure consistent performance.',
  },
];

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <h2 style={{textAlign: 'center'}}>What you can build</h2>
        <div className={styles.featureGrid}>
          {features.map(({title, description}) => (
            <div key={title} className={styles.featureCard}>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Nimbus Property Search API developer documentation"
    >
      <HomepageHero />
      <main>
        <FeaturesSection />
      </main>
    </Layout>
  );
}
