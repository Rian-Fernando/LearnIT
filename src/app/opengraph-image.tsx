import { ImageResponse } from "next/og";

/**
 * Social preview card.
 *
 * Rendered to a real PNG at build time by `next/og` — social platforms and
 * several answer engines will not render SVG, so this must be raster. 1200×630
 * is the size every platform crops from cleanly.
 *
 * Drawn with layout primitives rather than an image asset so it stays in sync
 * with the palette and needs no binary in the repository.
 */

export const alt =
  "learnIT — onboarding, training, and knowledge platform for a university IT Help Desk";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0a0b09";
const LIME = "#c7f04a";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Hairline grid, matching the site's hero treatment. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            display: "flex",
          }}
        />
        {/* Accent bloom behind the wordmark. */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -120,
            width: 760,
            height: 620,
            background:
              "radial-gradient(circle at center, rgba(199,240,74,0.16), rgba(199,240,74,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: LIME,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              display: "flex",
            }}
          >
            Help Desk Platform
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div
              style={{
                fontSize: 132,
                fontWeight: 700,
                letterSpacing: -5,
                color: "#ffffff",
                display: "flex",
              }}
            >
              learn
            </div>
            <div
              style={{
                fontSize: 132,
                fontWeight: 700,
                letterSpacing: -3,
                color: LIME,
                display: "flex",
              }}
            >
              IT
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 34,
              lineHeight: 1.3,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 900,
              display: "flex",
            }}
          >
            Learn the tools. Understand the workflow. Support the community.
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 24,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.42)",
              maxWidth: 860,
              display: "flex",
            }}
          >
            Structured onboarding for new Help Desk technicians, and a reference
            fast enough to search while someone is on the line.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {["Knowledge Base", "Troubleshoot", "Training", "Practice"].map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 21,
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 21, color: LIME, display: "flex" }}>
            rianfernando.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
