// Noise is baked once by scripts/bake-reach-mist.mjs, never filtered per frame.
export function ReachAtmosphere() {
  return (
    <div className="reach-atmosphere" aria-hidden="true">
      <div className="reach-cloud-drift" />
    </div>
  );
}
