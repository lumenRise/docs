import React from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type {Props} from '@theme/CodeBlock';

const terminalLanguages = ['bash', 'sh', 'shell', 'powershell', 'console'];
const labels: Record<string, string> = {
  rust: 'Rust', bash: 'Bash', sh: 'Shell', shell: 'Shell', powershell: 'PowerShell', console: 'Console',
  json: 'JSON', ts: 'TypeScript', typescript: 'TypeScript', tsx: 'TSX', js: 'JavaScript', javascript: 'JavaScript',
  toml: 'TOML', yaml: 'YAML', text: 'Text',
};

// Keep Prism, copying, line numbers, and highlighting in Docusaurus.
export default function CodeBlock(props: Props) {
  const language = props.language || props.className?.match(/language-(\w+)/)?.[1] || 'text';
  const terminal = terminalLanguages.includes(language);
  const label = labels[language] ?? language;
  const title = props.title || (terminal ? 'Terminal' : label);
  const classes = ['docs-code', terminal && 'docs-code--terminal', language === 'text' && 'docs-code--wrap'].filter(Boolean).join(' ');
  return <div className={classes} data-language={language}>
    {props.title && <span className="docs-code__language" aria-hidden="true">{label}</span>}
    <OriginalCodeBlock {...props} title={title} />
  </div>;
}
