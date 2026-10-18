# Launchpad documentation

Docusaurus documentation for Stellar asset launches and reusable reputation. Covers bonding curves, auctions, presales, creator and participant flows, vesting, developer integrations, and network deployment records.

## Run locally

Requires Node.js 20 or later.

```bash
npm ci
npm start
```

The documentation opens at `http://localhost:3000`. Built-in local search uses the production index, so verify search with the production preview below.

## Verify and preview

```bash
npm run typecheck
npm run build
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

`sidebars.ts` defines the reading order. The root route opens the introduction directly. The site inherits the white, cobalt, Newsreader, and Manrope identity from `../interface`; fonts and their licenses are self-hosted in `static/fonts`.

## Keep the docs accurate

Contract behavior comes from `../launchpad-contract`; interface behavior comes from `../interface`. Update `docs/getting-started/status.mdx` when capabilities change. Planned pages use `DocStatus` rather than presenting future behavior as live functionality.

Do not add installation commands, API endpoints, package names, scoring formulas, or current deployment addresses before they exist. The 8 October 2026 Testnet addresses are historical fixtures and predate reputation and the no-deadline lifecycle.

When publishing a new contract version, record its network, source revision, artifact hashes, settings, and confirmed transactions. A passing docs build does not verify contracts, network deployments, or production services.
