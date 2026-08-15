/**
 * Point-cloud formations.
 *
 * The scene is a single persistent set of points. Each act computes a target
 * arrangement for those same points, and the render loop interpolates between
 * consecutive targets as the visitor scrolls. Nothing is created or destroyed
 * mid-scroll, which is what keeps the transition continuous — a node that was a
 * "student" in act two is still the same node when it snaps into the lattice in
 * act four. That continuity is the whole point of the metaphor.
 *
 * Every formation writes into a flat Float32Array of xyz triples.
 */

export const POINT_COUNT_DESKTOP = 2600;
export const POINT_COUNT_MODEST = 1400;

/** Deterministic PRNG so the composition is identical on every load. */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

type Writer = (out: Float32Array, count: number) => void;

/* -------------------------------------------------------------------------- */
/* 01 — Scatter: an unmapped ecosystem. Sparse, deep, disconnected.            */
/* -------------------------------------------------------------------------- */

const scatter: Writer = (out, count) => {
  const random = makeRandom(9001);
  for (let i = 0; i < count; i++) {
    // Rejection-free spherical distribution, biased outward so the centre
    // stays empty — there is nothing at the middle yet.
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const r = 9 + Math.pow(random(), 0.55) * 16;
    const planar = Math.sqrt(1 - u * u);

    out[i * 3 + 0] = Math.cos(theta) * planar * r;
    out[i * 3 + 1] = u * r * 0.55;
    out[i * 3 + 2] = Math.sin(theta) * planar * r;
  }
};

/* -------------------------------------------------------------------------- */
/* 02 — Converge: everything routes through one point.                        */
/* -------------------------------------------------------------------------- */

const converge: Writer = (out, count) => {
  const random = makeRandom(4242);
  // Radial spokes feeding a dense core: the Help Desk as the junction every
  // request passes through.
  const spokes = 14;

  for (let i = 0; i < count; i++) {
    const core = i < count * 0.16;

    if (core) {
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const r = Math.pow(random(), 0.7) * 2.2;
      const planar = Math.sqrt(1 - u * u);
      out[i * 3 + 0] = Math.cos(theta) * planar * r;
      out[i * 3 + 1] = u * r;
      out[i * 3 + 2] = Math.sin(theta) * planar * r;
      continue;
    }

    const spoke = i % spokes;
    const angle = (spoke / spokes) * Math.PI * 2 + random() * 0.09;
    // Cluster density increases toward the hub.
    const along = Math.pow(random(), 1.5);
    const distance = 3 + along * 15;
    const drift = (random() - 0.5) * (1.1 + along * 2.6);

    out[i * 3 + 0] = Math.cos(angle) * distance + drift;
    out[i * 3 + 1] = (random() - 0.5) * (1.4 + along * 3.2);
    out[i * 3 + 2] = Math.sin(angle) * distance + drift;
  }
};

/* -------------------------------------------------------------------------- */
/* 03 — Complex: many systems, each its own cluster, no shared structure.     */
/* -------------------------------------------------------------------------- */

/** Cluster anchors, also used to place the floating system labels. */
export const SYSTEM_ANCHORS: [number, number, number][] = [
  [-13, 4.5, -3],
  [12.5, 5.2, 1],
  [-9, -5.4, 5],
  [10, -4.8, -5],
  [0, 7.6, -8],
  [-16, 0.4, 6],
  [15.5, -0.6, 5],
  [2.5, -7.4, 7],
  [-3.5, 1.6, -13],
];

const complex: Writer = (out, count) => {
  const random = makeRandom(777);
  const clusters = SYSTEM_ANCHORS.length;

  for (let i = 0; i < count; i++) {
    const anchor = SYSTEM_ANCHORS[i % clusters]!;
    // Loose, uneven clouds — deliberately messy. This act is about overload.
    const spread = 2.4 + random() * 2.2;
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const planar = Math.sqrt(1 - u * u);
    const r = Math.pow(random(), 0.6) * spread;

    out[i * 3 + 0] = anchor[0] + Math.cos(theta) * planar * r;
    out[i * 3 + 1] = anchor[1] + u * r;
    out[i * 3 + 2] = anchor[2] + Math.sin(theta) * planar * r;
  }
};

/* -------------------------------------------------------------------------- */
/* 04 — Lattice: the same nodes, now ordered.                                 */
/* -------------------------------------------------------------------------- */

const lattice: Writer = (out, count) => {
  const random = makeRandom(31337);
  // A structured shell — order emerging from the same material, not new material.
  const columns = 26;
  const rows = Math.ceil(count / columns);

  for (let i = 0; i < count; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    const angle = (col / columns) * Math.PI * 2;
    const radius = 11.5;
    const height = (row / Math.max(rows - 1, 1) - 0.5) * 15;

    // A gentle waist gives the cylinder some shape without becoming decorative.
    const taper = 1 - Math.pow(Math.abs(height) / 8.4, 2) * 0.22;
    const jitter = 0.055;

    out[i * 3 + 0] =
      Math.cos(angle) * radius * taper + (random() - 0.5) * jitter;
    out[i * 3 + 1] = height + (random() - 0.5) * jitter;
    out[i * 3 + 2] =
      Math.sin(angle) * radius * taper + (random() - 0.5) * jitter;
  }
};

/* -------------------------------------------------------------------------- */
/* 05 — Interface: the lattice unrolls into a plane of cards.                 */
/* -------------------------------------------------------------------------- */

const interfacePlane: Writer = (out, count) => {
  const random = makeRandom(2024);
  // Five panels standing in for the five product areas, arranged as an
  // interface would be. The environment becoming the application.
  const panels = 5;
  const panelWidth = 6.4;
  const panelHeight = 8.4;
  const gap = 1.5;
  const totalWidth = panels * panelWidth + (panels - 1) * gap;

  for (let i = 0; i < count; i++) {
    const panel = i % panels;
    const left = -totalWidth / 2 + panel * (panelWidth + gap);

    // Denser along panel edges so the rectangles read as forms rather than fog.
    const edge = random() < 0.42;
    let x: number;
    let y: number;

    if (edge) {
      const side = Math.floor(random() * 4);
      const t = random();
      if (side === 0) {
        x = left + t * panelWidth;
        y = panelHeight / 2;
      } else if (side === 1) {
        x = left + t * panelWidth;
        y = -panelHeight / 2;
      } else if (side === 2) {
        x = left;
        y = (t - 0.5) * panelHeight;
      } else {
        x = left + panelWidth;
        y = (t - 0.5) * panelHeight;
      }
    } else {
      x = left + random() * panelWidth;
      y = (random() - 0.5) * panelHeight;
    }

    out[i * 3 + 0] = x;
    out[i * 3 + 1] = y;
    // A shallow depth stagger keeps the parallax alive without breaking the plane.
    out[i * 3 + 2] = (random() - 0.5) * 0.9 - panel * 0.15;
  }
};

/* -------------------------------------------------------------------------- */

const WRITERS: Record<string, Writer> = {
  scatter,
  converge,
  complex,
  lattice,
  interface: interfacePlane,
};

/**
 * Build every formation once, up front. This is a few milliseconds of work at
 * mount and removes all allocation from the render loop.
 */
export function buildFormations(
  names: readonly string[],
  count: number,
): Float32Array[] {
  return names.map((name) => {
    const buffer = new Float32Array(count * 3);
    const writer = WRITERS[name] ?? scatter;
    writer(buffer, count);
    return buffer;
  });
}

/**
 * Connection pairs for the network lines.
 *
 * Chosen once, against the *converge* formation, so the lines describe
 * meaningful relationships (spoke → hub) rather than arbitrary proximity. The
 * same index pairs are then reused across every formation, which is what makes
 * the network appear to reorganise rather than be replaced.
 */
export function buildConnections(
  positions: Float32Array,
  count: number,
  maxSegments: number,
): Uint32Array {
  const random = makeRandom(5150);
  const pairs: number[] = [];
  // Hub candidates: the dense core written first by `converge`.
  const hubCount = Math.max(8, Math.floor(count * 0.16));

  for (let i = hubCount; i < count && pairs.length < maxSegments * 2; i++) {
    // Only a sample of nodes get a line — a fully connected graph reads as
    // noise, not structure.
    if (random() > 0.34) continue;

    const ax = positions[i * 3]!;
    const ay = positions[i * 3 + 1]!;
    const az = positions[i * 3 + 2]!;

    // Link to the nearest of a few random hub nodes, which produces the
    // radial spoke pattern without an O(n²) search.
    let best = -1;
    let bestDistance = Infinity;
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = Math.floor(random() * hubCount);
      const dx = positions[candidate * 3]! - ax;
      const dy = positions[candidate * 3 + 1]! - ay;
      const dz = positions[candidate * 3 + 2]! - az;
      const distance = dx * dx + dy * dy + dz * dz;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    }

    if (best >= 0) pairs.push(i, best);
  }

  return new Uint32Array(pairs);
}
