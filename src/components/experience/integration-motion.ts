const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  // Continuous acceleration at both ends avoids a visible kick between phases.
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const INTEGRATION_COLUMNS = [
  { prefix: "rear-left", index: 3, className: "capability-rear-column" },
  { prefix: "rear-middle", index: 4, className: "capability-rear-column" },
  { prefix: "rear-right", index: 5, className: "capability-rear-column" },
  { prefix: "satellite", index: 2, className: "capability-satellite-tower" },
  { prefix: "tower", index: 1, className: "capability-secondary-tower" },
] as const;

export function integrationColumn(kind: string) {
  const column = INTEGRATION_COLUMNS.find((item) =>
    kind.startsWith(`${item.prefix}-`),
  );
  return column
    ? { index: column.index, feature: kind.slice(column.prefix.length + 1) }
    : null;
}

/** Section 03 owns its columns and staggered bridges; the shelf stack ends in 02. */
export function integrationFrame(progress: number) {
  const p = clamp(progress);
  return {
    yaw: mix(123, 139, smooth(p / 0.7)),
    pitch: mix(24, 20, smooth(p)),
    zoom: 1.15,
    unfold: smooth(p / 0.42),
  };
}

export function integrationTower(index: number, progress: number) {
  const p = clamp(progress);
  const unfold = integrationFrame(p).unfold;
  if (index >= 3) {
    const columns = [
      {
        x: -15,
        z: -120,
        radius: 28,
        height: 245,
        bottom: 165,
        travel: -70,
        start: 0.16,
      },
      {
        x: -135,
        z: -15,
        radius: 35,
        height: 215,
        bottom: 145,
        travel: -55,
        start: 0.24,
      },
      {
        x: -205,
        z: 5,
        radius: 30,
        height: 285,
        bottom: 180,
        travel: -85,
        start: 0.32,
      },
    ];
    const column = columns[index - 3];
    const bottom =
      column.bottom + column.travel * smooth((p - column.start) / 0.65);
    return {
      x: column.x,
      z: column.z,
      radius: column.radius,
      top: bottom - column.height,
      bottom,
      opacity: 0.86 * smooth((p - column.start) / 0.28),
    };
  }
  if (index === 1) {
    const bottom = mix(-150, -15, smooth((p - 0.43) / 0.5));
    return {
      x: 100,
      z: -70,
      radius: 72,
      // A rigid column descends from above the frame; it does not grow from the floor.
      top: bottom - 340,
      bottom,
      opacity: smooth((p - 0.43) / 0.14),
    };
  }
  if (index === 2) {
    const top = mix(-70, -35, smooth((p - 0.63) / 0.32));
    return {
      x: 175,
      z: -90,
      radius: 26,
      top,
      bottom: top + 135,
      opacity: 0.72 * smooth((p - 0.57) / 0.2),
    };
  }
  const rise = smooth(p / 0.18);
  const descend = smooth((p - 0.18) / 0.38);
  const settle = smooth((p - 0.65) / 0.35);
  return {
    x: mix(0, -16, unfold),
    z: mix(0, -18, unfold),
    radius: mix(116, 55, smooth(p / 0.22)),
    top: -60 - 130 * rise + 180 * descend - 28 * settle,
    bottom: 180 - 28 * settle,
    opacity: 1,
  };
}

export function integrationBridge(index: number, progress: number) {
  const entrance = smooth((progress - 0.04 - index * 0.03) / 0.18);
  return {
    x: -145 - index * 14,
    z: -110 + index * 95,
    y: -110 + index * 110 + 24 * (1 - entrance),
    thickness: 52,
    width: 100 + index * 12,
    depth: 56,
    opacity: entrance,
  };
}
