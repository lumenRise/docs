import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

export default function DocStatus({children = 'This feature is part of the product design and is not implemented in the current contracts.'}: {children?: ReactNode}) {
  return <div className="doc-status"><span className="doc-status__label">Planned</span><span>{children} <Link to="/getting-started/status">View status</Link>.</span></div>;
}
