import { ImageResponse } from "next/og";

/**
 * Browser tab icon.
 *
 * The "IT" half of the wordmark, which is the part that stays legible at 32px —
 * "learnIT" in full is illegible at this size, and the lime on near-black reads
 * clearly in both light and dark browser chrome.
 *
 * Placeholder pending the final logo. Replacing it means dropping an
 * `icon.png` (or `.svg`) into `src/app/` and deleting this file; nothing else
 * references it.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0b09",
          borderRadius: 7,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -0.5,
          color: "#c7f04a",
          fontFamily: "monospace",
        }}
      >
        IT
      </div>
    ),
    size,
  );
}
