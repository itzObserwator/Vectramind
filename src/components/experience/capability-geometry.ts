import {
  intelligenceRibbonPath,
  intelligencePanelPose,
} from "./intelligence-ribbon";

import {
  connectedLayerFrame,
  connectedCircuitPose,
  connectedShelfOpacity,
  connectedShelfY,
  connectedShelfRadius,
} from "./connected-layers";

import {
  integrationFrame,
  integrationColumn,
  integrationTower,
  integrationBridge,
} from "./integration-motion";

/** Lightweight projection into SVG paths. No canvas, WebGL, or per-frame React renders. */
type Point = [number, number, number];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
function path(
  points: Point[],
  yaw: number,
  pitch: number,
  zoom = 1,
  closed = true,
  center: [number, number] = [470, 310],
) {
  const a = (yaw * Math.PI) / 180;
  const b = (pitch * Math.PI) / 180;
  return (
    points
      .map(([x, y, z], i) => {
        const rx = x * Math.cos(a) + z * Math.sin(a);
        const depth = z * Math.cos(a) - x * Math.sin(a);
        const ry = y * Math.cos(b) - depth * Math.sin(b);
        const rz = depth * Math.cos(b) + y * Math.sin(b);
        const perspective = 1150 / (1150 + rz);
        return `${i ? "L" : "M"}${(center[0] + rx * perspective * zoom).toFixed(2)} ${(center[1] + ry * perspective * zoom).toFixed(2)}`;
      })
      .join("") + (closed ? "Z" : "")
  );
}
function square(y: number, radius: number, thickness = 0): Point[] {
  return [
    [-radius, y + thickness, -radius],
    [radius, y + thickness, -radius],
    [radius, y + thickness, radius],
    [-radius, y + thickness, radius],
  ];
}
export function capabilityPath(
  kind: string,
  index: number,
  progress: number,
  loopPhase = 0,
) {
  const p = clamp(progress);
  if (
    kind === "fin" ||
    kind === "fin-edge" ||
    kind === "fin-highlight" ||
    kind === "ribbon-rail"
  ) {
    return intelligenceRibbonPath(kind, index, p, loopPhase);
  }
  if (kind === "guide") {
    const camera = connectedLayerFrame(p);
    const x = index === 0 ? -camera.radius : camera.radius;
    const z = index === 1 ? -camera.radius : camera.radius;
    return path(
      [
        [x, -285, z],
        [x, 285, z],
      ],
      camera.yaw,
      camera.pitch,
      camera.zoom,
      false,
      [470 + camera.x, 310 + camera.y],
    );
  }
  if (kind === "guide-system" || kind === "guide-fold") {
    const radius =
      kind === "guide-system"
        ? 116
        : kind === "guide-fold"
          ? 220
          : mix(175, 116, clamp((p - 0.64) / 0.36));
    const x = index === 0 ? -radius : radius;
    const z = index === 1 ? -radius : radius;
    const yaw =
      kind === "guide-system"
        ? integrationFrame(p).yaw
        : kind === "guide-fold"
          ? 39
          : mix(31, 123, p);
    const pitch =
      kind === "guide-system"
        ? integrationFrame(p).pitch
        : kind === "guide-fold"
          ? 14
          : mix(13, 24, p);
    return path(
      [
        [x, -285, z],
        [x, 285, z],
      ],
      yaw,
      pitch,
      kind === "guide-system"
        ? 1.15
        : kind === "guide-fold"
          ? 1
          : mix(1, 1.15, clamp((p - 0.64) / 0.36)),
      false,
    );
  }
  if (
    kind.startsWith("core") ||
    kind === "plate-core" ||
    kind === "plate-rib"
  ) {
    const middle = kind === "plate-core" || kind === "plate-rib";
    const camera = middle ? connectedLayerFrame(p) : null;
    const yaw = camera?.yaw ?? integrationFrame(p).yaw;
    const pitch = camera?.pitch ?? integrationFrame(p).pitch;
    const tower = middle ? null : integrationTower(0, p);
    const radius = camera?.radius ?? tower!.radius;
    const h = tower?.bottom ?? 180;
    const topY = tower?.top ?? -60;
    const frontZ = middle ? -radius : mix(-radius, radius, clamp(p / 0.08));
    const project = (points: Point[], closed = true) =>
      path(
        points.map(([x, y, z]) => [
          x + (tower?.x ?? 0),
          y,
          z + (tower?.z ?? 0),
        ]),
        yaw,
        pitch,
        camera?.zoom ?? 1.15,
        closed,
        [470 + (camera?.x ?? 0), 310 + (camera?.y ?? 0)],
      );
    if (kind === "core-flute" || kind === "core-flute-side") {
      const offset = -radius + ((index + 0.24) / 14) * radius * 2;
      const width = ((radius * 2) / 14) * 0.34;
      return project(
        kind === "core-flute"
          ? [
              [offset, topY, frontZ],
              [offset + width, topY, frontZ],
              [offset + width, h, frontZ],
              [offset, h, frontZ],
            ]
          : [
              [radius, topY, offset],
              [radius, topY, offset + width],
              [radius, h, offset + width],
              [radius, h, offset],
            ],
      );
    }
    if (kind === "core-rib-side") {
      const z = -radius + (index / 13) * radius * 2;
      return project(
        [
          [radius, topY, z],
          [radius, h, z],
        ],
        false,
      );
    }
    if (kind === "core-rib" || kind === "plate-rib") {
      const x = -radius + (index / 13) * radius * 2;
      return project(
        [
          [x, topY, frontZ],
          [x, h, frontZ],
        ],
        false,
      );
    }
    if (index === 0)
      return project([
        [-radius, topY, frontZ],
        [radius, topY, frontZ],
        [radius, h, frontZ],
        [-radius, h, frontZ],
      ]);
    if (index === 1)
      return project([
        [radius, topY, -radius],
        [radius, topY, radius],
        [radius, h, radius],
        [radius, h, -radius],
      ]);
    return project(square(topY, radius));
  }
  if (kind.startsWith("plate")) {
    const camera = connectedLayerFrame(p);
    const y = connectedShelfY(index, p);
    const radius = connectedShelfRadius(index, camera.radius, p);
    const project = (points: Point[], closed = true) =>
      path(points, camera.yaw, camera.pitch, camera.zoom, closed, [
        470 + camera.x,
        310 + camera.y,
      ]);
    if (kind === "plate-shadow")
      return project(square(y + camera.thickness + 7, radius * 0.98));
    if (kind === "plate") return project(square(y, radius));
    if (kind === "plate-edge") {
      const top = square(y, radius);
      const bottom = square(y, radius, camera.thickness);
      // The nearest pair of side faces changes as the orbit crosses 90 degrees.
      const quadrant = Math.floor((((camera.yaw % 360) + 360) % 360) / 90);
      const [a, b, c] = [
        [0, 1, 2],
        [1, 2, 3],
        [2, 3, 0],
        [3, 0, 1],
      ][quadrant];
      return project([top[a], top[b], top[c], bottom[c], bottom[b], bottom[a]]);
    }
    if (kind === "plate-bevel") return project(square(y - 0.4, radius - 2));
    // Each smaller circuit sits in the open air between consecutive shelves.
    const circuit = connectedCircuitPose(index, p);
    const trace = square(circuit.y, circuit.radius);
    const joined: Point[] = [
      [-105, y + 14, -116],
      [105, y + 14, -116],
      [116, y + 14, -105],
      [116, y + 14, 105],
    ];
    const points: Point[] = trace.map(
      (point, i) =>
        point.map((value, axis) =>
          mix(value, joined[i][axis], circuit.join),
        ) as Point,
    );
    return project(points, circuit.join < 0.99);
  }
  const column = integrationColumn(kind);
  if (column) {
    const tower = integrationTower(column.index, p);
    const feature = column.feature;
    const camera = integrationFrame(p);
    const r = tower.radius;
    const project = (points: Point[], closed = true) =>
      path(
        points.map(([x, y, z]) => [x + tower.x, y, z + tower.z]),
        camera.yaw,
        camera.pitch,
        camera.zoom,
        closed,
      );
    if (feature === "flute" || feature === "flute-side") {
      const offset = -r + ((index + 0.24) / 14) * r * 2;
      const width = ((r * 2) / 14) * 0.34;
      return project(
        feature === "flute"
          ? [
              [offset, tower.top, r],
              [offset + width, tower.top, r],
              [offset + width, tower.bottom, r],
              [offset, tower.bottom, r],
            ]
          : [
              [r, tower.top, offset],
              [r, tower.top, offset + width],
              [r, tower.bottom, offset + width],
              [r, tower.bottom, offset],
            ],
      );
    }
    if (feature === "rib" || feature === "rib-side") {
      const offset = -r + (index / 13) * 2 * r;
      return project(
        feature === "rib"
          ? [
              [offset, tower.top, r],
              [offset, tower.bottom, r],
            ]
          : [
              [r, tower.top, offset],
              [r, tower.bottom, offset],
            ],
        false,
      );
    }
    if (index === 0)
      return project([
        [-r, tower.top, r],
        [r, tower.top, r],
        [r, tower.bottom, r],
        [-r, tower.bottom, r],
      ]);
    if (index === 1)
      return project([
        [r, tower.top, -r],
        [r, tower.top, r],
        [r, tower.bottom, r],
        [r, tower.bottom, -r],
      ]);
    return project(square(tower.top, r));
  }
  if (kind.startsWith("bridge")) {
    const bridge = integrationBridge(index, p);
    const { y, width, depth, thickness } = bridge;
    const camera = integrationFrame(p);
    const project = (points: Point[]) =>
      path(
        points.map(([x, y, z]) => [x + bridge.x, y, z + bridge.z]),
        camera.yaw,
        camera.pitch,
        camera.zoom,
      );
    const rectangle = (height: number, inset = 0): Point[] => [
      [-width + inset, height, -depth + inset],
      [width - inset, height, -depth + inset],
      [width - inset, height, depth - inset],
      [-width + inset, height, depth - inset],
    ];
    if (kind === "bridge-shadow")
      return project(rectangle(y + thickness + 9, 3));
    if (kind === "bridge-edge") {
      const top = rectangle(y);
      const bottom = rectangle(y + thickness);
      return project([top[1], top[2], top[3], bottom[3], bottom[2], bottom[1]]);
    }
    return project(rectangle(y));
  }
  // A floor of intersecting signal rails, moving with the camera in each chapter.
  const axis = index % 2;
  const offset = (Math.floor(index / 2) - 5) * 54;
  const points: Point[] = axis
    ? [
        [-430, 245, offset],
        [430, 245, offset],
      ]
    : [
        [offset, 245, -430],
        [offset, 245, 430],
      ];
  if (kind === "rail") {
    const camera = connectedLayerFrame(p);
    return path(points, camera.yaw, camera.pitch, 1, false, [
      470 + camera.x,
      310 + camera.y,
    ]);
  }
  const camera =
    kind === "rail-fold"
      ? [39, 14]
      : kind === "rail-system"
        ? [integrationFrame(p).yaw, integrationFrame(p).pitch]
        : [mix(31, 123, p), mix(13, 24, p)];
  return path(points, camera[0], camera[1], 1, false);
}

/** Cache nodes once; only path coordinates change while the section is scrubbed. */
export function createCapabilityRenderer(root: Element) {
  const nodes = Array.from(
    root.querySelectorAll<SVGPathElement>("[data-geometry]"),
  ).map((node) => ({
    node,
    kind: node.dataset.geometry!,
    index: Number(node.dataset.index),
    chapter: Number(node.dataset.chapter),
    column: integrationColumn(node.dataset.geometry!),
  }));
  const panels = Array.from(
    root.querySelectorAll<SVGGElement>(".capability-fin"),
  ).map((node) => ({ node, index: Number(node.dataset.panelIndex) }));
  let previousOrder = "";
  const previousGeometry: string[] = [];
  return (time: number | null, loopPhase = 0, firstOnly = false) => {
    const progressByChapter =
      time === null
        ? [0.45, 0.45, 0.65]
        : [clamp(time), clamp((time - 1) / 2), clamp(time - 3)];
    const keys = progressByChapter.map(
      (p, chapter) => `${p}:${chapter === 0 ? loopPhase : 0}`,
    );
    const dirty = keys.map(
      (key, chapter) =>
        (!firstOnly || chapter === 0) && key !== previousGeometry[chapter],
    );
    for (const { node, kind, index, chapter, column } of nodes) {
      if (!dirty[chapter]) continue;
      const progress = progressByChapter[chapter];
      node.setAttribute("d", capabilityPath(kind, index, progress, loopPhase));
      if (kind.startsWith("bridge"))
        node.style.opacity = String(integrationBridge(index, progress).opacity);
      if (column)
        node.style.opacity = String(
          integrationTower(column.index, progress).opacity,
        );
      if (kind === "core-rib-side" || kind.startsWith("core-flute"))
        node.style.opacity = String(integrationFrame(progress).unfold);
      if (kind === "core")
        node.style.fillOpacity = String(
          (index === 2 ? 0.65 : 0.38) +
            (index === 2 ? 0.3 : 0.54) * integrationFrame(progress).unfold,
        );
      if (kind === "plate-core" || kind === "plate-rib") {
        node.style.opacity = String(clamp((progress - 0.94) / 0.06));
      }
      if (kind === "plate-signal") {
        node.style.opacity = String(
          connectedCircuitPose(index, progress).opacity,
        );
      }
      if (
        kind === "plate-edge" ||
        kind === "plate-bevel" ||
        kind === "plate-shadow" ||
        kind === "plate"
      ) {
        node.style.opacity = String(connectedShelfOpacity(index, progress));
      }
      if (kind === "plate" || kind === "bridge") {
        // As the view turns, the surface reflection changes with it.
        const reflection =
          0.48 + 0.34 * Math.abs(Math.cos(clamp(progress) * Math.PI));
        node.style.fillOpacity = String(
          kind === "bridge" ? 0.4 + reflection * 0.4 : reflection,
        );
      }
    }
    dirty.forEach((changed, chapter) => {
      if (changed) previousGeometry[chapter] = keys[chapter];
    });
    if (!dirty[0]) return;
    const order = panels
      .map(({ node, index }) => {
        const pose = intelligencePanelPose(index, loopPhase);
        node.style.opacity = String(pose.opacity);
        return { node, index, depth: pose.depth };
      })
      // Paint the right/background panels first; left/foreground panels overlap them.
      .sort((a, b) => a.depth - b.depth);
    const key = order.map((item) => item.index).join(",");
    if (key !== previousOrder && order[0]) {
      const parent = order[0].node.parentElement!;
      for (const { node } of order) parent.appendChild(node);
      previousOrder = key;
    }
  };
}
