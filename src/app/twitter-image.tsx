/**
 * Twitter/X card.
 *
 * X honours `summary_large_image` at the same 1200×630 as Open Graph, so this
 * reuses the identical renderer rather than maintaining a second design that
 * would inevitably drift.
 */
export { default, alt, size, contentType } from "./opengraph-image";
