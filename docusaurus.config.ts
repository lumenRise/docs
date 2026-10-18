import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Launchpad',
  tagline: 'Asset launches and reputation on Stellar.',
  favicon: 'img/launchpad.svg',
  // Set SITE_URL to the public documentation origin before publishing.
  url: process.env.SITE_URL || 'http://localhost:3000',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},
  future: {v4: true},
  i18n: {defaultLocale: 'en', locales: ['en']},
  presets: [
    ['classic', {
      docs: {
        routeBasePath: '/',
        sidebarPath: './sidebars.ts',
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
      blog: false,
      theme: {customCss: './src/css/custom.css'},
      sitemap: process.env.SITE_URL ? {changefreq: 'weekly'} : false,
    } satisfies Preset.Options],
  ],
  themes: [[require.resolve('@easyops-cn/docusaurus-search-local'), {
    hashed: true,
    docsRouteBasePath: '/',
    indexBlog: false,
    highlightSearchTermsOnTargetPage: true,
    explicitSearchResultPath: true,
    searchBarShortcutHint: true,
  }]],
  themeConfig: {
    metadata: [{name: 'description', content: 'Learn how Launchpad brings bonding curves, auctions, presales, and reusable reputation to Stellar.'}],
    colorMode: {defaultMode: 'light', disableSwitch: true, respectPrefersColorScheme: false},
    navbar: {
      title: 'Launchpad',
      logo: {alt: 'Launchpad', src: 'img/launchpad.svg', width: 26, height: 26},
      items: [
        {to: '/', label: 'Documentation', position: 'left', activeBaseRegex: '^/$|^/getting-started'},
        {to: '/launches/overview', label: 'Launches', position: 'left'},
        {to: '/reputation/overview', label: 'Reputation', position: 'left'},
        {to: '/developers/overview', label: 'Developers', position: 'left'},
        {to: '/deployments/overview', label: 'Deployments', position: 'right'},
      ],
    },
    docs: {sidebar: {hideable: false, autoCollapseCategories: true}},
    footer: {
      style: 'light',
      links: [
        {title: 'Launchpad', items: [{label: 'Create a launch', to: '/creators/create-launch'}, {label: 'Participate', to: '/participants/getting-started'}]},
        {title: 'Reputation', items: [{label: 'How scores work', to: '/reputation/scoring'}, {label: 'Custom criteria', to: '/reputation/criteria'}]},
        {title: 'Resources', items: [{label: 'Implementation status', to: '/getting-started/status'}, {label: 'Testnet & Mainnet', to: '/deployments/overview'}, {label: 'Documentation for agents', href: 'pathname:///llms.txt'}]},
      ],
      copyright: `© ${new Date().getFullYear()} Launchpad. Asset launches and reputation on Stellar.`,
    },
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
    prism: {theme: prismThemes.github, darkTheme: prismThemes.github, additionalLanguages: ['rust', 'bash', 'json']},
  } satisfies Preset.ThemeConfig,
};

export default config;
