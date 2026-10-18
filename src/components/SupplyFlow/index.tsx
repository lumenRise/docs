export default function SupplyFlow() {
  return (
    <figure className="supply-flow" aria-label="The intended asset launch flow">
      <ol>
        <li><strong>Create the asset</strong><span>Issue a Stellar asset with the chosen supply and quote asset.</span></li>
        <li><strong>Lock the supply</strong><span>A dedicated vault holds the launch, pool, and team allocations.</span></li>
        <li><strong>Open participation</strong><span>The format determines trading, bidding, allocation, and claims.</span></li>
      </ol>
      <figcaption>Team allocations follow a separate cliff and vesting schedule.</figcaption>
    </figure>
  );
}
