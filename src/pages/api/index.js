import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

const references = [
  {
    title: 'Property Search API',
    description:
      'Search property titles, comparable deals, addresses, planning data, constraints, ownership, and related UK property intelligence.',
    guide: '/guides/property-search/overview',
    reference: '/api/property-search/',
  },
  {
    title: 'Document Purchase API',
    description:
      'Check availability, purchase documents, receive webhook delivery events, and download completed property documents.',
    guide: '/guides/document-purchase/overview',
    reference: '/api/document-purchase/',
  },
];

export default function ApiIndex() {
  return (
    <Layout
      title="API Reference"
      description="Nimbus API reference documentation"
    >
      <main className="container margin-vert--xl">
        <h1>API Reference</h1>
        <p>Choose an API reference or open the matching guide.</p>
        <div className="row">
          {references.map((item) => (
            <div className="col col--6 margin-bottom--lg" key={item.title}>
              <div className="card">
                <div className="card__body">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
                <div className="card__footer">
                  <Link className="button button--primary margin-right--sm" to={item.reference}>
                    Open Reference
                  </Link>
                  <Link className="button button--secondary" to={item.guide}>
                    Open Guide
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
