import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useColorMode, useWindowSize} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Logo from '@theme/Logo';
import SearchBar from '@theme/SearchBar';
import DocSidebarItems from '@theme/DocSidebarItems';
import BackToTopButton from '@theme/BackToTopButton';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';
import type {Props} from '@theme/DocRoot/Layout';
import Icon, {type IconName} from '@site/src/components/Icon';
import styles from './styles.module.css';

const sectionIcons: Record<string, IconName> = {
  'Getting started': 'play',
  'Launch formats': 'rocket',
  'Core concepts': 'layers',
  'For creators': 'sparkle',
  'For participants': 'users',
  Reputation: 'shield',
  Developers: 'code',
  Deployments: 'server',
  Reference: 'book',
};

function containsPath(item: PropSidebarItem, pathname: string): boolean {
  if (item.type === 'link') return item.href === pathname;
  if (item.type === 'category') return item.href === pathname || item.items.some(child => containsPath(child, pathname));
  return false;
}

function activeSection(items: PropSidebarItem[], pathname: string): string | undefined {
  const active = items.find(item => item.type === 'category' && containsPath(item, pathname));
  if (active?.type === 'category') return active.label;
  return undefined;
}

// Accordion: at most one section is open so the rail always fits the viewport without scrolling.
// Navigating to another section hands the open slot back to the current page's section.
function useOpenSection(items: PropSidebarItem[], pathname: string) {
  const active = activeSection(items, pathname);
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);
  useEffect(() => {setChosen(undefined);}, [active]);
  const open = chosen === undefined ? active ?? null : chosen;
  const toggle = (label: string) => setChosen(open === label ? null : label);
  return {open, toggle};
}

function Sections({items, pathname, open, toggle}: {items: PropSidebarItem[]; pathname: string; open: string | null; toggle: (label: string) => void}) {
  return <>{items.map((item, index) => {
    if (item.type !== 'category') {
      return <div key={index} className={`${styles.group} ${styles.standalone}`}>
        <span className={styles.pageIcon}><Icon name="home" size={15} /></span>
        <ul className="menu__list">
          <DocSidebarItems items={[item]} activePath={pathname} level={1} />
        </ul>
      </div>;
    }
    const id = `sidebar-section-${index}`;
    const expanded = open === item.label;
    return <div key={index} className={styles.group}>
      <button type="button" className={styles.sectionTitle} aria-expanded={expanded} aria-controls={`${id}-items`} onClick={() => toggle(item.label)}>
        <Icon name={sectionIcons[item.label] ?? 'book'} size={15} className={styles.sectionIcon} />
        <span className={styles.sectionLabel}>{item.label}</span>
        <Icon name="chevron" size={14} className={styles.sectionChevron} />
      </button>
      <div id={`${id}-items`} className={styles.sectionItems} data-open={expanded} inert={!expanded}>
        <ul className="menu__list" aria-label={item.label}>
          <DocSidebarItems items={item.items} activePath={pathname} level={2} />
        </ul>
      </div>
    </div>;
  })}</>;
}

export default function DocRootLayout({children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const {colorMode, setColorMode} = useColorMode();
  const size = useWindowSize();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const mobile = size === 'mobile';
  const items = sidebar?.items ?? [];
  const sections = useOpenSection(items, pathname);

  useEffect(() => {setOpen(false);}, [pathname, mobile]);
  useEffect(() => {
    if (open && mobile) {
      dialog.current?.showModal();
      dialog.current?.querySelector<HTMLButtonElement>('button[aria-label="Close documentation navigation"]')?.focus();
      dialog.current?.querySelector('.menu__link--active')?.scrollIntoView({block: 'center'});
    }
    else dialog.current?.close();
  }, [open, mobile]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {document.body.style.overflow = previous;};
  }, [open]);

  const theme = <div className={styles.theme} role="group" aria-label="Color theme">
    <button type="button" aria-pressed={colorMode === 'light'} aria-label="Light theme" onClick={() => setColorMode('light')}><Icon name="sun" size={15} /></button>
    <button type="button" aria-pressed={colorMode === 'dark'} aria-label="Dark theme" onClick={() => setColorMode('dark')}><Icon name="moon" size={15} /></button>
  </div>;

  const navigation = <>
    <div className={styles.panel}>
      <div className={styles.masthead}>
        <Logo className={styles.logo} />
        {mobile && <button autoFocus type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label="Close documentation navigation"><Icon name="close" size={18} /></button>}
      </div>
      <div className={styles.search}><SearchBar /></div> 
      <nav aria-label="Documentation" className={`menu thin-scrollbar ${styles.navigation}`} onClick={event => {
        if (mobile && (event.target as HTMLElement).closest('a[href]')) setOpen(false);
      }}>
        <Sections items={items} pathname={pathname} open={sections.open} toggle={sections.toggle} />
      </nav>
      <div className={styles.footer}>
        <div className={styles.tools}>
          <Link className={styles.status} to="/getting-started/status" onClick={() => setOpen(false)}>
            <Icon name="pulse" size={15} />Implementation status
          </Link>
          {theme}
        </div>
      </div>
    </div>
  </>;

  return <div className={styles.layout}>
    {!mobile && <aside className={styles.sidebar}>{navigation}</aside>}
    {mobile && <>
      <div className={styles.mobileBar}>
        <Logo className={styles.logo} />
        <button ref={trigger} type="button" className={styles.trigger} onClick={() => setOpen(true)} aria-label="Open documentation navigation" aria-expanded={open} aria-controls="documentation-drawer">
          <Icon name="menu" size={18} /><span>Menu</span>
        </button>
      </div>
      <dialog id="documentation-drawer" aria-label="Documentation navigation" className={styles.drawer} ref={dialog} onCancel={() => setOpen(false)} onClose={() => {trigger.current?.focus();}} onKeyDown={event => {
        if (event.key === 'Escape') {event.preventDefault(); setOpen(false);}
      }} onClick={event => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX > rect.right || event.clientX < rect.left) setOpen(false);
      }}>{open && navigation}</dialog>
    </>}
    <main id="main-content" className={styles.main}>{children}</main>
    <BackToTopButton />
  </div>;
}
