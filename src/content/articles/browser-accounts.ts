import type { Article } from "@/lib/content/schema";

export const browserAccountArticles: Article[] = [
  {
    slug: "student-work-account-browser-conflict",
    title: "Student account and work account browser conflict",
    summary:
      "A user with both a student and an employee account often cannot sign into the second one because the browser is already holding the first. Recognising this saves a long, fruitless account investigation.",
    category: "accounts",
    tags: ["accounts", "browser", "chrome", "sign-in", "multi-account"],
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    featured: true,
    related: ["chrome-profiles-guide", "account-types-overview"],
    body: [
      {
        type: "paragraph",
        text: "This one is easy to misdiagnose. The user reports that they cannot sign into their work account. Their password is fine, the account is fine, and nothing is broken — the browser is simply already signed into their student account and the existing session is getting in the way.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The tell",
        text: "The user holds **both** a student and an employee account, and the account that fails is the one they use less often. If both of those are true, check this before investigating the account itself.",
      },
      { type: "heading", level: 2, text: "Immediate workaround" },
      {
        type: "paragraph",
        text: "Ask them to open a **private or incognito window** and sign in there.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Have them open an incognito or private window",
            detail: "It starts with no saved sessions, so nothing is competing.",
          },
          {
            title: "Sign into the work account there",
          },
          {
            title: "If it works, you have your answer",
            detail:
              "The account is fine. The conflict was the existing browser session, and you can now offer the real fix.",
          },
          {
            title: "If it still fails, this is not the cause",
            detail:
              "Move on and troubleshoot the account itself — you have usefully ruled something out.",
          },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Incognito is a diagnostic, not the fix",
        text: "It proves what is wrong. Telling someone to use a private window every day is not a solution — it loses their bookmarks, their sessions, and their patience.",
      },
      { type: "heading", level: 2, text: "The actual fix: separate Chrome profiles" },
      {
        type: "paragraph",
        text: "A Chrome profile is a separate browser workspace. One for the student account, one for the work account, each with its own sessions, bookmarks, history, and settings — so the two never collide again.",
      },
      {
        type: "fields",
        items: [
          { label: "Student profile", value: "Coursework, student email, student systems." },
          { label: "Work profile", value: "Employee email, work systems, department resources." },
        ],
      },
      { type: "articleRef", slug: "chrome-profiles-guide", note: "The step-by-step guide to send them." },
      { type: "principle", id: "verify-the-account" },
    ],
  },

  {
    slug: "chrome-profiles-guide",
    title: "Setting up a second Chrome profile",
    summary:
      "A walkthrough for a user who needs to keep a student account and a work account separate in the same browser.",
    category: "software",
    tags: ["chrome", "browser", "profiles", "multi-account"],
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    featured: false,
    related: ["student-work-account-browser-conflict"],
    body: [
      {
        type: "callout",
        tone: "warning",
        title: "Chrome's interface changes",
        text: "Google moves these controls between versions. Describe what the user is looking for rather than reading exact menu labels at them, and if what they see does not match, ask them to describe it instead of insisting.",
      },
      {
        type: "steps",
        items: [
          { title: "Open Chrome" },
          {
            title: "Find the profile control",
            detail:
              "Usually the avatar or circular icon in the top-right corner, beside the address bar.",
          },
          {
            title: "Choose the option to add a profile",
            detail: "Worded as 'Add' or 'Add profile' in most versions.",
          },
          {
            title: "Give it a meaningful name",
            detail:
              "'Work' and 'Student' beat 'Person 1' and 'Person 2' — the point is telling them apart at a glance.",
          },
          {
            title: "Sign into the appropriate Adelphi account in that profile",
          },
          {
            title: "Use each profile for its own workspace from then on",
            detail:
              "Each keeps its own sessions, bookmarks, history, and settings.",
          },
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Never ask for their password",
        text: "The user signs in themselves. You walk them through where to click and nothing else — you should never see or hear a password at any point in this.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Worth mentioning",
        text: "Profiles can be given different colours and pinned to the taskbar or dock separately, which makes it much harder to end up in the wrong one by accident.",
      },
      {
        type: "placeholder",
        label: "Chrome profile screenshots",
        needs: [
          "Sanitised screenshots of the profile control and the add-profile dialog",
          "Confirmation of current Chrome wording",
        ],
        owner: "Rian Fernando",
      },
      { type: "principle", id: "protect-user-information" },
    ],
  },
];
