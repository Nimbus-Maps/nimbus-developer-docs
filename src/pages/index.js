import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHero() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <h1>Nimbus Developer Docs</h1>
        <p>
          Build with Nimbus APIs for UK property intelligence, document
          purchasing and agent integrations.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/guides/property-search/overview">
            Golden record
          </Link>
          <Link className="button button--secondary button--lg" to="/guides/document-purchase/overview">
            Document purchasing
          </Link>
          <Link className="button button--secondary button--lg" to="/api">
            API reference
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Property Search API',
    description:
      'Search UK property titles using structured queries or natural language. Filter by location, tenure, area, owner type, and more.',
    guide: '/guides/property-search/overview',
    reference: '/api/property-search/',
  },
  {
    title: 'Document Purchasing API',
    description:
      'Check availability, purchase HMLR documents, receive webhook delivery events, and download completed files.',
    guide: '/guides/document-purchase/overview',
    reference: '/api/document-purchase/',
  },
  {
    title: 'Shared Concepts',
    description:
      'Use common guidance for authentication, errors, rate limits, and production integration behaviour across Nimbus APIs.',
    guide: '/guides/shared/authentication',
    reference: '/guides/shared/errors',
  },
  {
    title: 'Nimbus MCP Server',
    description:
      'Connect Claude, ChatGPT or other AI assistants to Nimbus propery data.',
    guide: '/guides/mcp/nimbus-mcp-server',
    reference: '/guides/mcp/nimbus-mcp-server',
  },
];

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <h2 style={{textAlign: 'center'}}>Choose an integration</h2>
        <div className={styles.featureGrid}>
          {features.map(({title, description, guide, reference}) => (
            <div key={title} className={styles.featureCard}>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className={styles.cardActions}>
                <Link className="button button--primary button--sm" to={guide}>
                  Guide
                </Link>
                <Link className="button button--secondary button--sm" to={reference}>
                  Reference
                </Link>
              </div>
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
      description="Nimbus API and integration developer documentation"
    >
      <HomepageHero />
      <main>
        <FeaturesSection />
      </main>
    </Layout>
  );
}
