// @ts-check

const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nimbus Developer Docs',
  tagline: 'Developer documentation for Nimbus APIs and integrations',
  url: 'https://docs.nimbusmaps.co.uk',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  favicon: 'favicon.svg',

  organizationName: 'Nimbus-Maps',
  projectName: 'nimbus-developer-docs',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'redocusaurus',
      /** @type {import('redocusaurus').PresetEntry} */
      ({
        specs: [
          {
            id: 'property-search-api',
            spec: './openapi/property-search.yaml',
            route: '/api/property-search/',
          },
          {
            id: 'document-purchase-api',
            spec: './openapi/document-purchasing.yaml',
            route: '/api/document-purchase/',
          },
        ],
        theme: {
          primaryColor: '#2e86de',
        },
      }),
    ],
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'guides',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        style: 'dark',
        logo: {
          alt: 'Nimbus Maps',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/guides/',
            label: 'Docs',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'API Reference',
            position: 'left',
            items: [
              {
                to: '/api/property-search/',
                label: 'Property Search API',
              },
              {
                to: '/api/document-purchase/',
                label: 'Document Purchasing API',
              },
            ],
          },
          {
            to: '/guides/mcp/nimbus-mcp-server',
            label: 'MCP',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Guides',
            items: [
              {label: 'Overview', to: '/guides/'},
              {label: 'Property Search', to: '/guides/property-search/overview'},
              {label: 'Document Purchasing', to: '/guides/document-purchase/overview'},
              {label: 'Shared Authentication', to: '/guides/shared/authentication'},
            ],
          },
          {
            title: 'API Reference',
            items: [
              {label: 'All API References', to: '/api/'},
              {label: 'Property Search API', to: '/api/property-search/'},
              {label: 'Document Purchasing API', to: '/api/document-purchase/'},
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'Nimbus Maps', href: 'https://www.nimbusmaps.co.uk'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nimbus Maps.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'http'],
      },
    }),
};

module.exports = config;
