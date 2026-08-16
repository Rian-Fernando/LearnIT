/**
 * Frequently asked questions.
 *
 * This section exists for two reasons, and both matter.
 *
 * For a human, it answers the questions a visitor actually has after watching
 * the narrative — what is this, who is it for, can I try it, is the content
 * real — without making them read the About page.
 *
 * For an answer engine, it is the most quotable block on the site. The text
 * here is byte-identical to the `FAQPage` JSON-LD in `structured-data.tsx`,
 * which is what Google requires: FAQ markup must reflect content visible on the
 * page. Keep the two in sync when either changes.
 *
 * Rendered as a description list rather than an accordion so every answer is in
 * the DOM at load — collapsed content is worth much less to a crawler, and
 * there are only six of them.
 */

export const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is learnIT?",
    answer:
      "learnIT is an onboarding, training, and knowledge platform built for a university IT Help Desk. New technicians use it as a structured curriculum for their first weeks on the job, experienced technicians use it as a fast reference while assisting a caller, and Help Desk leadership uses it to keep documented procedures current without needing a developer.",
  },
  {
    question: "Who is learnIT for?",
    answer:
      "learnIT is built for three groups: new Help Desk employees learning the role, experienced Help Desk technicians who need to find a procedure in seconds during a support call, and Help Desk administrators who maintain the documentation, training modules, and troubleshooting workflows.",
  },
  {
    question: "Is learnIT free to use, and do I need an account?",
    answer:
      "The public demo is free and requires no account. It contains a sanitised, entirely fictional version of the platform so anyone can explore how it works. The full application, which holds internal Help Desk procedures, requires an authenticated staff account.",
  },
  {
    question: "How does learnIT keep Help Desk documentation from going out of date?",
    answer:
      "Every record displays when it was last reviewed and by whom. Any technician can flag a page as outdated in one click, which creates a review item for Help Desk leadership. The admin console surfaces procedures that have not been reviewed in over four months and highlights any page flagged by more than one person, since independent reports about the same page are the strongest signal that something has drifted.",
  },
  {
    question: "How does authentication and access control work in learnIT?",
    answer:
      "learnIT has no password field and no user table. Authentication is delegated to an external identity provider over OpenID Connect, currently Google and Microsoft Entra ID, and a user's role is derived from directory group membership or a configured allowlist rather than asserted by the browser. Visibility filtering happens inside the content repository rather than in individual pages, so a page that fails to check permissions still cannot serve internal documentation.",
  },
  {
    question: "What technology is learnIT built with?",
    answer:
      "learnIT is built with Next.js using the App Router, React, and TypeScript in strict mode, styled with Tailwind CSS v4. The landing page uses Three.js and React Three Fiber for a scroll-driven narrative. Content is typed data validated by Zod at build time, search runs client-side with MiniSearch, and sessions and OpenID Connect tokens are handled with jose. It is deployed on Vercel.",
  },
];

export function LandingFaq() {
  return (
    <section
      data-surface="cinematic"
      aria-labelledby="faq-heading"
      className="relative border-t border-white/[0.07] bg-[#0a0b09]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/40">
              Questions
            </p>
            <h2
              id="faq-heading"
              className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white"
            >
              What learnIT is, plainly
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              The short version, for anyone deciding whether to look further.
            </p>
          </div>

          <dl className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {FAQS.map((faq) => (
              <div key={faq.question} className="py-6 first:pt-8">
                <dt className="text-base font-medium leading-7 text-white">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-white/55">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
