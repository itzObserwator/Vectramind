import type { CSSProperties } from "react";
import {
  trailPulseColors,
  trailPulseDelay,
  trailPulseDuration,
  trailPulseLength,
} from "./trail-pulses";
const trails = Array.from({ length: 40 }, (_, index) => {
  const t = (index - 19.5) / 19.5;
  return `M -180 ${1050 + t * 70} C 220 ${700 + t * 90}, 470 ${630 + t * 40}, 780 ${580 + t * 17} S 1090 ${535 + t * 58}, ${1150 + t * 65} ${330 + t * 28} S ${1120 + t * 115} 80, 1550 ${-130 + t * 100}`;
});
// The reference's diagonal stream and right-hand waterfall, without a WebGL loop.
export function FooterFlow() {
  return (
    <div className="footer-flow" aria-hidden="true">
      <div className="footer-flow-mist" />
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="none">
        <g className="footer-flow-drift" fill="none">
          {trails.map((d, index) => (
            <path
              key={index}
              d={d}
              stroke="#9ca7b7"
              strokeWidth={index % 5 === 0 ? 1.7 : 0.8}
              opacity={index % 5 === 0 ? 0.45 : 0.24}
            />
          ))}
          {trails
            .filter((_, index) => index % 5 === 0)
            .map((d, index) => (
              <path
                key={`pulse-${index}`}
                className="footer-flow-pulse"
                d={d}
                pathLength="1"
                stroke={trailPulseColors[index % 4]}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray={`${trailPulseLength} ${1 - trailPulseLength}`}
                style={
                  {
                    "--pulse-delay": `${trailPulseDelay(index)}s`,
                    "--pulse-duration": `${trailPulseDuration(index)}s`,
                  } as CSSProperties
                }
              />
            ))}
        </g>
      </svg>
    </div>
  );
}
