import React, {type ComponentProps} from 'react';
import OriginalComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import {
  Table, Steps, Step, Accordion, CardGroup, DocCard, Badge,
  Parameters, Parameter, FileTree, Terminal, CaptionedImage,
} from '@site/src/components/Docs';

// Stellar account, contract, and muxed keys (56 or 69 base32 characters) and 64-character hex hashes.
const identifier = /^(?:[GCM][A-Z2-7]{55}|M[A-Z2-7]{68}|[0-9a-f]{64})$/;
const OriginalCode = OriginalComponents.code;

function Code(props: ComponentProps<'code'>) {
  if (typeof props.children === 'string' && identifier.test(props.children)) {
    return <OriginalCode {...props} className={[props.className, 'docs-identifier'].filter(Boolean).join(' ')} />;
  }
  return <OriginalCode {...props} />;
}

export default {
  ...OriginalComponents,
  code: Code,
  table: Table,
  th: (props: ComponentProps<'th'>) => <th scope="col" {...props} />,
  Tabs, TabItem, Admonition, Steps, Step, Accordion, CardGroup, DocCard,
  Badge, Parameters, Parameter, FileTree, Terminal, CaptionedImage,
};
