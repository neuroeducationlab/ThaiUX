/**
 * Source registry — every reference cited anywhere on UXLab.
 *
 * UXLab text is an original synthesis; these links point readers to the
 * originals for depth. URLs were checked against each publisher's index
 * on 2 Oct 2026 (see docs/process/05-content-plan.md).
 */

export type SourceKind = "article" | "guideline" | "standard" | "book" | "course" | "tool";

export interface Source {
  title: string;
  publisher: string;
  url: string;
  kind: SourceKind;
  author?: string;
}

const s = <T extends Record<string, Source>>(x: T) => x;

export const sources = s({
  // — Nielsen Norman Group (UX research organisation) —
  "nng-heuristics": { title: "10 Usability Heuristics for User Interface Design", publisher: "Nielsen Norman Group", author: "Jakob Nielsen", url: "https://www.nngroup.com/articles/ten-usability-heuristics/", kind: "article" },
  "nng-usability-101": { title: "Usability 101: Introduction to Usability", publisher: "Nielsen Norman Group", author: "Jakob Nielsen", url: "https://www.nngroup.com/articles/usability-101-introduction-to-usability/", kind: "article" },
  "nng-ux-definition": { title: "The Definition of User Experience (UX)", publisher: "Nielsen Norman Group", author: "Don Norman & Jakob Nielsen", url: "https://www.nngroup.com/articles/definition-user-experience/", kind: "article" },
  "nng-what-is-ux": { title: "What Is User Experience (and What Is It Not)?", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/what-is-user-experience/", kind: "article" },
  "nng-ux-vs-ui": { title: "UX vs. UI (Video)", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/videos/ux-vs-ui/", kind: "article" },
  "nng-visibility": { title: "Visibility of System Status (Usability Heuristic #1)", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/visibility-system-status/", kind: "article" },
  "nng-clickable": { title: "Beyond Blue Links: Making Clickable Elements Recognizable", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/clickable-elements/", kind: "article" },
  "nng-flat-ui": { title: "Flat UI Elements Attract Less Attention and Cause Uncertainty", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/", kind: "article" },
  "nng-button-states": { title: "Button States: Communicate Interaction", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/button-states-communicate-interaction/", kind: "article" },
  "nng-tooltips": { title: "Tooltip Guidelines", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/tooltip-guidelines/", kind: "article" },
  "nng-info-tips": { title: "Why So Many Info Tips Are Bad (and How to Make Them Better)", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/info-tips-bad/", kind: "article" },
  "nng-hover-timing": { title: "Timing Guidelines for Exposing Hidden Content", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/timing-exposing-content/", kind: "article" },
  "nng-modal": { title: "Modal & Nonmodal Dialogs: When (& When Not) to Use Them", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/modal-nonmodal-dialog/", kind: "article" },
  "nng-popups": { title: "Popups: 10 Problematic Trends and Alternatives", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/popups/", kind: "article" },
  "nng-listbox-dropdown": { title: "Listboxes vs. Dropdown Lists", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/listbox-dropdown/", kind: "article" },
  "nng-dropdowns": { title: "Dropdowns: Design Guidelines", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/drop-down-menus/", kind: "article" },
  "nng-radio-checkbox": { title: "Checkboxes vs. Radio Buttons", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/", kind: "article" },
  "nng-toggle": { title: "Toggle-Switch Guidelines", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/toggle-switch-guidelines/", kind: "article" },
  "nng-drag-drop": { title: "Drag–and–Drop: How to Design for Ease of Use", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/drag-drop/", kind: "article" },
  "nng-direct-manipulation": { title: "Direct Manipulation: Definition", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/direct-manipulation/", kind: "article" },
  "nng-scrolling-attention": { title: "Scrolling and Attention", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/scrolling-and-attention/", kind: "article" },
  "nng-scrollbars": { title: "Scrolling and Scrollbars", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/scrolling-and-scrollbars/", kind: "article" },
  "nng-scrolljacking": { title: "Scrolljacking 101", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/scrolljacking-101/", kind: "article" },
  "nng-infinite-scroll": { title: "Infinite Scrolling: When to Use It, When to Avoid It", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/infinite-scrolling-tips/", kind: "article" },
  "nng-horizontal-scroll": { title: "Beware Horizontal Scrolling and Mimicking Swipe on Desktop", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/horizontal-scrolling/", kind: "article" },
  "nng-placeholders": { title: "Placeholders in Form Fields Are Harmful", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/form-design-placeholders/", kind: "article" },
  "nng-web-forms": { title: "Website Forms Usability: Top 10 Recommendations", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/web-form-design/", kind: "article" },
  "nng-form-errors": { title: "10 Design Guidelines for Reporting Errors in Forms", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/errors-forms-design-guidelines/", kind: "article" },
  "nng-hostile-errors": { title: "Hostile Patterns in Error Messages", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/hostile-error-messages/", kind: "article" },
  "nng-progress": { title: "Progress Indicators Make a Slow System Less Insufferable", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/progress-indicators/", kind: "article" },
  "nng-skeleton": { title: "Skeleton Screens 101", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/skeleton-screens/", kind: "article" },
  "nng-response-times": { title: "Response Times: The 3 Important Limits", publisher: "Nielsen Norman Group", author: "Jakob Nielsen", url: "https://www.nngroup.com/articles/response-times-3-important-limits/", kind: "article" },
  "nng-microinteractions": { title: "Microinteractions in User Experience", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/microinteractions/", kind: "article" },
  "nng-card-sorting": { title: "Card Sorting: Uncover Users' Mental Models", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/card-sorting-definition/", kind: "article" },
  "nng-card-vs-tree": { title: "Card Sorting vs. Tree Testing", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/card-sorting-tree-testing-differences/", kind: "article" },
  "nng-ia-study-guide": { title: "Information Architecture: Study Guide", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/ia-study-guide/", kind: "article" },
  "nng-ia-vs-sitemaps": { title: "Information Architecture vs. Sitemaps", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/information-architecture-sitemaps/", kind: "article" },
  "nng-journeys-flows": { title: "User Journeys vs. User Flows", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/user-journeys-vs-user-flows/", kind: "article" },
  "nng-mobile-nav": { title: "Basic Patterns for Mobile Navigation: A Primer", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/mobile-navigation-patterns/", kind: "article" },
  "nng-hamburger": { title: "Hamburger Menus and Hidden Navigation Hurt UX Metrics", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/hamburger-menus/", kind: "article" },
  "nng-wizards": { title: "Wizards: Definition and Design Recommendations", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/wizards/", kind: "article" },
  "nng-visual-hierarchy": { title: "Visual Hierarchy in UX: Definition", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/", kind: "article" },
  "nng-visual-principles": { title: "5 Principles of Visual Design in UX", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/principles-visual-design/", kind: "article" },
  "nng-fidelity": { title: "UX Prototypes: Low Fidelity vs. High Fidelity", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/", kind: "article" },
  "nng-pain-points": { title: "Three Levels of Pain Points in Customer Experience", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/pain-points/", kind: "article" },
  "nng-need-statements": { title: "User Need Statements: The 'Define' Stage in Design Thinking", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/user-need-statements/", kind: "article" },
  "nng-research-methods": { title: "When to Use Which User-Experience Research Methods", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/which-ux-research-methods/", kind: "article" },
  "nng-usability-testing": { title: "Usability (User) Testing 101", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/usability-testing-101/", kind: "article" },
  "nng-five-users": { title: "Why You Only Need to Test with 5 Users", publisher: "Nielsen Norman Group", author: "Jakob Nielsen", url: "https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/", kind: "article" },
  "nng-heuristic-evaluation": { title: "How to Conduct a Heuristic Evaluation", publisher: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/", kind: "article" },

  // — W3C Web Accessibility Initiative (standards body) —
  "wai-intro": { title: "Introduction to Web Accessibility", publisher: "W3C Web Accessibility Initiative", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/", kind: "guideline" },
  "wai-principles": { title: "Accessibility Principles", publisher: "W3C Web Accessibility Initiative", url: "https://www.w3.org/WAI/fundamentals/accessibility-principles/", kind: "guideline" },
  "wai-designing": { title: "Designing for Web Accessibility", publisher: "W3C Web Accessibility Initiative", url: "https://www.w3.org/WAI/tips/designing/", kind: "guideline" },
  "wai-inclusion": { title: "Accessibility, Usability, and Inclusion", publisher: "W3C Web Accessibility Initiative", url: "https://www.w3.org/WAI/fundamentals/accessibility-usability-inclusion/", kind: "guideline" },
  wcag22: { title: "Web Content Accessibility Guidelines (WCAG) 2.2", publisher: "W3C", url: "https://www.w3.org/TR/WCAG22/", kind: "standard" },
  "wcag-contrast": { title: "Understanding SC 1.4.3: Contrast (Minimum)", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html", kind: "standard" },
  "wcag-non-text-contrast": { title: "Understanding SC 1.4.11: Non-text Contrast", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html", kind: "standard" },
  "wcag-hover-focus": { title: "Understanding SC 1.4.13: Content on Hover or Focus", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html", kind: "standard" },
  "wcag-keyboard": { title: "Understanding SC 2.1.1: Keyboard", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html", kind: "standard" },
  "wcag-focus-order": { title: "Understanding SC 2.4.3: Focus Order", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html", kind: "standard" },
  "wcag-focus-visible": { title: "Understanding SC 2.4.7: Focus Visible", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html", kind: "standard" },
  "wcag-focus-appearance": { title: "Understanding SC 2.4.13: Focus Appearance", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html", kind: "standard" },
  "wcag-pointer-gestures": { title: "Understanding SC 2.5.1: Pointer Gestures", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html", kind: "standard" },
  "wcag-dragging": { title: "Understanding SC 2.5.7: Dragging Movements", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html", kind: "standard" },
  "wcag-target-size": { title: "Understanding SC 2.5.8: Target Size (Minimum)", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html", kind: "standard" },
  "wcag-error-identification": { title: "Understanding SC 3.3.1: Error Identification", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html", kind: "standard" },
  "wcag-status-messages": { title: "Understanding SC 4.1.3: Status Messages", publisher: "W3C WCAG 2.2", url: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html", kind: "standard" },
  "apg-dialog": { title: "Dialog (Modal) Pattern", publisher: "W3C ARIA Authoring Practices Guide", url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/", kind: "guideline" },
  "apg-switch": { title: "Switch Pattern", publisher: "W3C ARIA Authoring Practices Guide", url: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/", kind: "guideline" },
  "apg-tooltip": { title: "Tooltip Pattern", publisher: "W3C ARIA Authoring Practices Guide", url: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/", kind: "guideline" },
  "apg-combobox": { title: "Combobox Pattern", publisher: "W3C ARIA Authoring Practices Guide", url: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/", kind: "guideline" },
  "apg-button": { title: "Button Pattern", publisher: "W3C ARIA Authoring Practices Guide", url: "https://www.w3.org/WAI/ARIA/apg/patterns/button/", kind: "guideline" },

  // — Apple Human Interface Guidelines (design/product company) —
  "hig-buttons": { title: "Buttons", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/buttons", kind: "guideline" },
  "hig-toggles": { title: "Toggles", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/toggles", kind: "guideline" },
  "hig-feedback": { title: "Feedback", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/feedback", kind: "guideline" },
  "hig-pull-down": { title: "Pull-down buttons", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons", kind: "guideline" },
  "hig-tab-bars": { title: "Tab bars", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/tab-bars", kind: "guideline" },
  "hig-modality": { title: "Modality", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/modality", kind: "guideline" },
  "hig-typography": { title: "Typography", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/typography", kind: "guideline" },
  "hig-pointing": { title: "Pointing devices", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/pointing-devices", kind: "guideline" },
  "hig-gestures": { title: "Gestures", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/gestures", kind: "guideline" },
  "hig-drag-drop": { title: "Drag and drop", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/drag-and-drop", kind: "guideline" },
  "hig-text-fields": { title: "Text fields", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/text-fields", kind: "guideline" },
  "hig-progress": { title: "Progress indicators", publisher: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/progress-indicators", kind: "guideline" },

  // — Google Material Design 3 (design/product company) —
  "m3-states": { title: "Interaction states", publisher: "Material Design 3 (Google)", url: "https://m3.material.io/foundations/interaction/states/applying-states", kind: "guideline" },
  "m3-buttons": { title: "Buttons: guidelines", publisher: "Material Design 3 (Google)", url: "https://m3.material.io/components/buttons/guidelines", kind: "guideline" },
  "m3-tooltips": { title: "Tooltips: guidelines", publisher: "Material Design 3 (Google)", url: "https://m3.material.io/components/tooltips/guidelines", kind: "guideline" },
  "m3-menus": { title: "Menus", publisher: "Material Design 3 (Google)", url: "https://m3.material.io/components/menus/overview", kind: "guideline" },
  "m3-inputs": { title: "Interaction inputs", publisher: "Material Design 3 (Google)", url: "https://m3.material.io/foundations/interaction/inputs", kind: "guideline" },

  // — Government design systems —
  "govuk-error-message": { title: "Error message", publisher: "GOV.UK Design System", url: "https://design-system.service.gov.uk/components/error-message/", kind: "guideline" },
  "govuk-text-input": { title: "Text input", publisher: "GOV.UK Design System", url: "https://design-system.service.gov.uk/components/text-input/", kind: "guideline" },
  "govuk-validation": { title: "Recover from validation errors", publisher: "GOV.UK Design System", url: "https://design-system.service.gov.uk/patterns/validation/", kind: "guideline" },
  "govuk-radios": { title: "Radios", publisher: "GOV.UK Design System", url: "https://design-system.service.gov.uk/components/radios/", kind: "guideline" },
  "govuk-accessible": { title: "Making your service accessible: an introduction", publisher: "GOV.UK Service Manual", url: "https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction", kind: "guideline" },
  "govuk-inclusive": { title: "Making your service more inclusive", publisher: "GOV.UK Service Manual", url: "https://www.gov.uk/service-manual/design/making-your-service-more-inclusive", kind: "guideline" },
  "govuk-research": { title: "User research for government services: an introduction", publisher: "GOV.UK Service Manual", url: "https://www.gov.uk/service-manual/user-research/how-user-research-improves-service-design", kind: "guideline" },
  "govuk-designing-services": { title: "Designing good government services: an introduction", publisher: "GOV.UK Service Manual", url: "https://www.gov.uk/service-manual/design/introduction-designing-government-services", kind: "guideline" },

  // — Standards —
  "iso-9241-210": { title: "ISO 9241-210:2019 Human-centred design for interactive systems", publisher: "International Organization for Standardization", url: "https://www.iso.org/standard/77520.html", kind: "standard" },
  "iso-9241-11": { title: "ISO 9241-11:2018 Usability: Definitions and concepts", publisher: "International Organization for Standardization", url: "https://www.iso.org/standard/63500.html", kind: "standard" },

  // — Universities & design schools —
  "mit-6831": { title: "User Interface Design and Implementation (6.831, Spring 2011)", publisher: "MIT OpenCourseWare", author: "Robert Miller", url: "https://ocw.mit.edu/courses/6-831-user-interface-design-and-implementation-spring-2011/", kind: "course" },
  "dschool-bootleg": { title: "Design Thinking Bootleg", publisher: "Stanford d.school", url: "https://dschool.stanford.edu/tools/design-thinking-bootleg", kind: "tool" },

  // — Practitioners & books —
  "norman-signifiers": { title: "Signifiers, not affordances", publisher: "jnd.org", author: "Don Norman", url: "https://jnd.org/signifiers-not-affordances/", kind: "article" },
  "norman-affordances": { title: "Affordances and Design", publisher: "jnd.org", author: "Don Norman", url: "https://jnd.org/affordances-and-design/", kind: "article" },
  "garrett-elements": { title: "The Elements of User Experience", publisher: "jjg.net", author: "Jesse James Garrett", url: "http://www.jjg.net/elements/", kind: "book" },
  "ms-inclusive": { title: "Inclusive 101 — Persona Spectrum", publisher: "Microsoft Inclusive Design", url: "https://inclusive.microsoft.design/articles/inclusive-101-guidebook", kind: "tool" },
  "laws-fitts": { title: "Fitts’s Law", publisher: "Laws of UX", author: "Jon Yablonski", url: "https://lawsofux.com/fittss-law/", kind: "article" },
  "laws-hick": { title: "Hick’s Law", publisher: "Laws of UX", author: "Jon Yablonski", url: "https://lawsofux.com/hicks-law/", kind: "article" },
  "laws-jakob": { title: "Jakob’s Law", publisher: "Laws of UX", author: "Jon Yablonski", url: "https://lawsofux.com/jakobs-law/", kind: "article" },
  "laws-aesthetic": { title: "Aesthetic-Usability Effect", publisher: "Laws of UX", author: "Jon Yablonski", url: "https://lawsofux.com/aesthetic-usability-effect/", kind: "article" },

  // — Developer learning platforms —
  "webdev-tap-targets": { title: "Accessible tap targets", publisher: "web.dev (Google)", url: "https://web.dev/articles/accessible-tap-targets", kind: "article" },
  "webdev-learn-a11y": { title: "Learn Accessibility", publisher: "web.dev (Google)", url: "https://web.dev/learn/accessibility", kind: "course" },
  "mdn-reduced-motion": { title: "prefers-reduced-motion", publisher: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion", kind: "guideline" },
  "mdn-button": { title: "<button>: The Button element", publisher: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button", kind: "guideline" },
  "mdn-dialog": { title: "<dialog>: The Dialog element", publisher: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog", kind: "guideline" },
});

export type SourceId = keyof typeof sources;

export function getSource(id: SourceId): Source {
  return sources[id];
}
