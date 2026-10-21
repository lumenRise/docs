# Lumen Rise documentation

Docusaurus documentation for Stellar asset launches and reusable reputation. Covers bonding curves, auctions, presales, creator and participant flows, vesting, developer integrations, and network deployment records.

## Run locally

Requires Node.js 20 or later.

```bash
npm ci
npm start
```

The documentation opens at `http://localhost:3000`. Built-in local search uses the production index, so verify search with the production preview below.

The site uses Webpack with hot reload. `docusaurus.config.ts` explicitly disables the Rspack bundler and its disk cache, which `future.v4` otherwise enables. Rspack's module graph crashes on this Windows setup even with its persistent cache disabled.

## Docker

```bash
docker compose up -d --build
```

Node serves the built docs at `http://127.0.0.1:3006`. The container restarts after crashes unless manually stopped. Set `SITE_URL` before building when using a public documentation domain.

## Verify and preview

```bash
npm run typecheck
npm run build
npm test
npm run serve
```

The build checks internal routes and Markdown links, creates the local search index, and regenerates `static/llms.txt` and `static/llms-full.txt`. The output is in `build/`. Run `npm run docs:export` to refresh the text exports without building.

## Publish

Set `SITE_URL` to the real documentation origin when building for hosting:

```bash
SITE_URL=https://your-actual-docs-domain npm run build
```

This example value must be replaced. Without `SITE_URL`, the site uses localhost and disables sitemap generation. No production domain, app URL, repository URL, or hosting target has been invented. Publish the resulting `build/` directory through the chosen static host; this task does not deploy it.

## Content structure

- `docs/getting-started`: orientation and implementation status.
- `docs/launches`: format comparison, bonding curves, auctions, and presales.
- `docs/concepts`: Stellar assets, quote assets, lifecycle, vesting, and fees.
- `docs/creators` and `docs/participants`: task guides.
- `docs/reputation`: account connections, scoring, and custom criteria.
- `docs/developers`: architecture, contract references, and planned API, SDK, and CLI.
- `docs/deployments`: network directory, historical Testnet evidence, and Mainnet status.
- `docs/reference`: FAQ, glossary, and research sources.

`sidebars.ts` defines the reading order. The root route opens the introduction directly. A single categorized sidebar contains the existing local search and theme control. Mobile uses a native modal navigation drawer. There is no global navbar, footer, or right-hand table of contents.

## Documentation design system

Shared tokens and Markdown styles live in `src/css/custom.css`. Rich components use `src/components/Docs/styles.module.css`. Inter and JetBrains Mono are self-hosted variable fonts with SIL Open Font Licenses in `static/fonts`; the existing LumenRise logo artwork is unchanged.

The MDX mapping in `src/theme/MDXComponents/index.tsx` registers these components globally, without per-page imports:

- `Steps` / `Step`: ordered tutorial steps with titles, optional heading IDs, and nested Markdown.
- `Accordion`: native details/summary disclosure.
- `CardGroup` / `DocCard`: related-guide navigation.
- `Badge`: explicit `experimental`, `deprecated`, `available`, or `planned` status.
- `Parameters` / `Parameter`: name, type, required flag, description, and optional default.
- `FileTree`: nested `{name, children?}` entries.
- `Terminal`: a Bash code block with an optional title and built-in copying.
- `CaptionedImage`: responsive image with alt text, dimensions, and optional caption.
- `Tabs` / `TabItem` and `Admonition`: the native Docusaurus components.

Native Markdown tables receive semantic column headers and a focusable scroll region only when overflowing. CodeBlock adds a filename/language header while preserving Docusaurus syntax highlighting, copying, line numbers, and highlighted ranges.

Use bracketed admonition titles with Docusaurus 3.10's directive parser:

```md
:::info[Implementation boundary]
Describe current source support separately from deployment availability.
:::
```

Examples in existing pages: quickstart (steps), architecture (file tree and accordion), deployments overview (network tabs), launch contracts (parameters), and introduction (badges and related-guide cards).

`npm test` checks the six admonition types, reusable component semantics, all 38 generated page routes, and portable plain-text exports. Run it after `npm run build`. There is no lint script configured.

## Keep the docs accurate

Contract behavior comes from `../launchpad-contract`; interface behavior comes from `../interface`. Update `docs/getting-started/status.mdx` when capabilities change. Planned pages use `DocStatus` rather than presenting future behavior as live functionality.

Do not add installation commands, API endpoints, package names, scoring formulas, or current deployment addresses before they exist. The 8 October 2026 Testnet addresses are historical fixtures and predate reputation and the no-deadline lifecycle.

When publishing a new contract version, record its network, source revision, artifact hashes, settings, and confirmed transactions. A passing docs build does not verify contracts, network deployments, or production services.
