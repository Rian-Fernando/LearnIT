"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { NetworkField } from "./network-field";

/**
 * WebGL host for the landing scene.
 *
 * Responsibilities beyond mounting the canvas:
 *   • pause rendering entirely when the canvas is scrolled out of view
 *   • cap device pixel ratio — a 3× retina display does not need 3× the
 *     fragment work for a soft particle field
 *   • fall back silently if context creation fails
 *
 * The canvas is `aria-hidden` and non-interactive. Every word of the narrative
 * lives in real DOM above it, so the story is fully available to screen readers,
 * to search engines, and to anyone who selects the text.
 */
export function CinematicCanvas({
  progressRef,
  className,
}: {
  progressRef: React.RefObject<number>;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const [quality, setQuality] = useState<"high" | "modest">("high");

  // Stop the render loop when the scene is off screen. The landing page is
  // followed by ordinary content, and there is no reason to keep shading a
  // canvas nobody can see.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { threshold: 0 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  // A coarse capability signal. `deviceMemory` is not universally available,
  // so this only ever downgrades on positive evidence of a modest device.
  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    if ((memory && memory <= 4) || (cores && cores <= 4)) setQuality("modest");
  }, []);

  if (failed) return null;

  return (
    <div ref={hostRef} className={className} aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 46, near: 0.1, far: 200, position: [0, 2.6, 34] }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        // If WebGL context creation throws, drop the canvas rather than
        // rendering a broken frame. The narrative still reads without it.
        onError={() => setFailed(true)}
      >
        <NetworkField progressRef={progressRef} quality={quality} />
      </Canvas>
    </div>
  );
}
