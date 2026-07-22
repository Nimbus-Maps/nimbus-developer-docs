/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  developerSidebar: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Property Search API',
      collapsed: false,
      items: [
        'apis/property-search/overview',
        'apis/property-search/getting-started',
        'apis/property-search/quick-reference',
        'apis/property-search/examples',
        {
          type: 'category',
          label: 'Field Reference',
          items: [
            'apis/property-search/fields/titles',
            'apis/property-search/fields/comparable-deals',
          ],
        },
        'apis/property-search/faq',
      ],
    },
    {
      type: 'category',
      label: 'Document Purchasing API',
      collapsed: false,
      items: [
        'apis/document-purchase/overview',
        'apis/document-purchase/getting-started',
        'apis/document-purchase/authentication',
        'apis/document-purchase/quick-reference',
        'apis/document-purchase/webhooks',
        'apis/document-purchase/integration-guide',
        'apis/document-purchase/examples',
        'apis/document-purchase/faq',
      ],
    },
    {
      type: 'category',
      label: 'Shared Concepts',
      items: [
        'shared/authentication',
        'shared/errors',
        'shared/rate-limits',
      ],
    },
    {
      type: 'category',
      label: 'MCP',
      items: [
        'mcp/nimbus-mcp-server/overview',
      ],
    },
  ],
};

module.exports = sidebars;
