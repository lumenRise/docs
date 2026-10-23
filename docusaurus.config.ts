import type {PrismTheme} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/* Syntax palettes drawn from the LumenRise tonal tokens (info, ok, warn, bad). */
const lumenriseLight: PrismTheme = {
  plain: {color: '#0b0b0b', backgroundColor: '#ffffff'},
  styles: [
    {types: ['comment', 'prolog', 'cdata'], style: {color: '#6a6a6a'}},
    {types: ['punctuation'], style: {color: '#5c5c5c'}},
    {types: ['keyword', 'tag', 'atrule', 'rule', 'important'], style: {color: '#2551bf'}},
    {types: ['string', 'char', 'attr-value', 'regex'], style: {color: '#17744a'}},
    {types: ['number', 'boolean', 'constant', 'symbol', 'unit'], style: {color: '#8f5200'}},
    {types: ['function', 'class-name', 'attr-name', 'selector'], style: {color: '#0b0b0b', fontWeight: '600'}},
    {types: ['operator', 'entity', 'url', 'property'], style: {color: '#5c5c5c'}},
    {types: ['deleted'], style: {color: '#b42318'}},
    {types: ['inserted'], style: {color: '#17744a'}},
  ],
};

const lumenriseDark: PrismTheme = {
  plain: {color: '#f4f4ef', backgroundColor: '#0e0e0d'},
  styles: [
    {types: ['comment', 'prolog', 'cdata'], style: {color: '#999993'}},
    {types: ['punctuation'], style: {color: '#a3a39e'}},
    {types: ['keyword', 'tag', 'atrule', 'rule', 'important'], style: {color: '#8fb0ff'}},
    {types: ['string', 'char', 'attr-value', 'regex'], style: {color: '#5fd39a'}},
    {types: ['number', 'boolean', 'constant', 'symbol', 'unit'], style: {color: '#f2b25c'}},
    {types: ['function', 'class-name', 'attr-name', 'selector'], style: {color: '#f4f4ef', fontWeight: '600'}},
    {types: ['operator', 'entity', 'url', 'property'], style: {color: '#a3a39e'}},
    {types: ['deleted'], style: {color: '#f58f86'}},
    {types: ['inserted'], style: {color: '#5fd39a'}},
  ],
};

const config: Config = {
  title: 'LumenRise',
  tagline: 'Identity, reputation, and launch infrastructure for Stellar.',
  favicon: 'branding/lumenrise-symbol-for-light-background.svg',
  // Set SITE_URL to the public documentation origin before publishing.
  url: process.env.SITE_URL || 'http://localhost:3000',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},
  future: {
    v4: true,
    // v4 enables Rspack by default, but its module graph crashes on Windows.
    // Keep Webpack's development server and hot reload instead.
    faster: {rspackBundler: false, rspackPersistentCache: false},
  },
  i18n: {defaultLocale: 'en', locales: ['en']},
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/inter-latin-variable.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    },
  ],
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
    searchBarPosition: 'left',
  }]],
  themeConfig: {
    metadata: [{name: 'description', content: 'Learn how LumenRise brings bonding curves, auctions, presales, and reusable reputation to Stellar.'}],
    colorMode: {defaultMode: 'light', disableSwitch: false, respectPrefersColorScheme: true},
    navbar: {
      logo: {
        alt: 'LumenRise',
        src: 'branding/lumenrise-logo-horizontal-for-light-background.svg',
        srcDark: 'branding/lumenrise-logo-horizontal-for-dark-background.svg',
        width: 106,
        height: 22,
      },
      items: [
      ],
    },
    docs: {sidebar: {hideable: false, autoCollapseCategories: true}},
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
    prism: {theme: lumenriseLight, darkTheme: lumenriseDark, additionalLanguages: ['rust', 'bash', 'json']},
  } satisfies Preset.ThemeConfig,
};

export default config;
