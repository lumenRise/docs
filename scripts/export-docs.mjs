import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const docs = join(root, 'docs');

function walk(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

const pages = walk(docs).map((path) => {
  const source = readFileSync(path, 'utf8');
  const title = source.match(/^title: "(.+)"$/m)?.[1];
  if (!title) throw new Error(`Missing documentation title: ${path}`);
  const id = relative(docs, path).replace(/\.mdx?$/, '');
  const route = source.match(/^slug: (.+)$/m)?.[1] || `/${id}`;
  const body = source
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^import .+;\n/gm, '')
    .replace('<DocStatus />', '**Planned. Not implemented in the current contracts or published as a service.**')
    .replace('<SupplyFlow />', 'Intended flow: issue a Stellar asset, lock launch supply in a dedicated vault, then open format-specific participation. Team assets follow their own vesting schedule.')
    .trim();
  return {id, route, title, body};
}).sort((a, b) => a.id === 'intro' ? -1 : b.id === 'intro' ? 1 : a.id.localeCompare(b.id));

const context = 'Bonding curves, team vesting, and the administered reputation registry exist in source. Auctions, presales, production scoring, HTTP API, packaged application SDK, and launch CLI are planned. No deployment of the current source version is verified. Historical Testnet fixtures must not be used as current addresses.';
const index = `# Launchpad\n\n> Documentation for Stellar asset launches and reusable social, GitHub, and onchain reputation.\n\n${context}\n\n## Documentation\n\n${pages.map((page) => `- [${page.title}](${page.route})`).join('\n')}\n\n- [Plain-text documentation](/llms-full.txt)\n`;
const full = `# Launchpad documentation\n\n${context}\n\n${pages.map((page) => `# ${page.title}\n\nRoute: ${page.route}\n\n${page.body}`).join('\n\n')}\n`;
writeFileSync(join(root, 'static/llms.txt'), index);
writeFileSync(join(root, 'static/llms-full.txt'), full);
console.log(`Exported ${pages.length} documentation pages for agents.`);
