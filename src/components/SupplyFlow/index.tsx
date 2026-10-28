export default function SupplyFlow() {
  return (
    <figure className="supply-flow" aria-label="The intended token launch flow">
      <ol>
        <li><strong>Create the token</strong><span>Issue an ERC-20 on Base, or a Stellar asset, with the chosen supply and quote.</span></li>
        <li><strong>Lock the supply</strong><span>A dedicated vault holds the launch, pool, and team allocations.</span></li>
        <li><strong>Open participation</strong><span>Bonding curve, auction, or presale determines trading, bidding, allocation, and claims.</span></li>
      </ol>
      <figcaption>Team allocations follow a separate cliff and vesting schedule. Base is live; Stellar is the expansion.</figcaption>
    </figure>
  );
}
