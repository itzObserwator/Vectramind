// A static procedural cloud field, composited and drifted with CSS. The filter
// parameters never animate, avoiding a noise simulation on every scroll frame.
export function EcosystemAtmosphere() {
  return (
    <svg
      className="ecosystem-atmosphere"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="ecosystem-cloud" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".008 .012"
            numOctaves="3"
            seed="17"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 .77  0 0 0 0 .78  0 0 0 0 .80  1.8 0 0 0 -.62"
          />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <linearGradient id="ecosystem-cloud-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".12" stopColor="white" stopOpacity="0" />
          <stop offset=".47" stopColor="white" stopOpacity=".4" />
          <stop offset=".86" stopColor="white" />
        </linearGradient>
        <mask id="ecosystem-cloud-mask">
          <rect width="1200" height="800" fill="url(#ecosystem-cloud-fade)" />
        </mask>
      </defs>
      <g mask="url(#ecosystem-cloud-mask)">
        <g className="ecosystem-cloud-drift">
          <rect
            x="-100"
            y="-60"
            width="1400"
            height="920"
            filter="url(#ecosystem-cloud)"
          />
        </g>
      </g>
    </svg>
  );
}
