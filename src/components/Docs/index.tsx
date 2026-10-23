import React, {useEffect, useRef, useState, type ComponentProps, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import Icon, {type IconName} from '@site/src/components/Icon';
import styles from './styles.module.css';

export function Table({children, ...props}: ComponentProps<'table'>) {
  const container = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setScrollable(element.scrollWidth > element.clientWidth + 1));
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, []);
  return <div ref={container} className="docs-table-scroll" role={scrollable ? 'region' : undefined} aria-label={scrollable ? 'Scrollable documentation table' : undefined} tabIndex={scrollable ? 0 : undefined}>
    <table {...props}>{children}</table>
  </div>;
}

export function Steps({children}: {children: ReactNode}) {
  return <ol className={styles.steps}>{children}</ol>;
}
export function Step({title, id, children}: {title?: string; id?: string; children: ReactNode}) {
  return <li className={`${styles.step} ${title ? '' : styles.untitled}`}><div className={styles.stepContent}>
    {title && <Heading as="h3" id={id}>{title}</Heading>}{children}
  </div></li>;
}
export function Accordion({title, children, open = false}: {title: string; children: ReactNode; open?: boolean}) {
  return <details className={styles.accordion} open={open}>
    <summary><span>{title}</span><Icon name="chevron" size={16} className={styles.chevron} /></summary>
    <div className={styles.accordionBody}>{children}</div>
  </details>;
}
export function CardGroup({children, cols = 2}: {children: ReactNode; cols?: 2 | 3}) {
  return <div className={`${styles.cardGroup} ${cols === 3 ? styles.cols3 : ''}`}>{children}</div>;
}
export function DocCard({title, to, icon, children}: {title: string; to: string; icon?: IconName; children: ReactNode}) {
  return <Link to={to} className={styles.card}>
    {icon && <span className={styles.cardIcon}><Icon name={icon} size={18} /></span>}
    <span className={styles.cardTitle}>{title}<Icon name="arrow" size={15} className={styles.cardArrow} /></span>
    <span className={styles.cardDescription}>{children}</span>
  </Link>;
}
const badgeLabels = {experimental: 'Experimental', deprecated: 'Deprecated', available: 'Available', planned: 'Coming soon'} as const;
export function Badge({status, children}: {status: keyof typeof badgeLabels; children?: ReactNode}) {
  return <span className={`${styles.badge} ${styles[status]}`}><span className={styles.badgeDot} aria-hidden="true" />{children ?? badgeLabels[status]}</span>;
}

export function Parameters({children}: {children: ReactNode}) {
  return <dl className={styles.parameters}>{children}</dl>;
}
export function Parameter({name, type, required = false, defaultValue, children}: {name: string; type: string; required?: boolean; defaultValue?: string; children: ReactNode}) {
  return <div className={styles.parameter}>
    <dt><code>{name}</code><span className={styles.parameterType}>{type}</span><span className={`${styles.requirement} ${required ? styles.required : ''}`}>{required ? 'Required' : 'Optional'}</span></dt>
    <dd>{children}{defaultValue !== undefined && <p className={styles.defaultValue}>Default: <code>{defaultValue}</code></p>}</dd>
  </div>;
}

export type FileTreeEntry = {name: string; children?: FileTreeEntry[]};
function TreeBranch({entries}: {entries: FileTreeEntry[]}) {
  return <ul>{entries.map(entry => <li key={entry.name}>
    <span className={entry.children ? styles.folder : undefined}><Icon name={entry.children ? 'folder' : 'file'} size={14} />{entry.name}</span>{entry.children && <TreeBranch entries={entry.children} />}
  </li>)}</ul>;
}
export function FileTree({entries, label = 'Project structure'}: {entries: FileTreeEntry[]; label?: string}) {
  return <div className={styles.fileTree} role="group" aria-label={label}><TreeBranch entries={entries} /></div>;
}
export function Terminal({children, title = 'Terminal'}: {children: string; title?: string}) {
  return <CodeBlock language="bash" title={title}>{children}</CodeBlock>;
}
export function CaptionedImage({src, alt, children, width, height}: {src: string; alt: string; children?: ReactNode; width?: number; height?: number}) {
  return <figure><img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />{children && <figcaption>{children}</figcaption>}</figure>;
}
