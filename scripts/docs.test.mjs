import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import admonitions from '@docusaurus/mdx-loader/lib/remark/admonitions/index.js';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync(join(root, 'src/components/Docs/index.tsx'), 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
}).outputText;
const module = {exports: {}};
const localRequire = (name) => {
  if (name.endsWith('.module.css')) return new Proxy({}, {get: (_, key) => String(key)});
  if (name === '@docusaurus/Link') return ({to, ...props}) => React.createElement('a', {href: to, ...props});
  if (name === '@theme/Heading') return ({as, ...props}) => React.createElement(as, props);
  if (name === '@site/src/components/Icon') return {__esModule: true, default: ({name}) => React.createElement('svg', {'data-icon': name})};
  if (name === '@theme/CodeBlock') return ({children, title}) => React.createElement('pre', {'data-title': title}, children);
  return require(name);
};
vm.runInNewContext(`(function(require, module, exports){${code}\n})`)(localRequire, module, module.exports);
const {Steps, Step, Accordion, DocCard, FileTree, Parameters, Parameter, Badge, Terminal, CaptionedImage, Table} = module.exports;
const render = (Component, props, ...children) => renderToStaticMarkup(React.createElement(Component, props, ...children));

test('v4 mode keeps the stable Webpack bundler and disables Rspack disk caching', () => {
  const configCode = ts.transpileModule(readFileSync(join(root, 'docusaurus.config.ts'), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS},
  }).outputText;
  const configModule = {exports: {}};
  vm.runInNewContext(`(function(require, module, exports, process){${configCode}\n})`)(
    require, configModule, configModule.exports, {env: {}},
  );
  assert.equal(configModule.exports.default.future.v4, true);
  assert.equal(configModule.exports.default.future.faster.rspackBundler, false);
  assert.equal(configModule.exports.default.future.faster.rspackPersistentCache, false);
});

test('all six admonition types compile as directives, including nested Markdown and code', async () => {
  for (const type of ['note', 'info', 'tip', 'warning', 'danger', 'important']) {
    const processor = unified().use(remarkParse).use(remarkDirective).use(admonitions.default ?? admonitions);
    const tree = await processor.run(processor.parse(`:::${type}[Custom title]\n\nA **nested** [link](/).\n\n\`\`\`rust\nlet x = 1;\n\`\`\`\n\n:::`));
    assert.equal(tree.children[0].data.hName, 'admonition');
    assert.equal(tree.children[0].data.hProperties.type, type);
    assert.equal(tree.children[0].data.hProperties.title, 'Custom title');
    assert.equal(tree.children[0].children.at(-1).type, 'code');
  }
});
test('steps preserve ordered semantics, content, and explicit heading anchors', () => {
  const html = render(Steps, null, React.createElement(Step, {title: 'Review', id: 'review'}, 'Read first.'));
  assert.match(html, /<ol/);
  assert.match(html, /<li/);
  assert.match(html, /<h3 id="review">Review<\/h3>/);
  assert.match(html, /Read first/);
  const untitled = render(Steps, null, React.createElement(Step, null, 'Issue the supply.'));
  assert.match(untitled, /<ol[^>]*><li[^>]*><div[^>]*>Issue the supply\.<\/div><\/li><\/ol>/);
  assert.doesNotMatch(untitled, /<h3/);
});
test('accordions, cards, and file trees retain accessible native semantics', () => {
  assert.match(render(Accordion, {title: 'Advanced'}, 'Details'), /<details[^>]*><summary><span>Advanced<\/span>/);
  assert.match(render(DocCard, {title: 'Guide', to: '/developers/overview'}, 'Read more'), /href="\/developers\/overview"/);
  const tree = render(FileTree, {entries: [{name: 'contracts/', children: [{name: 'factory/'}]}]});
  assert.match(tree, /aria-label="Project structure"/);
  assert.equal((tree.match(/<ul>/g) ?? []).length, 2);
});
test('parameter names, types, defaults, and explicit status labels are readable', () => {
  const html = render(Parameters, null, React.createElement(Parameter, {name: 'label', type: 'u64', defaultValue: '0'}, 'No gate.'));
  assert.match(html, /<dl/);
  assert.match(html, /<dt><code>label<\/code>/);
  assert.match(html, /u64/);
  assert.match(html, /Optional/);
  assert.match(html, /Default: <code>0<\/code>/);
  assert.match(render(Badge, {status: 'planned'}), /Coming soon/);
  assert.match(render(Badge, {status: 'experimental'}, 'Contract prototype'), /Contract prototype/);
});
test('terminal, images, and tables preserve their content and HTML roles', () => {
  assert.match(render(Terminal, {title: 'Proposed'}, 'echo example\n'), /data-title="Proposed"/);
  const image = render(CaptionedImage, {src: '/example.svg', alt: 'Example', width: 200, height: 100}, 'Caption');
  assert.match(image, /loading="lazy"/);
  assert.match(image, /<figcaption>Caption<\/figcaption>/);
  assert.match(render(Table, null, React.createElement('tbody', null, React.createElement('tr', null, React.createElement('td', null, 'Value')))), /<table><tbody>/);
});
function walk(path) {
  return readdirSync(path, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? walk(join(path, entry.name)) : entry.name.endsWith('.mdx') ? [join(path, entry.name)] : []);
}
test('all 38 original routes exist in the production build and contain no raw admonitions', () => {
  const pages = walk(join(root, 'docs'));
  assert.equal(pages.length, 38);
  for (const path of pages) {
    const id = path.slice(join(root, 'docs').length + 1).replaceAll('\\', '/').replace(/\.mdx$/, '');
    const output = join(root, 'build', ...(id === 'intro' ? [] : [id]), 'index.html');
    const html = readFileSync(output, 'utf8');
    assert.doesNotMatch(html, /:::info/);
    assert.doesNotMatch(html, /theme-doc-toc-desktop|class="navbar |class="footer /);
    assert.match(html, /doc-reading-column/);
  }
});
test('plain-text export has portable routes and no rich-component markup', () => {
  const text = readFileSync(join(root, 'static/llms-full.txt'), 'utf8');
  assert.doesNotMatch(text, /Route: .*\\/);
  assert.doesNotMatch(text, /<\/?(?:Badge|Step|Steps|Tabs|TabItem|DocCard|Parameter|Parameters|FileTree|Accordion)\b/);
  assert.doesNotMatch(text, /^[ \t]+$/m);
  assert.match(text, /BytesN<32>/);
  assert.doesNotMatch(text, /^title: "/m);
  assert.match(text, /^5\. Transfer the launch supply from the distribution account into the dedicated vault\./m);
  assert.match(text, /^### 1\. Choose a launch format$/m);
});
test('compact sidebar gives each heading an icon and starts collapsed on the introduction', () => {
  const html = readFileSync(join(root, 'build/index.html'), 'utf8');
  const nav = html.match(/<nav aria-label="?Documentation"?[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav, 'Documentation navigation exists');
  assert.equal((nav.match(/class="?sectionIcon_/g) ?? []).length, 9);
  assert.match(nav, /class="?pageIcon_[^>]*><svg/);
  assert.equal((nav.match(/aria-expanded="?false"?/g) ?? []).length, 9);
  assert.doesNotMatch(nav, /aria-expanded="?true"?/);
  assert.match(nav, /aria-current="?page"?[^>]*href="?\/"?>/);
  assert.doesNotMatch(html, /<h2>Get Started<\/h2>|<span>Documentation<\/span>/);
  const aside = html.match(/<aside\b[\s\S]*?<\/aside>/)?.[0];
  assert.ok(aside, 'Desktop sidebar exists');
  const logo = aside.indexOf('alt=LumenRise') >= 0 ? aside.indexOf('alt=LumenRise') : aside.indexOf('alt="LumenRise"');
  const panel = aside.search(/class="?panel_/);
  assert.ok(panel >= 0 && logo > panel && logo < aside.indexOf('<nav'), 'Logo appears inside the panel above navigation');
  assert.doesNotMatch(aside.slice(aside.indexOf('</nav>')), /<img\b/);
});
test('compact sidebar opens the current section and retains native child links', () => {
  const html = readFileSync(join(root, 'build/developers/architecture/index.html'), 'utf8');
  const nav = html.match(/<nav aria-label="?Documentation"?[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav, 'Documentation navigation exists');
  assert.equal((nav.match(/aria-expanded="?true"?/g) ?? []).length, 1);
  assert.match(nav, /aria-expanded="?true"? aria-controls="?sidebar-section-7-items"?/);
  assert.doesNotMatch(nav, /class="?[^">]*\bcurrent_/);
  assert.match(nav, /aria-current="?page"?[^>]*href="?\/developers\/architecture"?/);
  assert.match(nav, /href="?\/getting-started\/quickstart"?/);
});
