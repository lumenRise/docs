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
  const source = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const title = source.match(/^title: "(.+)"$/m)?.[1];
  if (!title) throw new Error(`Missing documentation title: ${path}`);
  const id = relative(docs, path).replaceAll('\\', '/').replace(/\.mdx?$/, '');
  const route = source.match(/^slug: (.+)$/m)?.[1] || `/${id}`;
  const body = source
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^import .+;\n/gm, '')
    .replace('<DocStatus />', '**Planned. Not implemented in the current contracts or published as a service.**')
    .replace('<SupplyFlow />', 'Intended flow: issue an ERC-20 on Base or a Stellar asset, lock launch supply in a dedicated vault, then open a bonding curve, auction, or presale. Team tokens follow their own vesting schedule.')
    .replace(/<FileTree[\s\S]*?\/>/g, 'Contract workspace: evm-contract Factory and BondingCurve on Base; stellar-contract factory, bonding-curve, reputation, and shared type packages.')
    .replace(/<Steps>([\s\S]*?)<\/Steps>/g, (_, steps) => {
      let number = 0;
      return steps
        .replace(/<Step title="([^"]+)"[^>]*>/g, (_, title) => `### ${++number}. ${title}\n`)
        .replace(/<Step>\s*/g, () => `${++number}. `);
    })
    .replace(/<Accordion title="([^"]+)"[^>]*>/g, '**$1**\n')
    .replace(/<DocCard title="([^"]+)" to="([^"]+)"[^>]*>([\s\S]*?)<\/DocCard>/g, '- [$1]($2): $3')
    .replace(/<Parameter name="([^"]+)" type="([^"]+)"[^>]*>/g, '\n- `$1` (`$2`, required): ')
    .replace(/<TabItem[^>]*label="([^"]+)"[^>]*>/g, '\n### $1\n')
    .replace(/<\/?(?:Badge|Steps|Step|Accordion|CardGroup|Parameters|Parameter|Tabs|TabItem)\b[^>]*>/g, '')
    .replace(/^[ \t]+$/gm, '')
    .trim();
  return {id, route, title, body};
}).sort((a, b) => a.id === 'intro' ? -1 : b.id === 'intro' ? 1 : a.id.localeCompare(b.id));

const context = 'LumenRise is live on Base with bonding curves, presales, and auctions. The Base app is audited and has done more than $10k in volume. Stellar is the expansion network; its factory, vault, and reputation contracts are documented here. Copy the Base factory from /deployments/base. Stellar Mainnet factory and registry addresses are on /deployments/mainnet. Historical Stellar Testnet fixtures must not be used as current addresses.';
const index = `# Lumen Rise\n\n> Documentation for token launches on Base, with Stellar next.\n\n${context}\n\n## Documentation\n\n${pages.map((page) => `- [${page.title}](${page.route})`).join('\n')}\n\n- [Plain-text documentation](/llms-full.txt)\n`;
const full = `# Lumen Rise documentation\n\n${context}\n\n${pages.map((page) => `# ${page.title}\n\nRoute: ${page.route}\n\n${page.body}`).join('\n\n')}\n`;
writeFileSync(join(root, 'static/llms.txt'), index);
writeFileSync(join(root, 'static/llms-full.txt'), full);
console.log(`Exported ${pages.length} documentation pages for agents.`);
