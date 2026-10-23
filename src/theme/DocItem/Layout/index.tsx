import React, {type ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';

export default function DocItemLayout({children}: Props): ReactNode {
  const {metadata} = useDoc();
  return <div className="doc-reading-column">
    <ContentVisibility metadata={metadata} />
    <DocVersionBanner />
    <article>
      <DocBreadcrumbs />
      <DocVersionBadge />
      <DocItemContent>{children}</DocItemContent>
      <DocItemFooter />
    </article>
    <DocItemPaginator />
  </div>;
}
