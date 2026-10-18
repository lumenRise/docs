import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {type: 'category', label: 'Getting started', collapsed: false, items: ['getting-started/quickstart', 'getting-started/status']},
    {type: 'category', label: 'Launch formats', collapsed: false, items: ['launches/overview', 'launches/bonding-curves', 'launches/auctions', 'launches/presales']},
    {type: 'category', label: 'Core concepts', items: ['concepts/stellar-assets', 'concepts/quote-assets', 'concepts/lifecycle', 'concepts/vesting', 'concepts/fees']},
    {type: 'category', label: 'For creators', items: ['creators/create-launch', 'creators/project-profile', 'creators/tokenomics', 'creators/eligibility', 'creators/manage-launch']},
    {type: 'category', label: 'For participants', items: ['participants/getting-started', 'participants/trading-and-bidding', 'participants/allocations-and-claims']},
    {type: 'category', label: 'Reputation', items: ['reputation/overview', 'reputation/connect-accounts', 'reputation/scoring', 'reputation/criteria']},
    {type: 'category', label: 'Developers', items: ['developers/overview', 'developers/architecture', 'developers/launch-contracts', 'developers/reputation-contract', 'developers/api', 'developers/sdk', 'developers/cli', 'developers/events-and-errors']},
    {type: 'category', label: 'Deployments', items: ['deployments/overview', 'deployments/testnet', 'deployments/mainnet']},
    {type: 'category', label: 'Reference', items: ['reference/faq', 'reference/glossary', 'reference/sources']},
  ],
};

export default sidebars;
