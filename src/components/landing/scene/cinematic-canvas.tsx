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
  /**
   * Unmounting the canvas entirely, rather than only pausing it.
   *
   * Pausing the render loop stops the CPU cost but keeps the WebGL context
   * alive, and a context holds a framebuffer and the whole scene in GPU memory
   * for as long as it exists. On a machine running twenty Chrome tabs that is
   * real memory held by a tab nobody is looking at.
   *
   * Dropping the canvas when the tab is hidden releases the context; React
   * rebuilds it on return, which costs a few milliseconds nobody perceives
   * because they were not looking at it.
   */
  const [tabVisible, setTabVisible] = useState(true);

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

  // Release the WebGL context when the tab goes to the background.
  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  if (failed) return null;

  // The host div stays mounted so layout never shifts; only the canvas goes.
  return (
    <div ref={hostRef} className={className} aria-hidden>
      {!tabVisible || !visible ? null : (
      <Canvas
        frameloop="always"
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
          // Cap the drawing buffer on very large displays. Beyond this the
          // extra pixels are invisible on a soft particle field but the
          // framebuffer cost is real.
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        }}
        // If WebGL context creation throws, drop the canvas rather than
        // rendering a broken frame. The narrative still reads without it.
        onError={() => setFailed(true)}
      >
        <NetworkField progressRef={progressRef} quality={quality} />
      </Canvas>
      )}
    </div>
  );
}
