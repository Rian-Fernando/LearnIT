"use client";

import { useActionState } from "react";
import { Loader2, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Surface } from "@/components/ui/primitives";
import type { ImportantLink } from "@/lib/content/schema";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { resetLink, updateLink, type ActionResult } from "./actions";

/**
 * Important links editor.
 *
 * This is the highest-value editable surface in the platform. Articles
 * reference links by key rather than embedding URLs, so when a system moves,
 * one field here updates every article, the dashboard, and every troubleshooting
 * outcome that points at it.
 *
 * Placeholder links (`#`) are called out prominently — an unconfigured link
 * renders as a visible "awaiting configuration" notice to technicians, and that
 * should be embarrassing enough to get fixed.
 */
export function LinksEditor({ links }: { links: ImportantLink[] }) {
  const unconfigured = links.filter((link) => link.href === "#");

  return (
    <div className="space-y-6">
      {unconfigured.length > 0 ? (
        <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3.5">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          <p className="text-sm leading-6 text-secondary">
            <span className="font-medium text-warning">
              {unconfigured.length} link{unconfigured.length === 1 ? " is" : "s are"} not
              configured.
            </span>{" "}
            Technicians see an &ldquo;awaiting configuration&rdquo; notice wherever these
            appear. Set the real addresses below.
          </p>
        </div>
      ) : null}

      <ul className="space-y-3">
        {links.map((link) => (
          <LinkRow key={link.key} link={link} />
        ))}
      </ul>
    </div>
  );
}

function LinkRow({ link }: { link: ImportantLink }) {
  const [saveResult, save, saving] = useActionState<ActionResult | null, FormData>(
    updateLink,
    null,
  );
  const [resetResult, revert, reverting] = useActionState<ActionResult | null, FormData>(
    resetLink,
    null,
  );

  const result = saveResult ?? resetResult;
  const unset = link.href === "#";

  return (
    <li>
      <Surface className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-tertiary">{link.key}</span>
          <Badge tone="neutral">{CATEGORY_LABELS[link.category]}</Badge>
          {link.visibility === "staff" ? <Badge tone="signal">Internal</Badge> : null}
          {link.pinned ? <Badge tone="accent">Pinned to dashboard</Badge> : null}
          {unset ? <Badge tone="warning">Not configured</Badge> : null}
        </div>

        <form action={save} className="space-y-3">
          <input type="hidden" name="key" value={link.key} />

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              id={`${link.key}-label`}
              name="label"
              label="Label"
              defaultValue={link.label}
              maxLength={80}
              required
            />
            <Field
              id={`${link.key}-href`}
              name="href"
              label="Address"
              defaultValue={unset ? "" : link.href}
              placeholder="https://…"
              maxLength={500}
              hint="An https:// address, or a path starting with /"
            />
          </div>

          <Field
            id={`${link.key}-description`}
            name="description"
            label="Description"
            defaultValue={link.description}
            maxLength={200}
            required
            hint="Shown beneath the link wherever it appears"
          />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
              Save
            </Button>

            <Button
              type="submit"
              size="sm"
              variant="ghost"
              form={`revert-${link.key}`}
              disabled={reverting}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Revert
            </Button>

            {result ? (
              <p
                role="status"
                className={`text-sm ${result.ok ? "text-success" : "text-danger"}`}
              >
                {result.message}
              </p>
            ) : null}
          </div>
        </form>

        {/* Separate form so "Revert" does not submit the edited fields. */}
        <form id={`revert-${link.key}`} action={revert} className="hidden">
          <input type="hidden" name="key" value={link.key} />
        </form>
      </Surface>
    </li>
  );
}

function Field({
  id,
  name,
  label,
  defaultValue,
  placeholder,
  maxLength,
  required,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-secondary">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="mt-1.5 h-9 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong"
      />
      {hint ? <p className="mt-1 text-xs text-tertiary">{hint}</p> : null}
    </div>
  );
}
