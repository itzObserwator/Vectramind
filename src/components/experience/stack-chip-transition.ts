import { capabilityPath } from "./capability-geometry";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};
const numbers = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
const interpolate = (a: number[], b: number[], t: number) =>
  a.map((v, i) => v + (b[i] - v) * t);
const polygon = (points: number[]) =>
  points.reduce(
    (d, n, i) =>
      d + (i % 2 ? ` ${n.toFixed(3)}` : `${i ? "L" : "M"}${n.toFixed(3)}`),
    "",
  ) + "Z";
type Point = { x: number; y: number };
function roundedQuad(points: Point[], radius: number) {
  const toward = (a: Point, b: Point) => {
    const t = Math.min(
      0.45,
      radius / Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
    );
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };
  return (
    points
      .map((point, i) => {
        const before = toward(point, points[(i + 3) % 4]);
        const after = toward(point, points[(i + 1) % 4]);
        return `${i ? "L" : "M"}${before.x} ${before.y}Q${point.x} ${point.y} ${after.x} ${after.y}`;
      })
      .join("") + "Z"
  );
}

/** 02's six shelves press into one surface, then that same surface becomes 03's chip.
 * Coordinates are mapped between the two fitted SVG groups, so the handoff
 * stays attached to the real hub at every viewport size and on reverse scroll.
 */
export function createStackChipTransition(section: HTMLElement) {
  const layers = section.querySelector<SVGGElement>(".capability-layers")!;
  const system = section.querySelector<SVGGElement>(".capability-system")!;
  const overlay = section.querySelector<SVGGElement>(".capability-stack-chip")!;
  const surface = overlay.querySelector<SVGPathElement>("path")!;
  const coat = overlay.querySelector<SVGPathElement>(".integration-chip-coat")!;
  const plates = Array.from(
    layers.querySelectorAll<SVGPathElement>(
      '[data-geometry="plate"], [data-geometry="plate-edge"], [data-geometry="plate-shadow"], [data-geometry="plate-bevel"]',
    ),
  ).map((node) => {
    const kind = node.dataset.geometry!;
    const index = Number(node.dataset.index);
    return {
      node,
      index,
      from: numbers(capabilityPath(kind, index, 0.88)),
      to: numbers(capabilityPath(kind, 5, 0.88)),
    };
  });
  const extras = Array.from(
    layers.querySelectorAll<SVGElement>(
      '[data-geometry="guide"], [data-geometry="rail"], [data-geometry="plate-signal"], .capability-forming-core, .capability-connected-mist',
    ),
  );
  const original = new Map<SVGElement, string>();
  let captured = false;
  function render(time: number | null) {
    if (time === null || time < 2.76) {
      overlay.style.opacity = "0";
      if (captured)
        extras.forEach((node) => {
          const value = original.get(node);
          if (value) node.style.opacity = value;
          else node.style.removeProperty("opacity");
        });
      captured = false;
      return;
    }
    if (!captured) {
      extras.forEach((node) => original.set(node, node.style.opacity));
      captured = true;
    }
    const press = ease((time - 2.76) / 0.18);
    plates.forEach(({ node, index, from, to }) => {
      node.setAttribute("d", polygon(interpolate(from, to, press)));
      node.style.opacity = String(index === 5 ? 1 : 1 - press);
    });
    extras.forEach((node) => {
      node.style.opacity = String(
        Number(original.get(node) || 1) * (1 - press),
      );
    });
    if (time < 2.94 || time >= 3.17) {
      overlay.style.opacity = "0";
      return;
    }
    overlay.style.opacity = "1";
    const morph = ease((time - 2.94) / 0.23);
    const layerMatrix = layers.transform.baseVal.consolidate()?.matrix;
    const systemMatrix = system.transform.baseVal.consolidate()?.matrix;
    if (!layerMatrix || !systemMatrix) return;
    const start = numbers(capabilityPath("plate", 5, 0.88));
    let from: Point[] = [];
    for (let i = 0; i < start.length; i += 2)
      from.push(
        new DOMPoint(start[i], start[i + 1]).matrixTransform(layerMatrix),
      );
    // Preserve the quad's winding; choose the corner correspondence with the
    // least travel so the plate flattens instead of twisting over itself.
    const target = [
      [310, 235],
      [500, 235],
      [500, 345],
      [310, 345],
    ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(systemMatrix));
    const candidates: Point[][] = [];
    for (const order of [target, [...target].reverse()])
      for (let shift = 0; shift < 4; shift++)
        candidates.push(order.map((_, i) => order[(i + shift) % 4]));
    const to = candidates.sort(
      (a, b) =>
        a.reduce(
          (s, p, i) => s + (p.x - from[i].x) ** 2 + (p.y - from[i].y) ** 2,
          0,
        ) -
        b.reduce(
          (s, p, i) => s + (p.x - from[i].x) ** 2 + (p.y - from[i].y) ** 2,
          0,
        ),
    )[0];
    const points = from.map((p, i) => ({
      x: p.x + (to[i].x - p.x) * morph,
      y: p.y + (to[i].y - p.y) * morph,
    }));
    surface.setAttribute("d", roundedQuad(points, 16 * systemMatrix.a * morph));
    coat.setAttribute("d", surface.getAttribute("d")!);
    coat.style.opacity = String(morph);
    surface.style.fillOpacity = String(0.82 + 0.18 * morph);
    overlay.dataset.progress = morph.toFixed(4);
  }
  return { render };
}
