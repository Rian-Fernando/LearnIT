/**
 * Quick-response template handling.
 *
 * Templates use `{{token}}` placeholders. Tokens are discovered by parsing the
 * template rather than trusting the declared `placeholders` array — an author
 * who adds a token to the text but forgets to declare it still gets a working
 * field, instead of a message going out with `{{ticket_ref}}` visible in it.
 *
 * Declared metadata is used when present to supply a proper label and example.
 */

export interface ResolvedPlaceholder {
  key: string;
  label: string;
  example?: string;
  /** True when the author declared it; false when inferred from the template. */
  declared: boolean;
}

const TOKEN = /\{\{\s*([a-z][a-z0-9_]*)\s*\}\}/g;

/**
 * Placeholders every template gets for free. `name` is the requester,
 * `tech_name` is the signed-in technician — both are so common that requiring
 * every author to declare them would just be noise.
 */
export const GLOBAL_PLACEHOLDERS: Record<string, { label: string; example?: string }> = {
  name: { label: "Requester's name", example: "Alex" },
  tech_name: { label: "Your name" },
};

export function extractTokens(template: string): string[] {
  const found: string[] = [];
  for (const match of template.matchAll(TOKEN)) {
    const key = match[1]!;
    if (!found.includes(key)) found.push(key);
  }
  return found;
}

export function resolvePlaceholders(
  template: string,
  declared: { key: string; label: string; example?: string }[],
): ResolvedPlaceholder[] {
  const byKey = new Map(declared.map((entry) => [entry.key, entry]));

  return extractTokens(template).map((key) => {
    const match = byKey.get(key);
    if (match) {
      return {
        key,
        label: match.label,
        ...(match.example ? { example: match.example } : {}),
        declared: true,
      };
    }

    const global = GLOBAL_PLACEHOLDERS[key];
    if (global) {
      return {
        key,
        label: global.label,
        ...(global.example ? { example: global.example } : {}),
        declared: true,
      };
    }

    return { key, label: humanise(key), declared: false };
  });
}

/** Substitute values, leaving unfilled tokens visible so nothing ships blank. */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(TOKEN, (whole, key: string) => {
    const value = values[key]?.trim();
    return value ? value : whole;
  });
}

/** Which tokens are still unfilled — used to warn before copying. */
export function unfilledTokens(
  template: string,
  values: Record<string, string>,
): string[] {
  return extractTokens(template).filter((key) => !values[key]?.trim());
}

function humanise(key: string): string {
  const words = key.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
