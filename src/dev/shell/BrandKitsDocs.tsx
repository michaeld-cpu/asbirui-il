import * as React from "react";

/*
  Brand Kits — the internal, per-project brand reference for the Asbir studio.

  Two views off one component, chosen by `slug`:
    ""            → the project index: a card grid of every project
    "<slug>"      → that project's full brand book

  A kit page is a Mobbin-style reference: a sticky section rail on the left
  (with scrollspy — the rail highlights the section you're currently viewing),
  and stacked sections on the right: Overview, Colors, Gradients, Typography,
  Logo, Layout & radius, Motion, Brand voice.

  The scaffolding (rail + every section page) always renders. Each section's
  values live in the Project data below; a section with no data yet shows a
  "Coming soon" placeholder so the shell stays complete while content is filled
  in. Onboarding / editing a project is a single data edit.
*/

/* ---- data model ------------------------------------------------------- */

type Gradient = { name: string; css: string; role: string };
type TypeSpec = { label: string; sample: string; meta: string; style?: React.CSSProperties };
type Motion = { name: string; value: string; role: string };

type Project = {
  slug: string;
  name: string;
  tagline: string;
  /* the mark's base color — drives the index card accent + logo panels */
  accent: string;
  /* inline SVG logomark (paste-ready), single-color so it flips fg on any
     surface. If absent, a lettermark tile is used. */
  logomark?: string;
  /* inline SVG wordmark lockup (mark + name), single-color like the mark. */
  logoWordmark?: string;
  /* one-liner shown at the top of the kit (Overview) */
  summary?: string;
  /* short factual meta rows (Founded, Location, …) */
  facts?: { label: string; value: string }[];
  /* brand hue families — each renders as a generated 50→950 ramp row. */
  colorFamilies?: { name: string; base: string }[];
  gradients?: Gradient[];
  fonts?: { family: string; role: string; source: string; weights: string; stack: string; mono?: boolean }[];
  type?: TypeSpec[];
  radius?: { label: string; value: string }[];
  motion?: Motion[];
  voice?: string;
  voiceTraits?: string[];
  /* real copy lines that characterize the brand voice */
  voiceLines?: string[];
};

/* The real Asbir Tech marks pulled from the live site source. Both are
   single-color (fill="currentColor") so they tint per surface — never recolor
   the paths. The logomark is the standalone "A"; the wordmark is the full
   "ASBIRTECH" lockup (mark + letterforms). */
const ASBIR_LOGOMARK =
  '<svg viewBox="0 0 26 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.5205 8.94012L14.6933 5.28149C14.1219 6.42815 13.3659 7.92302 13.2099 8.2437L13.5647 8.93742H13.5673L13.5657 8.94012L19.0029 19.8685C15.2648 18.5809 10.3785 18.5804 6.63992 19.8668C6.87398 19.3972 7.10909 18.9253 7.34367 18.454C5.23767 18.8303 4.19547 19.2406 3.93927 19.3507C3.5418 20.1497 3.14485 20.9471 2.75 21.7418L2.80535 21.8098C2.81537 21.8222 4.57187 23.9892 4.58083 24C8.35371 21.0049 17.2854 21.0065 21.0588 24C21.0656 23.9914 22.8221 21.8179 22.8306 21.8076L22.8875 21.7374L16.5205 8.94012Z"/><path d="M25.0622 17.1719C22.3489 11.7182 19.5534 6.09987 16.839 0.644592C16.1458 0.50153 13.7588 0.0620839 13.5759 0L6.27051 14.6669C7.04754 14.5141 8.13454 14.3306 9.46984 14.1832C9.98119 13.1558 14.6661 3.73853 15.0446 2.97625L21.3874 15.725C21.0574 15.6316 20.7231 15.5442 20.3858 15.4621L22.0964 18.9048C22.884 19.1817 23.6615 19.504 24.3995 19.8668C24.5319 19.6806 25.4359 18.4211 25.5403 18.2672L25.0622 17.1719Z"/><path d="M15.8274 14.71C13.6466 14.5092 11.344 14.5313 9.17575 14.7731C7.88526 14.9297 6.97433 15.0825 5.95743 15.2941L5.95532 15.2984C5.37756 15.4248 4.80928 15.5662 4.2526 15.7244C5.37861 13.4629 6.50673 11.196 7.62589 8.9378C7.62906 8.93996 7.6338 8.92593 7.6338 8.92593C8.58638 7.02238 9.57111 5.03948 10.5453 3.07979L10.9633 3.79618L12.4468 0.83397L12.0546 0.0317383C11.6824 0.0949019 9.08507 0.592112 8.80832 0.634221C6.60953 5.05351 2.36537 13.5779 0.225624 17.8811L0 18.3346C0 18.3346 0.00737998 18.3492 0.0195047 18.3735L1.23303 19.8705C3.55095 18.8189 4.67749 18.3616 7.65014 17.8412L7.65173 17.8385C10.6866 17.2916 14.257 17.2522 17.3283 17.731L15.828 14.7116L15.8274 14.71Z"/></svg>';

const ASBIR_WORDMARK =
  '<svg viewBox="0 0 130 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_111_4707)"><path d="M45.5176 8.93275C45.5414 8.85333 45.5861 8.78035 45.6517 8.71667C45.7258 8.653 45.8131 8.62223 45.9137 8.62223H52.8974C53.1845 8.62223 53.4298 8.41188 53.4808 8.12211C53.5311 7.83378 53.587 7.51896 53.6484 7.17911C53.7057 6.86573 53.7728 6.47938 53.8545 6.00072H45.359C44.2146 6.00072 43.4587 6.62318 43.0465 7.90389C43.0283 8.00191 42.9927 8.20296 42.9389 8.50632C42.8844 8.81613 42.8271 9.13308 42.767 9.45791C42.707 9.78273 42.6636 10.0145 42.6371 10.1526L42.6266 10.2213L42.628 10.2485L42.6266 10.2578C42.4939 11.0699 42.6804 11.7846 43.1799 12.3813C43.6739 12.9788 44.3152 13.2814 45.0851 13.2814H49.4244C49.5516 13.2843 49.6578 13.3401 49.7416 13.4481C49.8269 13.5576 49.8499 13.6849 49.8101 13.8166C49.801 13.8652 49.7863 13.9497 49.7647 14.0677C49.743 14.1908 49.72 14.3239 49.6969 14.4677C49.6732 14.6122 49.641 14.7932 49.6012 15.01L49.5991 15.0193C49.5341 15.2282 49.3944 15.3384 49.1953 15.3384H41.7205C41.7044 15.4443 41.6764 15.6132 41.6373 15.8428C41.587 16.1347 41.5318 16.4531 41.4703 16.7994C41.4138 17.12 41.3446 17.5221 41.2649 17.9957H49.7521C50.3404 17.9957 50.8511 17.814 51.2689 17.4555C51.6867 17.092 51.9584 16.6177 52.0772 16.0453C52.0856 15.9688 52.1107 15.8149 52.1554 15.5745C52.1995 15.3341 52.247 15.073 52.2973 14.7904C52.3476 14.5077 52.3916 14.2631 52.4293 14.0556C52.4754 13.798 52.4824 13.7486 52.4831 13.7393L52.4817 13.7193L52.4894 13.7086V13.7014C52.6179 12.9065 52.4321 12.1946 51.9368 11.5857C51.4414 10.9711 50.8029 10.6599 50.0392 10.6599H45.7349C45.6049 10.6599 45.4959 10.6077 45.4107 10.5047C45.3269 10.4038 45.2912 10.2829 45.3038 10.1462C45.3136 10.0911 45.329 10.0052 45.3506 9.88219C45.3723 9.75912 45.3953 9.62604 45.4191 9.48223C45.4421 9.342 45.4729 9.16456 45.5141 8.9399L45.5162 8.93132L45.5176 8.93275Z" fill="currentColor"/><path d="M69.5524 6.00072C68.4143 6.00072 67.576 6.00072 67.3594 7.34438L65.4591 17.9971H68.1125L70.205 6.00072H69.5524Z" fill="currentColor"/><path d="M79.4956 6.00072H73.7387C72.5601 6.00072 71.8042 6.63463 71.4283 7.93895L69.653 17.9792H72.4309C72.4532 17.8583 72.4923 17.6287 72.5489 17.2945C72.6181 16.8824 72.6963 16.4259 72.7837 15.9237C72.871 15.4221 72.9444 14.9914 73.0051 14.6308C73.0771 14.1851 73.0869 14.1321 73.0911 14.1178L73.1428 14.1321L73.1686 14.1307V14.0577H75.034L77.568 17.9971H80.5184L77.9928 14.0577H79.2154C79.8037 14.0577 80.3172 13.876 80.7419 13.5175C81.166 13.1541 81.4357 12.684 81.5433 12.1231C81.6125 11.716 81.6886 11.2745 81.7717 10.7994C81.8549 10.3244 81.9597 9.73265 82.0875 9.0229C82.2035 8.23158 82.3104 7.67565 81.6111 6.81422C81.1038 6.18961 80.2843 6.00144 79.497 6.00144L79.4956 6.00072ZM79.4949 9.12736L79.4935 9.13523L79.1085 11.082C79.0477 11.2924 78.9017 11.4004 78.6844 11.4004H73.7136L74.0992 8.97925C74.1223 8.87336 74.174 8.78607 74.2529 8.71453C74.3375 8.64584 74.4206 8.61293 74.5037 8.61293H79.0456C79.1749 8.61293 79.2874 8.66802 79.3789 8.77677C79.4683 8.87694 79.5088 8.99571 79.4949 9.12736Z" fill="currentColor"/><path d="M33.4025 6.00071C32.2651 6.00071 31.53 6.63749 31.1542 7.94753L29.3615 17.9971H31.9884L32.534 15L31.1779 14.6523H37.7752L37.1772 17.9964H39.8217L41.9399 6L33.4025 6.00071ZM38.2406 12.0229H33.0434L33.5793 8.98711C33.6016 8.87622 33.654 8.78678 33.7365 8.72096C33.8098 8.65657 33.8909 8.62222 33.9747 8.62222H38.8414L38.2406 12.0229Z" fill="currentColor"/><path d="M88.9986 8.77749L85.098 8.77963L85.4599 6.72979C85.5277 6.34343 85.856 6.06297 86.2389 6.06297L96.0199 6.05796L95.6497 8.11996C95.5812 8.49917 95.2584 8.77462 94.8818 8.77534L91.754 8.77677L90.1876 17.4054C90.1255 17.7489 89.8327 17.9986 89.4911 17.9986L87.2897 18L88.9986 8.77749Z" fill="currentColor"/><path d="M96.7361 8.03052C97.1224 6.71476 97.9224 6.05652 99.1352 6.0558L107.002 6.05151L106.73 7.63629C106.616 8.30097 106.053 8.78606 105.393 8.78678L99.7766 8.78964C99.7123 8.78964 99.6473 8.81611 99.5803 8.86906C99.5076 8.922 99.4601 8.99284 99.4363 9.08155L99.1625 10.657L103.929 10.6549L103.651 12.3756C103.556 12.9602 103.062 13.3894 102.483 13.3894L98.6937 13.3916L98.438 14.8433C98.4275 14.9556 98.4603 15.0529 98.5358 15.1352C98.6049 15.2182 98.6951 15.259 98.8062 15.259L105.396 15.264C105.258 16.0961 105.102 17.0048 104.927 17.99L98.2319 17.9935C97.404 17.9935 96.7193 17.6845 96.1772 17.0656C95.6301 16.4524 95.4177 15.7412 95.54 14.9334L96.7361 8.03052Z" fill="currentColor"/><path d="M107.678 8.02479C108.059 6.70903 108.856 6.05079 110.068 6.05008L118.185 6.04579L117.869 7.85308C117.775 8.38969 117.32 8.78034 116.787 8.78034L110.71 8.7832C110.646 8.7832 110.581 8.80968 110.514 8.86334C110.448 8.91628 110.402 8.98711 110.379 9.07583L109.39 14.8369C109.379 14.9492 109.412 15.0465 109.488 15.1288C109.563 15.2118 109.656 15.2525 109.767 15.2525L116.607 15.2576C116.463 16.0897 116.303 16.9983 116.128 17.9835L109.185 17.9871C108.278 17.952 107.58 17.6179 107.09 16.984C106.6 16.3501 106.398 15.6647 106.484 14.927L107.679 8.02408L107.678 8.02479Z" fill="currentColor"/><path d="M121.227 13.4074H121.362C121.314 13.4074 121.269 13.4066 121.227 13.4074Z" fill="currentColor"/><path d="M127.14 6.04222L130 6.04079L128.208 16.006C128.012 17.3332 127.693 17.98 126.498 17.9807H125.1L125.703 14.4677L125.896 13.4059L121.361 13.4081C121.313 13.4081 121.268 13.4073 121.226 13.4081H119.763L120.83 13.6799L120.738 14.2409L120.09 17.9842L117.291 17.9857L119.048 8.02051C119.356 6.33628 119.849 6.04651 121.004 6.0458H122.147L121.553 9.69187L121.395 10.6213L125.865 10.6191C126.011 10.6191 126.139 10.5748 126.25 10.486C126.366 10.3916 126.437 10.2707 126.462 10.1233L127.141 6.04365L127.14 6.04222Z" fill="currentColor"/><path d="M65.0539 6.92081C64.5236 6.31051 63.8494 6.00142 63.0494 6.00142H57.2486C56.0581 6.00142 55.2973 6.63819 54.9214 7.94823C54.8816 8.18076 54.7719 8.81038 54.5916 9.83709L53.9852 13.2943C53.7658 14.5442 53.4927 16.1118 53.1636 17.9978H62.1433C63.3352 17.9978 64.0995 17.3596 64.481 16.046C64.5033 15.9616 64.5362 15.8027 64.5781 15.5767C64.62 15.3484 64.6605 15.1245 64.7003 14.9055C64.7458 14.653 64.7639 14.5442 64.7702 14.4977L64.7688 14.4798L64.7702 14.472C64.8478 13.9039 64.7388 13.3687 64.4467 12.8757C64.3971 12.8013 64.0045 12.244 63.3282 12.2576L63.8697 12.0966C64.0625 12.0393 64.3056 11.9091 64.5935 11.7109C64.8771 11.5149 65.1091 11.2545 65.2816 10.9368C65.3312 10.8473 65.3801 10.7021 65.4269 10.5061C65.4758 10.305 65.5199 10.0918 65.559 9.87144C65.5981 9.6525 65.6288 9.45789 65.6512 9.29333C65.6764 9.10373 65.6826 9.05079 65.6826 9.03862V9.02646C65.8 8.23228 65.5876 7.52396 65.0539 6.92081ZM61.9414 14.4512C61.9372 14.4798 61.9309 14.522 61.9225 14.5771C61.9134 14.6329 61.9023 14.693 61.8883 14.7581C61.875 14.819 61.8652 14.8712 61.8597 14.9134C61.8541 14.9542 61.8492 14.9814 61.8415 15.0007C61.8373 15.0307 61.8226 15.0679 61.7961 15.1209C61.766 15.1788 61.7276 15.2332 61.6822 15.2833C61.6256 15.3448 61.5536 15.377 61.474 15.377H56.3746L56.3858 15.2847C56.3941 15.2153 56.4158 15.0815 56.4507 14.8877C56.4857 14.6923 56.5227 14.4813 56.5618 14.253C56.6009 14.0248 56.6512 13.7415 56.7134 13.4045L56.726 13.3372H60.9738C61.2847 13.3372 61.5362 13.4503 61.722 13.6728C61.9141 13.9017 61.9882 14.1629 61.9414 14.4512ZM62.8909 9.13593C62.8867 9.17599 62.8755 9.23895 62.8566 9.32982C62.8385 9.41711 62.8189 9.50869 62.7979 9.60528C62.777 9.70187 62.7504 9.82207 62.7183 9.9666C62.6799 10.1755 62.5786 10.3472 62.4172 10.4732C62.2579 10.5976 62.0671 10.6613 61.8506 10.6613H57.1787L57.4533 8.97995C57.4819 8.87263 57.5371 8.78534 57.6175 8.72024C57.6985 8.65513 57.7817 8.6215 57.8648 8.6215H62.4423C62.5709 8.6215 62.682 8.67301 62.7728 8.7739C62.8643 8.87549 62.9034 8.99712 62.8909 9.1345V9.13593Z" fill="currentColor"/><path d="M9.38558 0.526367L8.80835 0.633259C8.82943 0.638118 9.05822 0.593309 9.38558 0.526367Z" fill="currentColor"/><path d="M16.5205 8.94012L14.6933 5.28149C14.1219 6.42815 13.3659 7.92302 13.2099 8.2437L13.5647 8.93742H13.5673L13.5657 8.94012L19.0029 19.8685C15.2648 18.5809 10.3785 18.5804 6.63992 19.8668C6.87398 19.3972 7.10909 18.9253 7.34367 18.454C5.23767 18.8303 4.19547 19.2406 3.93927 19.3507C3.5418 20.1497 3.14485 20.9471 2.75 21.7418L2.80535 21.8098C2.81537 21.8222 4.57187 23.9892 4.58083 24C8.35371 21.0049 17.2854 21.0065 21.0588 24C21.0656 23.9914 22.8221 21.8179 22.8306 21.8076L22.8875 21.7374L16.5205 8.94012Z" fill="currentColor"/><path d="M25.0622 17.1719C22.3489 11.7182 19.5534 6.09987 16.839 0.644592C16.1458 0.50153 13.7588 0.0620839 13.5759 0L6.27051 14.6669C7.04754 14.5141 8.13454 14.3306 9.46984 14.1832C9.98119 13.1558 14.6661 3.73853 15.0446 2.97625L21.3874 15.725C21.0574 15.6316 20.7231 15.5442 20.3858 15.4621L22.0964 18.9048C22.884 19.1817 23.6615 19.504 24.3995 19.8668C24.5319 19.6806 25.4359 18.4211 25.5403 18.2672L25.0622 17.1719Z" fill="currentColor"/><path d="M15.8274 14.71C13.6466 14.5092 11.344 14.5313 9.17575 14.7731C7.88526 14.9297 6.97433 15.0825 5.95743 15.2941L5.95532 15.2984C5.37756 15.4248 4.80928 15.5662 4.2526 15.7244C5.37861 13.4629 6.50673 11.196 7.62589 8.9378C7.62906 8.93996 7.6338 8.92593 7.6338 8.92593C8.58638 7.02238 9.57111 5.03948 10.5453 3.07979L10.9633 3.79618L12.4468 0.83397L12.0546 0.0317383C11.6824 0.0949019 9.08507 0.592112 8.80832 0.634221C6.60953 5.05351 2.36537 13.5779 0.225624 17.8811L0 18.3346C0 18.3346 0.00737998 18.3492 0.0195047 18.3735L1.23303 19.8705C3.55095 18.8189 4.67749 18.3616 7.65014 17.8412L7.65173 17.8385C10.6866 17.2916 14.257 17.2522 17.3283 17.731L15.828 14.7116L15.8274 14.71Z" fill="currentColor"/></g><defs><clipPath id="clip0_111_4707"><rect width="130" height="24" fill="currentColor"/></clipPath></defs></svg>';

const PROJECTS: Project[] = [
  {
    slug: "asbir-tech-web",
    name: "Asbir Tech Web",
    tagline: "Web development & IT consulting",
    accent: "#FF6900",
    // The real "A" logomark + full wordmark lockup from the live site.
    logomark: ASBIR_LOGOMARK,
    logoWordmark: ASBIR_WORDMARK,
    // Content intentionally left empty for now — the rail + section pages still
    // render (each section shows a placeholder). Fill these arrays in to
    // populate the kit.
    // each brand hue renders as a full 50→950 ramp (generated from the base)
    colorFamilies: [
      { name: "Orange", base: "#FF6900" },
      { name: "Ember", base: "#FF4500" },
      { name: "Amber", base: "#FFB800" },
      { name: "Neutral", base: "#8E8E8E" },
    ],
    fonts: [
      {
        family: "DM Sans",
        role: "Primary — text & headings",
        source: "Google Fonts",
        weights: "400 · 500 · 600 · 700 · 800",
        stack: "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      },
      {
        family: "DM Mono",
        role: "Code & data",
        source: "Google Fonts",
        weights: "400 · 500",
        stack: "'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
        mono: true,
      },
    ],
    type: [],
    radius: [],
    motion: [],
    voice: "",
    voiceTraits: [],
    voiceLines: [],
  },
];

/* ---- helpers ---------------------------------------------------------- */

/** Renders a raw inline-SVG string, tinted via currentColor. */
function Glyph({ svg, className = "" }: { svg: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Human-readable name for a numeric font-weight. */
const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "Extralight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extrabold",
  900: "Black",
};

/** Parse a #RRGGBB into its r/g/b components. */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Pick readable ink for a swatch: dark text on light fills, light on dark. */
function inkFor(hex: string): { fg: string; sub: string } {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6
    ? { fg: "rgba(0,0,0,0.85)", sub: "rgba(0,0,0,0.5)" }
    : { fg: "rgba(255,255,255,0.92)", sub: "rgba(255,255,255,0.55)" };
}

/* ---- ramp generation -------------------------------------------------- */

const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

// how far each step is blended toward white (positive) or black (negative)
// from the base hue at step 500. Mirrors a typical 50→950 lightness curve.
const RAMP_MIX = [0.92, 0.82, 0.66, 0.44, 0.2, 0, -0.16, -0.32, -0.46, -0.6, -0.72];

const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");

/** Build an 11-step ramp from a base hex: blend toward white for the light
    steps (50–400), keep the base at 500, blend toward black for 600–950. */
function buildRamp(baseHex: string): string[] {
  const { r, g, b } = hexToRgb(baseHex);
  return RAMP_MIX.map((mix) => {
    const target = mix >= 0 ? 255 : 0;
    const t = Math.abs(mix);
    const nr = r + (target - r) * t;
    const ng = g + (target - g) * t;
    const nb = b + (target - b) * t;
    return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`.toUpperCase();
  });
}

/** One brand-color family: a labeled row over a strip of 11 step chips
    (step # + hex printed in legible ink), matching the tokens Colors ramp. */
function FamilyRow({ family }: { family: { name: string; base: string } }) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopied(hex);
    window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
  };
  const ramp = React.useMemo(() => buildRamp(family.base), [family.base]);

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-fg">{family.name}</p>
      {/* fixed-size square chips that WRAP — the full hex always fits (never
          truncated); on narrow screens the row wraps to fewer per line rather
          than shrinking the cubes. */}
      <div className="flex flex-wrap gap-1.5">
          {ramp.map((hex, i) => {
            const ink = inkFor(hex);
            const step = RAMP_STEPS[i];
            const isCopied = copied === hex;
            return (
              <button
                key={hex + i}
                type="button"
                onClick={() => copy(hex)}
                title={`${family.name}-${step} — click to copy ${hex}`}
                aria-label={`${family.name} ${step}, ${hex}`}
                className="group relative flex h-[72px] w-[72px] shrink-0 flex-col justify-end overflow-hidden rounded-lg p-2 text-left outline-none ring-1 ring-inset ring-black/[0.06] transition-[box-shadow] hover:ring-2 hover:ring-fg/40 focus-visible:ring-2 focus-visible:ring-fg/60 dark:ring-white/[0.08]"
                style={{ backgroundColor: hex }}
              >
                <span
                  className={`text-[11px] font-semibold leading-none transition-opacity ${isCopied ? "opacity-0" : ""}`}
                  style={{ color: ink.fg }}
                >
                  {step}
                </span>
                <span
                  className={`mt-1 font-mono text-[10px] leading-none transition-opacity ${isCopied ? "opacity-0" : ""}`}
                  style={{ color: ink.sub }}
                >
                  {hex}
                </span>
                {isCopied && (
                  <span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-semibold tracking-tight motion-safe:animate-copied-pop"
                    style={{ color: ink.fg }}
                  >
                    Copied!
                  </span>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}

/* ---- project index ---------------------------------------------------- */

function ProjectIndex() {
  return (
    <article className="animate-fade-up py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Brand kits</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        The brand book for every project we run — colors, typography, logo, and
        voice, in one place. Open a project for its full identity.
      </p>

      <div className="mt-16 space-y-6">
        {PROJECTS.map((p) => (
          <a
            key={p.slug}
            href={`#brand-kits/${p.slug}`}
            className="group flex items-center gap-4"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform group-hover:scale-[1.04] [&_svg]:h-6 [&_svg]:w-6"
              style={{ backgroundColor: p.accent }}
            >
              {p.logomark ? <Glyph svg={p.logomark} /> : <span className="text-base font-semibold">{p.name.slice(0, 1)}</span>}
            </span>
            <span className="min-w-0">
              <span className="block text-base font-semibold tracking-tight text-fg">{p.name}</span>
              <span className="mt-0.5 block text-sm text-fg/50">{p.tagline}</span>
            </span>
          </a>
        ))}
      </div>
    </article>
  );
}

/* ---- per-project kit -------------------------------------------------- */

const SearchIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
);

/** Left column: a search box over a section nav rail with scrollspy. Typing
    filters the rail; clicking a section jumps to it; the rail highlights the
    section currently in view. Built to scale as more sections are added. */
function KitRail({ sections }: { sections: { id: string; label: string }[] }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(sections[0]?.id);
  // depend on the id list (stable string) rather than the array identity, which
  // is recreated every parent render and would thrash the effect.
  const ids = sections.map((s) => s.id).join(",");

  // scrollspy: on every scroll pick the last section whose top has crossed a
  // line ~28% down the viewport — reliable and highlights on first paint.
  React.useEffect(() => {
    const idList = ids ? ids.split(",") : [];
    const compute = () => {
      const line = window.innerHeight * 0.28;
      let current = idList[0];
      for (const id of idList) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      if (current) setActive(current);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids]);

  const shown = sections.filter((s) => s.label.toLowerCase().includes(query.toLowerCase().trim()));

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg/40">
          {SearchIcon}
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full rounded-full border border-border bg-panel py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-fg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <nav className="mt-5 space-y-0.5">
        {shown.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
              active === s.id ? "bg-overlay/[0.06] font-medium text-fg" : "text-fg/60 hover:text-fg"
            }`}
          >
            {s.label}
          </a>
        ))}
        {!shown.length && <p className="px-3 py-2 text-sm text-fg/40">No matches</p>}
      </nav>
    </div>
  );
}

function KitView({ project }: { project: Project }) {
  const has = <T,>(v: T[] | undefined): v is T[] => Boolean(v && v.length);

  // rail entries — only sections that actually render (grows as we add more)
  const sections = [
    ...(has(project.colorFamilies) ? [{ id: "colors", label: "Colors" }] : []),
    { id: "font", label: "Font" },
  ];

  return (
    <article className="animate-fade-up pb-10 pt-16 lg:pt-20">
      {/* header — top-left, no eyebrow */}
      <div className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white [&_svg]:h-7 [&_svg]:w-7"
          style={{ backgroundColor: project.accent }}
        >
          {project.logomark ? (
            <Glyph svg={project.logomark} />
          ) : (
            <span>{project.name.slice(0, 1)}</span>
          )}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">{project.name}</h1>
          <p className="mt-0.5 text-[15px] text-fg/50">{project.tagline}</p>
        </div>
      </div>

      {/* search + scrollspy rail | plain stacked content (no boxes) */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <KitRail sections={sections} />

        <div className="min-w-0 space-y-14">
          {/* Colors — a generated 50→950 ramp per brand hue */}
          {has(project.colorFamilies) && (
            <section id="colors" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-fg">Colors</h2>
              <p className="mt-1.5 text-sm text-fg/50">
                Each brand hue as a 50→950 ramp. Click any swatch to copy its hex.
              </p>
              <div className="mt-6 space-y-5">
                {project.colorFamilies!.map((f) => (
                  <FamilyRow key={f.name} family={f} />
                ))}
              </div>
            </section>
          )}

          {/* Font — real typefaces as live specimens, divided rows (no cards) */}
          <section id="font" className="scroll-mt-24 border-t border-border pt-14">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">Font</h2>
            {has(project.fonts) ? (
              <div className="mt-6 divide-y divide-border">
                {project.fonts!.map((f) => {
                  // parse the weights string ("400 · 500 · 600") into numbers,
                  // each rendered as its own specimen line below.
                  const weights = f.weights
                    .split(/[·,\s]+/)
                    .map((w) => parseInt(w, 10))
                    .filter((n) => !Number.isNaN(n));
                  const sample = f.mono
                    ? "0123456789 { } < /> $ npm i @asbirtech/asbir-ui"
                    : "The quick brown fox jumps 0123456789";
                  return (
                    <div key={f.family} className="py-8 first:pt-0">
                      {/* header: role + family name + source */}
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <div>
                          <p className="text-xs text-fg/45">{f.role}</p>
                          <p
                            className="mt-1 text-fg"
                            style={{
                              fontFamily: f.stack,
                              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                              fontWeight: 600,
                              letterSpacing: f.mono ? "0" : "-0.02em",
                              lineHeight: 1.1,
                            }}
                          >
                            {f.family}
                          </p>
                        </div>
                        <p className="text-xs text-fg/50">{f.source}</p>
                      </div>

                      {/* one live specimen per weight used in the project */}
                      <div className="mt-6 divide-y divide-border/60">
                        {weights.map((w) => (
                          <div
                            key={w}
                            className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6"
                          >
                            <span className="w-24 shrink-0 font-mono text-xs text-fg/40">
                              {w} · {WEIGHT_NAMES[w] ?? "Weight"}
                            </span>
                            <span
                              className="min-w-0 truncate text-fg/90"
                              style={{
                                fontFamily: f.stack,
                                fontWeight: w,
                                fontSize: "clamp(1.1rem, 2.4vw, 1.5rem)",
                                letterSpacing: f.mono ? "0" : "-0.01em",
                              }}
                            >
                              {sample}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-fg/50">Coming soon.</p>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}

/* ---- not found -------------------------------------------------------- */

function UnknownProject({ slug }: { slug: string }) {
  return (
    <article className="animate-fade-up py-10">
      <a
        href="#brand-kits"
        className="text-xs font-medium text-fg/60 transition-colors hover:text-fg"
      >
        ← All projects
      </a>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">No kit for “{slug}”</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/70">
        There's no brand kit for this project yet. Pick one from the index, or
        add it to <span className="font-mono">PROJECTS</span> in{" "}
        <span className="font-mono">BrandKitsDocs.tsx</span>.
      </p>
    </article>
  );
}

/* ---- page ------------------------------------------------------------- */

/** `slug` is the project (e.g. "asbir-tech-web"); "" renders the project index. */
export function BrandKitsDocs({ slug }: { slug: string }) {
  if (!slug) return <ProjectIndex />;
  const project = PROJECTS.find((p) => p.slug === slug);
  return project ? <KitView project={project} /> : <UnknownProject slug={slug} />;
}
