// @ts-check

const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nimbus Developer Docs',
  tagline: 'Comprehensive UK property data API',
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
            id: 'nimbus-search-api',
            spec: './openapi.yaml',
            route: '/api/',
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
            to: '/guides/getting-started',
            label: 'Guides',
            position: 'left',
          },
          {
            to: '/api/',
            label: 'API Reference',
            position: 'left',
          },
          {
            to: '/guides/faq',
            label: 'FAQ',
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
              {label: 'Getting Started', to: '/guides/getting-started'},
              {label: 'Quick Reference', to: '/guides/quickstart'},
              {label: 'API Examples', to: '/guides/api-examples'},
              {label: 'Field Reference', to: '/guides/elasticsearch-schema'},
              {label: 'FAQ', to: '/guides/faq'},
            ],
          },
          {
            title: 'API',
            items: [
              {label: 'API Reference', to: '/api/'},
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
