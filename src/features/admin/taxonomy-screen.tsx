import { AlertTriangle } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, Surface } from "@/components/ui/primitives";
import { VerificationBadge } from "@/components/content/verification-badge";
import { listTaxonomies } from "@/lib/content/repository";

/**
 * Footprints option lists.
 *
 * These belong to Adelphi's systems rather than to learnIT, and they change
 * without notice. Holding them as content means an administrator corrects them
 * here rather than filing a ticket against a developer.
 *
 * The incomplete markers matter as much as the values: several lists were read
 * from a screenshot of a scrollable dropdown, and a truncated list presented as
 * authoritative would have a technician conclude the value they need does not
 * exist.
 */
export async function TaxonomyScreen() {
  const taxonomies = await listTaxonomies();
  const incomplete = taxonomies.filter((t) => !t.complete);

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Admin console"
        title="Option lists"
        description="Footprints categories, templates, assignee groups, and the other dropdown values learnIT references. Held as content so they can be corrected without a deploy."
      />

      {incomplete.length > 0 ? (
        <div className="mb-8 flex gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-warning">
              {incomplete.length} of {taxonomies.length} lists are incomplete
            </p>
            <p className="mt-1 text-sm leading-6 text-secondary">
              Each is marked below with what is still missing. Training content that
              depends on an incomplete list carries a placeholder rather than
              presenting the partial list as the full set.
            </p>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {taxonomies.map((taxonomy) => (
          <Surface key={taxonomy.key} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-medium text-primary">{taxonomy.label}</h2>
              <VerificationBadge verification={taxonomy.verification} />
              {taxonomy.complete ? (
                <Badge tone="success">Complete</Badge>
              ) : (
                <Badge tone="warning">Incomplete</Badge>
              )}
              <span className="tabular ml-auto text-xs text-tertiary">
                {taxonomy.options.length}{" "}
                {taxonomy.options.length === 1 ? "value" : "values"}
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-secondary">
              {taxonomy.description}
            </p>
            <p className="mt-2 font-mono text-xs text-tertiary">{taxonomy.source}</p>

            {taxonomy.missing ? (
              <p className="mt-3 border-l-2 border-warning/40 pl-3 text-sm leading-6 text-tertiary">
                <span className="font-medium text-warning">Still missing: </span>
                {taxonomy.missing}
              </p>
            ) : null}

            {taxonomy.options.length > 0 ? (
              <ul className="mt-4 space-y-1.5">
                {taxonomy.options.map((option) => (
                  <li
                    key={option.value}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-subtle pt-1.5 text-sm"
                  >
                    <span className="font-medium text-primary">{option.label}</span>
                    <span className="font-mono text-xs text-tertiary">{option.value}</span>
                    {option.note ? (
                      <span className="w-full text-sm leading-6 text-tertiary">
                        {option.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed border-default px-4 py-3 text-sm text-tertiary">
                No values recorded yet.
              </p>
            )}
          </Surface>
        ))}
      </div>
    </PageContainer>
  );
}
