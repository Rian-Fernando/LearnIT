import type { QuickResponse } from "@/lib/content/schema";

/**
 * Copy-ready responses.
 *
 * These live here — as content — rather than inside components, so leadership
 * can revise wording without a code change. `{{placeholder}}` tokens are
 * surfaced as fill-in fields in the UI, which is what stops a message going out
 * with an unreplaced token in it.
 *
 * Wording below is illustrative and should be reviewed by Help Desk leadership
 * before use with real requesters. See docs/content.md.
 */
export const responses: QuickResponse[] = [
  {
    slug: "office-hours",
    title: "Help Desk hours",
    summary: "Standard reply for questions about when the Help Desk is available.",
    category: "general",
    channel: "any",
    tags: ["hours", "availability", "general"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-01",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    verification: "unverified",
    usage:
      "Use for straightforward availability questions. If the person has an urgent problem outside hours, address the problem first — do not answer with hours alone.",
    placeholders: [
      { key: "weekday_hours", label: "Weekday hours", example: "8:00 AM – 8:00 PM" },
      { key: "weekend_hours", label: "Weekend hours", example: "10:00 AM – 4:00 PM" },
    ],
    template: `Hi {{name}},

Thanks for reaching out. The Help Desk is available:

• Monday to Friday: {{weekday_hours}}
• Saturday and Sunday: {{weekend_hours}}

You can also submit a request at any time through the ticketing portal, and we will pick it up when we next open.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "remote-session-invite",
    title: "Remote support session invitation",
    summary:
      "Sets up a remote session, including the consent language that should always accompany it.",
    category: "remote-support",
    channel: "email",
    tags: ["remote-support", "consent", "session"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-09",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    verification: "unverified",
    usage:
      "Send before connecting, never after. The consent paragraph is not optional — do not trim it to make the message shorter.",
    placeholders: [
      { key: "session_link", label: "Session link", example: "(from the remote support console)" },
      { key: "time_window", label: "Time window", example: "the next 30 minutes" },
    ],
    template: `Hi {{name}},

To help with this, I would like to connect to your computer remotely so I can see what you are seeing. You can join here:

{{session_link}}

Before we start, a few things worth knowing:

• I will only be able to see your screen once you accept the connection.
• Please close anything personal — email, banking, or private documents — before accepting.
• You can end the session at any moment, for any reason.
• Please stay at your computer for the whole session.

I am available for {{time_window}}. If that does not work, reply with a better time and I will send a fresh link.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "it-meeting-room",
    title: "IT support meeting room",
    summary:
      "Shares the standing video meeting room used when screen sharing is needed but remote control is not.",
    category: "remote-support",
    channel: "any",
    tags: ["remote-support", "video", "screen-share"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-22",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    usage:
      "Good for walking someone through something on their own screen. Use the remote session invitation instead when you need to take control.",
    placeholders: [
      { key: "room_link", label: "Meeting room link", example: "(from Important Links)" },
    ],
    template: `Hi {{name}},

Let's take a look at this together. You can join the IT support meeting room here:

{{room_link}}

Once you are in, you can share your screen and walk me through what you are seeing. I will stay on until we have it sorted.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "konica-redirect",
    title: "Konica device redirect",
    summary:
      "Explains that Konica multifunction devices are vendor-serviced, and gives the user a clear next step.",
    category: "printing",
    channel: "any",
    tags: ["printing", "konica", "scope", "vendor"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-05",
    updatedBy: "Help Desk Leadership",
    revision: 5,
    verification: "unverified",
    usage:
      "Use as soon as a Konica device is confirmed. Log the ticket even though it is out of scope — volume data is the point.",
    placeholders: [
      { key: "device_location", label: "Device location", example: "the third-floor copy room" },
    ],
    template: `Hi {{name}},

Thanks for letting us know. The multifunction copier in {{device_location}} is a Konica device, which is serviced directly by the vendor under a support agreement rather than by the Help Desk — so they will be able to get to it much faster than we could.

The service contact number is on the sticker on the front of the device. It is worth having the model and serial number handy when you call, as both are on the same sticker.

If you need something printed before that is resolved, let me know and I will point you to the nearest supported printer.

I have logged this so we have a record of it.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "vpn-first-contact",
    title: "VPN — first contact information request",
    summary:
      "Collects the details that make a VPN ticket actionable, without a phone call.",
    category: "vpn",
    channel: "email",
    tags: ["vpn", "triage", "information"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-06",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    verification: "unverified",
    usage:
      "Use when a VPN report arrives with too little detail. Asking all of it at once avoids a three-day exchange of single questions.",
    placeholders: [],
    template: `Hi {{name}},

Happy to help get this working. So I can narrow it down quickly, could you let me know:

1. What are you trying to reach when the VPN is connected? (Some services do not need the VPN at all, so this is worth checking first.)
2. What exactly happens — does the client fail to open, fail to sign in, or connect and then drop?
3. What is the exact wording of any error message?
4. What kind of computer is it, and is it university-issued or personal?
5. Does it fail on every network, or only one? If you can, try a phone hotspot — that tells us a lot.

Once I have those I should be able to point us straight at the cause.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "password-reset-guidance",
    title: "Password reset guidance",
    summary: "Directs a user to self-service reset with the details that prevent a second contact.",
    category: "accounts",
    channel: "any",
    tags: ["accounts", "password", "self-service"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-04",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    verification: "unverified",
    usage:
      "Only after identity verification. Never include a password or a one-time code in this message.",
    placeholders: [
      { key: "portal_link", label: "Self-service portal link", example: "(from Important Links)" },
    ],
    template: `Hi {{name}},

You can reset your password yourself here:

{{portal_link}}

A couple of things that trip people up:

• Make sure you can access your recovery method before you begin — the reset cannot complete without it.
• After you change it, any device that has the old password saved (phones, tablets, mail apps) will keep trying it and can lock the account again. Update those right after.

Once you have reset it, try signing in to your email to confirm it worked. If anything does not go as expected, reply here and I will pick it straight up.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "alumni-account-transition",
    title: "Alumni account transition",
    summary:
      "Explains to a recent graduate why their access changed, without promising anything that is not ours to grant.",
    category: "accounts",
    channel: "email",
    tags: ["accounts", "alumni", "graduation"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-28",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    verification: "unverified",
    usage:
      "Confirm the account really has transitioned before sending. Fill in specifics — a vague version of this message generates a reply asking the same question again.",
    placeholders: [
      { key: "retained_services", label: "Services retained", example: "your alumni email address" },
      { key: "ended_services", label: "Services ended", example: "library database access and campus file storage" },
    ],
    template: `Hi {{name}},

Congratulations on graduating. What you are seeing is expected rather than a fault: after graduation, accounts move from student access to alumni access, and that changes what is available.

With your alumni account you keep {{retained_services}}. {{ended_services}} are part of student access and end with it.

This is set by university policy rather than something the Help Desk can adjust, but if you need something specific for a particular reason, tell me what it is and I will point you to the right office.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "ticket-follow-up",
    title: "Ticket follow-up",
    summary: "Checks in on an open ticket in a way that actually prompts a reply.",
    category: "ticketing",
    channel: "email",
    tags: ["ticketing", "follow-up"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-02",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    usage:
      "Name the specific thing you are waiting on. A generic “just checking in” is the reason follow-ups get ignored.",
    placeholders: [
      { key: "ticket_ref", label: "Ticket reference", example: "HD-10482" },
      { key: "pending_item", label: "What you need", example: "the exact error message from the VPN client" },
    ],
    template: `Hi {{name}},

Following up on ticket {{ticket_ref}}.

I still need {{pending_item}} before I can move this forward. Once you send that over I will pick it straight back up.

If the issue has resolved itself in the meantime, just reply and let me know and I will close the ticket out.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "escalation-acknowledgement",
    title: "Escalation acknowledgement",
    summary:
      "Tells a user their issue has moved to another team, and sets an honest expectation about what happens next.",
    category: "ticketing",
    channel: "email",
    tags: ["escalation", "ticketing", "expectations"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-02",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    verification: "unverified",
    usage:
      "Send at the moment you escalate, not later. Do not commit to a resolution time on another team's behalf.",
    placeholders: [
      { key: "ticket_ref", label: "Ticket reference", example: "HD-10482" },
      { key: "team_name", label: "Receiving team", example: "the Network team" },
    ],
    template: `Hi {{name}},

I have passed ticket {{ticket_ref}} to {{team_name}}, who own this system and are better placed to resolve it.

Everything we have established so far has gone with it, so you will not need to repeat any of it. They will contact you directly, and the ticket stays open until it is resolved.

If anything changes on your end in the meantime, reply here and it will reach them.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "resolved-confirmation",
    title: "Resolution confirmation",
    summary: "Closes a ticket while leaving the door open, and records what was actually done.",
    category: "ticketing",
    channel: "email",
    tags: ["ticketing", "closure"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-02",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    usage: "Always state what was changed. “It's fixed” is not a record.",
    placeholders: [
      { key: "ticket_ref", label: "Ticket reference", example: "HD-10482" },
      { key: "what_was_done", label: "What was done", example: "cleared a stuck job at the head of the print queue and reinstalled the printer" },
    ],
    template: `Hi {{name}},

Good news — {{ticket_ref}} is resolved.

What I did: {{what_was_done}}.

I will close the ticket now, but if the same thing happens again just reply to this message and it will reopen with all the history intact, so you will not have to start over.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "out-of-scope-general",
    title: "Out of scope — general redirect",
    summary:
      "For requests the Help Desk does not handle. Firm about the boundary, genuinely useful about the next step.",
    category: "general",
    channel: "any",
    tags: ["scope", "redirect"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-20",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    usage:
      "Only send when you can name the correct destination. Redirecting someone to “another department” without saying which is worse than not answering.",
    placeholders: [
      { key: "correct_owner", label: "Correct team or office", example: "the Registrar's Office" },
      { key: "owner_contact", label: "How to reach them", example: "registrar@example.edu" },
    ],
    template: `Hi {{name}},

Thanks for getting in touch. This one sits with {{correct_owner}} rather than the Help Desk — they handle it directly and will be able to sort it out much faster than a hand-off through us.

You can reach them at: {{owner_contact}}

If you get stuck or are not sure you have reached the right person, come back to me and I will help you find the right contact.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "information-request-generic",
    title: "General information request",
    summary:
      "A structured way to ask for the details a ticket is missing, without sounding like a form.",
    category: "general",
    channel: "email",
    tags: ["triage", "information"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-20",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    usage: "Trim to the questions you actually need. Five questions get answered; twelve do not.",
    placeholders: [],
    template: `Hi {{name}},

Happy to help. So I can get to the bottom of this quickly, could you tell me:

1. What exactly happens, and what you expected to happen instead?
2. The exact wording of any error message.
3. When it started, and whether anything changed around that time.
4. What kind of device you are on, and whether it is university-issued or personal.
5. Whether it happens on other devices or networks.

Screenshots are always welcome if it is easier to show than describe.

Best regards,
{{tech_name}}
University Help Desk`,
  },
  {
    slug: "after-hours-escalation-internal",
    title: "After-hours escalation note (internal)",
    summary:
      "Internal template for handing an issue to on-call coverage outside Help Desk hours.",
    category: "ticketing",
    channel: "any",
    tags: ["escalation", "internal", "after-hours"],
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-08",
    updatedBy: "Help Desk Leadership",
    revision: 1,
    verification: "unverified",
    usage:
      "Internal use only — never send this to a requester. Attach it to the ticket when handing over to on-call.",
    placeholders: [
      { key: "ticket_ref", label: "Ticket reference", example: "HD-10482" },
      { key: "impact", label: "Impact summary", example: "single user, cannot submit a deadline-bound assignment" },
      { key: "attempted", label: "What was already tried", example: "self-service reset, hotspot test, client reinstall" },
      { key: "availability", label: "Requester availability", example: "reachable after 3pm weekdays" },
      { key: "callback", label: "Callback preference", example: "mobile, text first" },
      { key: "verified", label: "Verified facts", example: "web sign-in works; MFA approved; fails on home network only" },
      { key: "next_step", label: "Recommended next step", example: "confirm whether the home router blocks the VPN protocol" },
      { key: "handover_time", label: "Handover time", example: "19:40" },
    ],
    template: `AFTER-HOURS HANDOVER — {{ticket_ref}}

Impact: {{impact}}
Already attempted: {{attempted}}
Requester availability: {{availability}}
Callback preference: {{callback}}

Verified facts:
- {{verified}}

Recommended next step:
- {{next_step}}

Handed over by {{tech_name}} at {{handover_time}}.`,
  },
];
