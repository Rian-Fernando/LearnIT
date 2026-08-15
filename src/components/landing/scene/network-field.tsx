"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FORMATIONS } from "../story";
import {
  POINT_COUNT_DESKTOP,
  POINT_COUNT_MODEST,
  buildConnections,
  buildFormations,
} from "./formations";

/**
 * The network field.
 *
 * One point cloud and one set of line segments, morphing between formations as
 * the visitor scrolls. Everything that changes per frame is written directly
 * into typed arrays — there is no React state in the loop and no allocation
 * after mount.
 *
 * Points use additive blending with a soft radial falloff, which reads as glow
 * without a postprocessing pass. That is a deliberate trade: a bloom pipeline
 * would cost another full-screen render and two more dependencies for an effect
 * this scene can get from the material.
 */

const VERTEX_SHADER = /* glsl */ `
  uniform float uSize;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute float aPhase;
  attribute float aTone;

  varying float vAlpha;
  varying float vTone;

  void main() {
    vec3 transformed = position;

    // A slow, per-point drift. Amplitude falls away as the scene resolves into
    // order — chaotic early, still by the time the lattice forms.
    float calm = 1.0 - smoothstep(0.45, 0.85, uProgress);
    float wobble = sin(uTime * 0.5 + aPhase * 6.2831) * 0.16 * calm;
    transformed.y += wobble;
    transformed.x += cos(uTime * 0.38 + aPhase * 6.2831) * 0.12 * calm;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Perspective size attenuation.
    float dist = max(-mvPosition.z, 0.001);
    gl_PointSize = uSize * aScale * uPixelRatio * (14.0 / dist);

    // Fade with depth so the far field recedes instead of speckling.
    vAlpha = smoothstep(46.0, 9.0, dist) * (0.45 + aScale * 0.55);

    // Twinkle: subtle, low frequency, never distracting.
    vAlpha *= 0.82 + 0.18 * sin(uTime * 1.1 + aPhase * 12.566);

    vTone = aTone;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorCore;
  uniform vec3 uColorAccent;
  uniform float uAccentMix;

  varying float vAlpha;
  varying float vTone;

  void main() {
    // Soft radial falloff — this is what produces the glow.
    vec2 offset = gl_PointCoord - vec2(0.5);
    float d = length(offset);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.0, d);
    float halo = pow(core, 3.0);

    vec3 color = mix(uColorCore, uColorAccent, clamp(vTone * uAccentMix, 0.0, 1.0));

    gl_FragColor = vec4(color, (halo * 0.9 + core * 0.25) * vAlpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

/** Smoothstep-style ease used for formation blending. */
function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

export function NetworkField({
  progressRef,
  quality,
}: {
  progressRef: React.MutableRefObject<number>;
  quality: "high" | "modest";
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  const count = quality === "high" ? POINT_COUNT_DESKTOP : POINT_COUNT_MODEST;

  const data = useMemo(() => {
    const formations = buildFormations(FORMATIONS, count);

    // Live buffer the shader reads — starts at formation 0.
    const positions = new Float32Array(formations[0]!);

    // Per-point static attributes.
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const tones = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // A small number of brighter nodes gives the field a sense of hierarchy.
      scales[i] = i % 23 === 0 ? 1.9 + Math.random() * 0.9 : 0.42 + Math.random() * 0.62;
      phases[i] = Math.random();
      tones[i] = Math.random();
    }

    const connections = buildConnections(
      formations[1]!, // pairs are chosen against the "converge" arrangement
      count,
      quality === "high" ? 520 : 260,
    );
    const linePositions = new Float32Array(connections.length * 3);

    return { formations, positions, scales, phases, tones, connections, linePositions };
  }, [count, quality]);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 26 },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 },
      uColorCore: { value: new THREE.Color("#cfd6e4") },
      uColorAccent: { value: new THREE.Color("#e89f2c") },
      uAccentMix: { value: 0 },
    }),
    [],
  );

  // Smoothed progress: scroll input is stepped (especially with a trackpad),
  // and the camera should never inherit that jitter.
  const smoothed = useRef(0);

  useFrame((state, delta) => {
    const target = progressRef.current;
    // Frame-rate independent damping.
    const lerpFactor = 1 - Math.pow(0.0016, Math.min(delta, 0.1));
    smoothed.current += (target - smoothed.current) * lerpFactor;
    const p = smoothed.current;

    const { formations, positions, connections, linePositions } = data;

    /* ---- morph between the two formations flanking current progress ---- */
    const segments = formations.length - 1;
    const scaled = Math.min(p * segments, segments - 0.0001);
    const index = Math.floor(scaled);
    const blend = ease(scaled - index);

    const from = formations[index]!;
    const to = formations[index + 1]!;

    for (let i = 0; i < positions.length; i++) {
      positions[i] = from[i]! + (to[i]! - from[i]!) * blend;
    }

    const geometry = pointsRef.current?.geometry;
    if (geometry) {
      geometry.attributes.position!.needsUpdate = true;
    }

    /* ---- rebuild line segments from the live point positions ---- */
    for (let i = 0; i < connections.length; i++) {
      const point = connections[i]!;
      linePositions[i * 3 + 0] = positions[point * 3 + 0]!;
      linePositions[i * 3 + 1] = positions[point * 3 + 1]!;
      linePositions[i * 3 + 2] = positions[point * 3 + 2]!;
    }
    const lineGeometry = linesRef.current?.geometry;
    if (lineGeometry) {
      lineGeometry.attributes.position!.needsUpdate = true;
    }

    /* ---- narrative-driven material response ---- */
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value = p;
    uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 2);
    // Warmth arrives with learnIT: the field shifts from cold data to brand gold
    // exactly as the story turns from problem to product.
    uniforms.uAccentMix.value = THREE.MathUtils.smoothstep(p, 0.52, 0.86);

    if (lineMaterialRef.current) {
      // Connections are the point of act two, fade back during the overload of
      // act three, and disappear once structure replaces ad-hoc linkage.
      const rise = THREE.MathUtils.smoothstep(p, 0.08, 0.28);
      const fall = 1 - THREE.MathUtils.smoothstep(p, 0.42, 0.72);
      lineMaterialRef.current.opacity = rise * fall * 0.3;
    }

    /* ---- camera: a single continuous move, not per-act cuts ---- */
    const camera = state.camera;
    const orbit = p * Math.PI * 0.52;
    const radius = 34 - p * 12;

    camera.position.x = Math.sin(orbit) * radius * 0.34;
    camera.position.y = 2.6 - p * 1.4 + Math.sin(state.clock.elapsedTime * 0.22) * 0.28;
    camera.position.z = Math.cos(orbit) * radius;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute attach="attributes-aScale" args={[data.scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
          <bufferAttribute attach="attributes-aTone" args={[data.tones, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.linePositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color="#7f93b5"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
