/** Stage 01 traced from the perspective-corrected 750×525 reference frames.
 * Coordinates stay in reference-screen pixels here so the pose is easy to edit.
 * Only the final mapping depends on the shared illustration's SVG viewBox.
 */
type Point = [number, number];
export const INTELLIGENCE_PANEL_COUNT = 42;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const topProfile: Point[] = [
  [0, 246],
  [0.16, 225],
  [0.29, 174],
  [0.43, 90],
  [0.49, 92],
  [0.58, 154],
  [0.66, 184],
  [0.82, 199],
  [1, 211],
];
function sample(t: number) {
  const index = topProfile.findIndex(([at]) => at >= t);
  if (index <= 0) return topProfile[0][1];
  const [a, av] = topProfile[index - 1];
  const [b, bv] = topProfile[index];
  const u = (t - a) / (b - a);
  return av + (bv - av) * u;
}
function draw(points: Point[], closed = true) {
  return (
    points
      .map(
        ([x, y], i) =>
          `${i ? "L" : "M"}${(((x - 250) * 800) / 520).toFixed(2)} ${(((y - 53) * 620) / 408).toFixed(2)}`,
      )
      .join("") + (closed ? "Z" : "")
  );
}
function bezier(a: Point, b: Point, c: Point, d: Point, t: number): Point {
  const q = 1 - t;
  return [0, 1].map(
    (axis) =>
      q * q * q * a[axis] +
      3 * q * q * t * b[axis] +
      3 * q * t * t * c[axis] +
      t * t * t * d[axis],
  ) as Point;
}
const wrap = (n: number) => ((n % 1) + 1) % 1;
/** The visible bank follows the reference crest; the return bank closes below it. */
export function intelligencePanelPose(index: number, phase = 0) {
  const position = wrap(index / INTELLIGENCE_PANEL_COUNT + phase);
  const front = position < 0.72;
  const t = front ? position / 0.72 : (position - 0.72) / 0.28;
  let center: Point;
  let width: number;
  let height: number;
  let lean: number;
  let skew: number;
  if (front) {
    center = [185 + 545 * t, sample(t)];
    const turn = clamp((t - 0.47) / 0.24);
    width = 58 + Math.sin(t * Math.PI) * 13 - turn * 26;
    height = 210 - turn * 70;
    lean = 9 - turn * 6;
    skew = 4 + turn * 3;
  } else {
    const segment = (u: number): Point =>
      u < 0.5
        ? bezier([730, 211], [850, 226], [850, 365], [500, 390], u * 2)
        : bezier([500, 390], [150, 415], [30, 285], [185, 246], (u - 0.5) * 2);
    center = segment(t);
    const before = segment(Math.max(0, t - 0.0005));
    const after = segment(Math.min(1, t + 0.0005));
    const dx = after[0] - before[0];
    const dy = after[1] - before[1];
    const facing = dx / Math.max(0.00001, Math.hypot(dx, dy));
    const smooth = t * t * (3 - 2 * t);
    width = (32 + 26 * smooth) * facing;
    height = 140 + 70 * smooth;
    lean = 3 + 6 * smooth;
    skew = 7 - 3 * smooth;
  }
  // The visible run emerges from the left foreground and recedes right.
  // Its reverse-travelling return arc stays behind the haze, never in front.
  const smooth = (n: number) => {
    const u = clamp(n);
    return u * u * (3 - 2 * u);
  };
  const emerge = smooth((center[0] - 225) / 65);
  const recede = smooth((1 - t) / 0.18);
  const opacity = front ? emerge * recede : 0;
  const depth = front ? 1 - t : -1;
  return { position, center, width, height, lean, skew, opacity, depth, front };
}
export function intelligenceRibbonPath(
  kind: string,
  index: number,
  progress: number,
  phase = 0,
) {
  if (kind === "ribbon-rail") {
    const rails: Point[][] = [
      [
        [375, 107],
        [810, 100],
      ],
      [
        [480, 155],
        [810, 160],
      ],
      [
        [290, 374],
        [810, 274],
      ],
      [
        [270, 535],
        [820, 375],
      ],
      [
        [690, 162],
        [680, 395],
      ],
      [
        [480, 150],
        [480, 380],
      ],
      [
        [500, 155],
        [715, 160],
        [705, 383],
        [490, 335],
      ],
      [
        [480, 160],
        [590, 130],
        [810, 145],
      ],
    ];
    return draw(rails[index], false);
  }
  const pose = intelligencePanelPose(index, phase);
  const entry = clamp((progress - pose.position * 0.045) / 0.255);
  const settle = 1 - Math.pow(1 - entry, 3);
  const [x, rawY] = pose.center;
  const y = rawY + (1 - settle) * 16;
  const { width, height, skew } = pose;
  const lean = pose.lean + (1 - settle) * 4;
  const a: Point = [x, y],
    b: Point = [x + width, y + skew];
  const c: Point = [x + width - lean, y + height + skew],
    d: Point = [x - lean, y + height];
  if (kind === "fin-edge")
    return draw([b, [b[0] + 1.7, b[1] + 0.7], [c[0] + 1.7, c[1] + 0.7], c]);
  if (kind === "fin-highlight") return draw([d, a, b], false);
  return draw([a, b, c, d]);
}
