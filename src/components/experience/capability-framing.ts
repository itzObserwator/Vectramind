import { capabilityPath } from "./capability-geometry";
import { INTEGRATION_COLUMNS, integrationTower } from "./integration-motion";
import { connectedShelfOpacity } from "./connected-layers";

/** One fixed envelope keeps the camera from resizing the scene during scrolling. */
function sceneEnvelope() {
  const points: number[][] = [];
  const include = (kind: string, index: number, progress: number) => {
    const coordinates =
      capabilityPath(kind, index, progress)
        .match(/-?\d+(?:\.\d+)?/g)
        ?.map(Number) || [];
    for (let i = 0; i < coordinates.length; i += 2)
      // The hanging column enters from above; fit its visible portion rather
      // than shrinking every scene to include its deliberately offscreen cap.
      points.push([
        coordinates[i],
        kind === "tower-face"
          ? Math.max(60, coordinates[i + 1])
          : coordinates[i + 1],
      ]);
  };
  for (let step = 0; step <= 40; step++) {
    const progress = step / 40;
    for (let index = 0; index < 6; index++) {
      if (connectedShelfOpacity(index, progress) > 0.05) {
        include("plate", index, progress);
        include("plate-edge", index, progress);
      }
    }
    for (let index = 0; index < 3; index++) {
      include("core", index, progress);
      include("bridge", index, progress);
      include("bridge-edge", index, progress);
      for (const column of INTEGRATION_COLUMNS) {
        if (integrationTower(column.index, progress).opacity > 0.05)
          include(`${column.prefix}-face`, index, progress);
      }
    }
  }
  return {
    left: Math.min(...points.map(([x]) => x)),
    right: Math.max(...points.map(([x]) => x)),
    top: Math.min(...points.map(([, y]) => y)),
    bottom: Math.max(...points.map(([, y]) => y)),
  };
}
const envelope = sceneEnvelope();

/** Fit the stack and system map into a shared safe area with independent scales.
 * stack-chip-transition.ts maps the surface between these coordinate spaces. */
export function fitConnectedScenes(section: HTMLElement, svg: SVGSVGElement) {
  const groups = section.querySelectorAll<SVGGElement>(
    ".capability-layers, .capability-system",
  );
  const clip = section.querySelector<SVGRectElement>(
    ".capability-connected-clip",
  );
  const heading = section.querySelector<HTMLElement>(".capability-main-title");
  const sticky = section.querySelector<HTMLElement>(
    ".experience-capability-sticky",
  );
  const copy = section.querySelector<HTMLElement>(
    ".experience-capability-copy",
  );
  const matrix = svg.getScreenCTM();
  if (!clip || !heading || !sticky || !copy || !matrix || matrix.a <= 0) return;
  if (innerWidth <= 900) {
    groups.forEach((group) => group.removeAttribute("transform"));
    for (const [name, value] of Object.entries({
      x: -30,
      y: -20,
      width: 860,
      height: 660,
    }))
      clip.setAttribute(name, String(value));
    return;
  }
  const frame = sticky.getBoundingClientRect();
  const headingBox = heading.getBoundingClientRect();
  const left = Math.max(
    frame.left + frame.width * 0.43,
    copy.getBoundingClientRect().right + 36,
  );
  const right = frame.right - Math.max(24, frame.width * 0.035);
  const top = headingBox.bottom + 30;
  const bottom = frame.bottom - 88;
  const box = {
    x: (left - matrix.e) / matrix.a,
    y: (top - matrix.f) / matrix.d,
    width: (right - left) / matrix.a,
    height: (bottom - top) / matrix.d,
  };
  if (box.width <= 0 || box.height <= 0) return;
  const padding = 14;
  const scale = Math.min(
    (box.width - padding * 2) / (envelope.right - envelope.left),
    (box.height - padding * 2) / (envelope.bottom - envelope.top),
  );
  const x =
    box.x +
    (box.width - (envelope.right - envelope.left) * scale) / 2 -
    envelope.left * scale;
  const y = box.y + padding - envelope.top * scale;
  // Preserve 02's established camera framing. The new integration diagram has
  // its own fixed envelope, so no old column geometry controls its size.
  section
    .querySelector(".capability-layers")
    ?.setAttribute("transform", `matrix(${scale} 0 0 ${scale} ${x} ${y})`);
  const integrationScale = Math.min(
    (box.width - padding * 2) / 710,
    (box.height - padding * 2) / 550,
  );
  const integrationX =
    box.x + (box.width - 710 * integrationScale) / 2 - 45 * integrationScale;
  const integrationY =
    box.y + (box.height - 550 * integrationScale) / 2 - 45 * integrationScale;
  section
    .querySelector(".capability-system")
    ?.setAttribute(
      "transform",
      `matrix(${integrationScale} 0 0 ${integrationScale} ${integrationX} ${integrationY})`,
    );
  for (const [name, value] of Object.entries(box))
    clip.setAttribute(name, String(value));
}
