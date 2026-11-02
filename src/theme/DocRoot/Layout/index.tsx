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
import Icon from '@site/src/components/Icon';
import styles from './styles.module.css';

function containsPage(items: PropSidebarItem[], pathname: string): boolean {
  return items.some(item => item.type === 'category'
    ? containsPage(item.items, pathname)
    : item.type === 'link' && item.href.replace(/\/$/, '') === pathname.replace(/\/$/, ''));
}

function Section({item, pathname, index}: {item: Extract<PropSidebarItem, {type: 'category'}>; pathname: string; index: number}) {
  const active = containsPage(item.items, pathname);
  const [expanded, setExpanded] = useState(active || item.collapsed === false);
  useEffect(() => {
    if (active) setExpanded(true);
  }, [active, pathname]);
  const id = `sidebar-section-${index}`;
  return <div className={styles.group}>
    <button id={id} className={styles.groupTitle} type="button" aria-expanded={expanded} aria-controls={`${id}-items`} onClick={() => setExpanded(value => !value)}>
      <span>{item.label}</span><Icon name="chevron" size={16} className={styles.chevron} />
    </button>
    <div className={styles.sectionReveal} data-expanded={expanded} aria-hidden={!expanded} inert={!expanded}>
      <div className={styles.sectionContent}>
        <ul id={`${id}-items`} className={`menu__list ${styles.children}`} aria-labelledby={id}>
          <DocSidebarItems items={item.items} activePath={pathname} level={2} />
        </ul>
      </div>
    </div>
  </div>;
}

function Sections({items, pathname}: {items: PropSidebarItem[]; pathname: string}) {
  return <>{items.map((item, index) => {
    if (item.type !== 'category') {
      return <ul key={index} className={`menu__list ${styles.group}`}>
        <DocSidebarItems items={[item]} activePath={pathname} level={1} />
      </ul>;
    }
    return <Section key={item.label} item={item} pathname={pathname} index={index} />;
  })}</>;
}

export default function DocRootLayout({children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const {colorMode, setColorMode} = useColorMode();
  const size = useWindowSize();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const mobile = size === 'mobile';
  const items = sidebar?.items ?? [];

  useEffect(() => {setOpen(false);}, [pathname, mobile]);
  // Scrolls only the sidebar; scrollIntoView would also move the page under the sticky rail.
  useEffect(() => {
    const list = nav.current;
    const link = list?.querySelector<HTMLElement>('.menu__link--active');
    if (mobile || !list || !link) return;
    const l = link.getBoundingClientRect(), n = list.getBoundingClientRect();
    if (l.top < n.top || l.bottom > n.bottom) list.scrollTop += l.top - n.top - (n.height - l.height) / 2;
  }, [pathname, mobile]);
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

  const navigation = <div className={styles.panel}>
    <div className={styles.masthead}>
      <Logo className={styles.logo} />
      {mobile && <button autoFocus type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label="Close documentation navigation"><Icon name="close" size={18} /></button>}
    </div>
    <div className={styles.search}><SearchBar /></div>
    <nav ref={nav} aria-label="Documentation" className={`menu ${styles.navigation}`} onClick={event => {
      if (mobile && (event.target as HTMLElement).closest('a[href]')) setOpen(false);
    }}>
      <Sections items={items} pathname={pathname} />
    </nav>
    <div className={styles.footer}>
      <Link className={styles.status} to="/getting-started/status" onClick={() => setOpen(false)}>
        <Icon name="pulse" size={14} />Implementation status
      </Link>
      {theme}
    </div>
  </div>;

  return <div className={styles.layout}>
    {!mobile && <aside className={styles.sidebar}>{navigation}</aside>}
    {mobile && <>
      <div className={styles.mobileBar}>
        <Logo className={styles.logo} />
        <button ref={trigger} type="button" className={styles.trigger} onClick={() => setOpen(true)} aria-expanded={open} aria-controls="documentation-drawer">
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
