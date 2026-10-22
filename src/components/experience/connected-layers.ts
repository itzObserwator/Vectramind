/** Section 02: scaffold → open shelves → single pressed plate → rising stack.
 * These camera stops follow the supplied video; all values interpolate on scroll.
 * The final stack is handed to stack-chip-transition.ts before section 03.
 */
const stops = [
  {
    at: 0,
    yaw: 0,
    pitch: 48,
    zoom: 0.74,
    radius: 175,
    gap: 83,
    thickness: 7,
    x: 55,
    y: 45,
  },
  {
    at: 0.11,
    yaw: 31,
    pitch: 16,
    zoom: 0.94,
    radius: 175,
    gap: 83,
    thickness: 7,
    x: 24,
    y: 45,
  },
  {
    at: 0.24,
    yaw: 86,
    pitch: 3,
    zoom: 1,
    radius: 175,
    gap: 83,
    thickness: 7,
    x: 32,
    y: 48,
  },
  {
    at: 0.49,
    yaw: 133,
    pitch: 27,
    zoom: 1.04,
    radius: 175,
    gap: 78,
    thickness: 8,
    x: 35,
    y: 45,
  },
  {
    at: 0.66,
    yaw: 142,
    pitch: 29,
    zoom: 1.18,
    radius: 160,
    gap: 0,
    thickness: 8,
    x: 35,
    y: 55,
  },
  {
    at: 0.73,
    yaw: 142,
    pitch: 29,
    zoom: 1.18,
    radius: 160,
    gap: 0,
    thickness: 8,
    x: 35,
    y: 55,
  },
  {
    at: 0.88,
    yaw: 132,
    pitch: 26,
    zoom: 1.18,
    radius: 137,
    gap: 28,
    thickness: 22,
    x: 14,
    y: 16,
  },
  {
    at: 1,
    yaw: 123,
    pitch: 24,
    zoom: 1.15,
    radius: 116,
    gap: 40,
    thickness: 29,
    x: 0,
    y: 0,
  },
] as const;

export function connectedLayerFrame(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const end = stops.findIndex((stop) => stop.at >= p);
  const a = stops[Math.max(0, end - 1)];
  const b = stops[Math.max(0, end)];
  const t = a === b ? 0 : (p - a.at) / (b.at - a.at);
  // Shape-preserving cubic interpolation carries velocity through each stop.
  // Only actual direction changes pause; intermediate camera stops do not.
  const lerp = (key: Exclude<keyof typeof a, "at">) => {
    if (a === b) return a[key];
    const slope = (index: number) => {
      if (index === 0 || index === stops.length - 1) return 0;
      const before = stops[index - 1];
      const current = stops[index];
      const after = stops[index + 1];
      const left = (current[key] - before[key]) / (current.at - before.at);
      const right = (after[key] - current[key]) / (after.at - current.at);
      return left * right <= 0 ? 0 : (2 * left * right) / (left + right);
    };
    const duration = b.at - a.at;
    return (
      (2 * t ** 3 - 3 * t ** 2 + 1) * a[key] +
      (t ** 3 - 2 * t ** 2 + t) * duration * slope(end - 1) +
      (-2 * t ** 3 + 3 * t ** 2) * b[key] +
      (t ** 3 - t ** 2) * duration * slope(end)
    );
  };
  return {
    yaw: lerp("yaw"),
    pitch: lerp("pitch"),
    zoom: lerp("zoom"),
    radius: lerp("radius"),
    gap: lerp("gap"),
    thickness: lerp("thickness"),
    x: lerp("x"),
    y: lerp("y"),
  };
}

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** The circuit scaffold arrives before the solid shelf material. */
export function connectedShelfOpacity(index: number, progress: number) {
  const reveal = smooth((progress - 0.015 - index * 0.012) / 0.12);
  // Coincident faces must read as one physical slab, not six overpainted sheets.
  const separation =
    progress > 0.73
      ? Math.abs(100 - connectedShelfY(index, progress))
      : connectedLayerFrame(progress).gap;
  return reveal * (index === 5 ? 1 : smooth(separation / 8));
}

/** The bottom shelf anchors the press; the remaining shelves then rise from it. */
export function connectedShelfY(index: number, progress: number) {
  if (progress >= 0.73) {
    // The cap lifts first and the remaining shelves follow it upward.
    const delay = index * 0.014;
    const lift = smooth((progress - 0.73 - delay) / (0.27 - delay));
    return 100 - (5 - index) * 40 * lift;
  }
  const camera = connectedLayerFrame(progress);
  const anchor = smooth((progress - 0.49) / 0.17);
  const centered = (index - 2.5) * camera.gap;
  const rising = 100 - (5 - index) * camera.gap;
  return centered + (rising - centered) * anchor;
}

/** A smaller cap develops as the pressed slab becomes an ascending stack. */
export function connectedShelfRadius(
  index: number,
  radius: number,
  progress: number,
) {
  return (
    radius * (index === 0 ? 1 - 0.24 * smooth((progress - 0.73) / 0.27) : 1)
  );
}

/** Circuits gather, descend into the press, then join the rising shelves. */
export function connectedCircuitPose(index: number, progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const camera = connectedLayerFrame(p);
  const gather = smooth((p - 0.28) / 0.3);
  const openY = (index - 2) * camera.gap;
  const gatheredY = -65 + (index - 2.5) * 7;
  const clusterY = openY + (gatheredY - openY) * gather;
  const press = smooth((p - 0.55) / 0.11);
  return {
    y: clusterY + (100 - clusterY) * press,
    radius: 67 - 9 * gather,
    // Change the hidden circuits into open shelf traces before they reappear.
    join: smooth((p - 0.66) / 0.16),
    opacity: 1 - smooth((p - 0.58) / 0.08) + smooth((p - 0.88) / 0.12),
  };
}
