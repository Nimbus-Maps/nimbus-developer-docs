/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guidesSidebar: [
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting Started',
    },
    {
      type: 'doc',
      id: 'quickstart',
      label: 'Quick Reference',
    },
    {
      type: 'doc',
      id: 'api-examples',
      label: 'API Examples',
    },
    {
      type: 'category',
      label: 'Field Reference',
      items: [
        'elasticsearch-schema',
        'comps-elasticsearch-schema',
      ],
    },
  ],
};

module.exports = sidebars;
