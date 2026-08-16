import type { Taxonomy } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * Footprints option lists
 * ---------------------------------------------------------------------------
 * These belong to Adelphi's Footprints configuration, not to learnIT. They are
 * held as content so an administrator can correct them when Footprints changes,
 * without a developer or a deploy.
 *
 * Provenance matters here, so each list records:
 *   • where the Help Desk actually sets it (`source`)
 *   • whether an authorised source has confirmed it (`verification`)
 *   • whether the list is known to be partial (`complete`)
 *
 * Several lists below were read from a screenshot of a scrollable dropdown and
 * are therefore genuinely incomplete. They are marked as such and the interface
 * says so — a truncated list presented as authoritative is worse than no list,
 * because a technician will believe the value they need simply does not exist.
 */
export const taxonomies: Taxonomy[] = [
  {
    key: "footprints-templates",
    label: "Footprints ticket templates",
    description:
      "Templates available from the 'Use selected template' dropdown at the top of a new Footprints issue. Selecting one pre-fills the issue information, description, and often the assignees, so choosing the right template is usually the first decision on a ticket.",
    source: "Footprints → New Issue for IT → template dropdown (top right)",
    verification: "needs-review",
    complete: false,
    missing:
      "The dropdown scrolls past 'Account Disabled for Security'. The remaining entries below that point still need to be captured, along with which templates the Help Desk is actually expected to use versus those owned by other teams.",
    options: [
      { value: "eplanner-access", label: "ePlanner Access" },
      { value: "eplanner-support-training", label: "ePlanner Support and Training" },
      { value: "saas-account-request", label: "SAAS Account Request" },
      { value: "add-to-as-employee", label: "Add to AS (Employee)" },
      { value: "add-to-as-student", label: "Add to AS (Student)" },
      { value: "employee-info-change", label: "Employee Info Change" },
      {
        value: "alumni-account",
        label: "Alumni Account",
        note: "Used for the alumni re-enablement workflow. Generates related subtickets after saving.",
      },
      { value: "event", label: "Event" },
      { value: "phishing-received", label: "Phishing Received" },
      { value: "google-fac-adm-staff-storage", label: "Google Fac_Adm_staff Storage Limits" },
      {
        value: "guest-auig-account",
        label: "Guest AUig Account",
        note: "Used for the guest account workflow.",
      },
      { value: "saas-password-reset", label: "SAAS Password Reset" },
      { value: "graduate-assistantship-access", label: "Graduate Assistantship Access" },
      { value: "equipment-move", label: "Equipment Move" },
      { value: "mfa-roll-out-issue", label: "MFA Roll Out Issue" },
      { value: "project-request", label: "Project Request" },
      { value: "departmental-move", label: "Departmental Move" },
      { value: "dorm-service-call", label: "Dorm Service Call" },
      { value: "am-exclusive-printer", label: "AM Exclusive Printer" },
      { value: "hardware-expansion", label: "Hardware Expansion" },
      { value: "google-student-storage", label: "Google Student Storage Limits" },
      { value: "allocation-letter", label: "Allocation Letter" },
      { value: "malware-inspection", label: "Malware Inspection" },
      { value: "missing-stolen-equip", label: "Missing/Stolen Equip" },
      { value: "new-computer-request", label: "New Computer Request" },
      { value: "new-hire-pc-phone", label: "New Hire PC/Phone" },
      { value: "pc-inventory", label: "PC Inventory" },
      { value: "info-comm-assistance", label: "Info Comm Assistance" },
      { value: "wifi-connect-tshoot", label: "WiFi Connect T-Shoot" },
      { value: "information-request", label: "Information Request" },
      { value: "department-gmail", label: "Department Gmail" },
      { value: "web-update", label: "Web Update" },
      { value: "nf-onboarding-template", label: "NF Onboarding Template" },
      { value: "bcp-laptop-equipment-request", label: "BCP Laptop Equipment Request" },
      { value: "it-student-offboarding", label: "IT Student Off-boarding" },
      { value: "windows-11-upgrade", label: "Windows 11 Upgrade" },
      { value: "coolsign", label: "Coolsign" },
      { value: "classroom-training-request", label: "Classroom Training Request" },
      { value: "account-disabled-for-security", label: "Account Disabled for Security" },
    ],
  },

  {
    key: "footprints-categories",
    label: "Footprints categories",
    description:
      "The Category field on the Issue Information tab. Category is marked required, and choosing it can change which team the ticket routes to — so it is part of troubleshooting, not paperwork.",
    source: "Footprints → New Issue for IT → Issue Information → Category",
    verification: "unverified",
    complete: false,
    missing:
      "The full category list has not been provided. Only 'Multimedia' is known, from the classroom workflow. The dropdown showed 'Make a Selection' with no options expanded, so nothing else could be read from the screenshot.",
    options: [
      {
        value: "multimedia",
        label: "Multimedia",
        note: "Used for classroom technology issues. May affect the assignee automatically.",
      },
    ],
  },

  {
    key: "footprints-subcategories",
    label: "Footprints subcategories",
    description:
      "The subcategory that accompanies a category, where one applies. Should correspond to the actual issue rather than the closest convenient option.",
    source: "Footprints → New Issue for IT → Issue Information",
    verification: "unverified",
    complete: false,
    missing: "No subcategory values have been provided yet for any category.",
    options: [],
  },

  {
    key: "footprints-assignee-groups",
    label: "Assignee groups",
    description:
      "Workspace members available in the Assignees panel. Groups are prefixed with '+' in Footprints. Correct assignment is part of correct troubleshooting — a well-written ticket sent to the wrong team still fails the user.",
    source: "Footprints → New Issue for IT → Assignees and Notifications → Workspace Members",
    verification: "needs-review",
    complete: false,
    missing:
      "The Workspace Members list is scrollable and only the first ten entries were visible. The remainder still need capturing, along with which group handles which issue type — particularly the TSS / Lab Consultant entries used by the classroom workflow.",
    options: [
      {
        value: "customer-experience",
        label: "+Customer Experience",
        note: "The default assignee for general Help Desk issues.",
      },
      { value: "administrative-systems", label: "+Administrative Systems" },
      { value: "application-integration-services", label: "+Application Integration Services" },
      { value: "ccap", label: "+CCAP" },
      { value: "cio", label: "+CIO" },
      { value: "campus-event", label: "+Campus Event" },
      { value: "collaborative-apps-task-force", label: "+Collaborative Apps Task Force" },
      { value: "commencement", label: "+Commencement" },
      {
        value: "communications",
        label: "+Communications",
        note: "Present on some templates by default. The classroom workflow requires removing it before saving so the notification reaches TSS instead.",
      },
      { value: "communications-project", label: "+Communications Project" },
      { value: "contract", label: "+Contract" },
    ],
  },

  {
    key: "footprints-inquiry",
    label: "Inquiry (contact channel)",
    description:
      "How the request reached the Help Desk. Recorded on the Issue Information tab.",
    source: "Footprints → New Issue for IT → Issue Information → Inquiry",
    verification: "needs-review",
    complete: false,
    missing:
      "Only 'Phone' was visible as the default selection. The remaining options — presumably email, walk-in, chat, and similar — still need confirming.",
    options: [{ value: "phone", label: "Phone", note: "The default selection." }],
  },

  {
    key: "footprints-priority",
    label: "Priority",
    description: "Ticket priority. Defaults to Medium on a new issue.",
    source: "Footprints → New Issue for IT → Priority",
    verification: "needs-review",
    complete: false,
    missing:
      "Only the default value 'Medium' was visible. The full range and the rules for when to raise priority still need confirming.",
    options: [{ value: "medium", label: "Medium", note: "The default on a new issue." }],
  },

  {
    key: "footprints-status",
    label: "Status",
    description: "Ticket status. Defaults to Open on a new issue.",
    source: "Footprints → New Issue for IT → Status",
    verification: "needs-review",
    complete: false,
    missing:
      "Only the default value 'Open' was visible. The closure and in-progress values still need confirming.",
    options: [{ value: "open", label: "Open", note: "The default on a new issue." }],
  },

  {
    key: "footprints-division",
    label: "Division",
    description: "Required field on the Issue Information tab. Defaults to OITR.",
    source: "Footprints → New Issue for IT → Issue Information → Division",
    verification: "needs-review",
    complete: false,
    missing:
      "Only the default 'OITR' was visible, and it is unclear whether Help Desk staff ever change it.",
    options: [{ value: "oitr", label: "OITR", note: "The default selection." }],
  },

  {
    key: "footprints-location-of-work",
    label: "Location of Work To Be Done",
    description:
      "Where the work physically needs to happen. Footprints states on the form that this is REQUIRED for all classroom and physical hardware issues.",
    source: "Footprints → New Issue for IT → Issue Information → Location Of Work To Be Done",
    verification: "needs-review",
    complete: false,
    missing:
      "The building list has not been captured. This list also supplies the building abbreviations used at the start of a classroom ticket title, so it is worth completing early.",
    options: [],
  },

  {
    key: "transfer-directory",
    label: "Common transfers and extensions",
    description:
      "The departments the Help Desk most often transfers callers to, with their extensions. Knowing these prevents the 'let me find that number' pause that makes a transfer feel like a brush-off.",
    source: "Help Desk operational knowledge",
    verification: "unverified",
    complete: false,
    missing:
      "No transfer destinations or extensions have been provided yet. One Stop is referenced in the alumni workflow but its extension is not recorded.",
    options: [],
  },
];
