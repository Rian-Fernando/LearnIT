import { ImageResponse } from "next/og";

/**
 * Home-screen icon for iOS.
 *
 * Larger than the favicon, so the full wordmark fits. Same placeholder status —
 * see `icon.tsx`.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0b09",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#ffffff", letterSpacing: -2 }}>
            learn
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#c7f04a", letterSpacing: -1 }}>
            IT
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            width: 44,
            height: 3,
            borderRadius: 2,
            background: "#c7f04a",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
