import * as React from "react";
import asbirLogo from "@/assets/logo/asbirlogo-white.svg";
import { ThemeToggle } from "./ThemeToggle";

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const MenuIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const GitHubIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const navLinks = [
  { label: "Templates", href: "#templates" },
  { label: "Components", href: "#components" },
  { label: "Blocks", href: "#blocks" },
  { label: "Motion", href: "#motion" },
  { label: "Brand Kits", href: "#brand-kits" },
  { label: "Test Cases", href: "#test-cases" },
  { label: "Docs", href: "#docs" },
  { label: "Tokens", href: "#tokens" },
];

// Point this at the real repo when it's public.
const REPO_URL = "https://github.com/asbirtech/asbir-ui";

export function Navbar({ active, wide }: { active: string; wide?: boolean }) {
  // `open` mounts the panel; `closing` plays the exit animation before unmount.
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  const closeMenu = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 170); // matches menu-out duration
  };

  // outside-click closes instantly, no exit animation
  const closeMenuNow = () => {
    setOpen(false);
    setClosing(false);
  };

  const toggleMenu = () => (open ? closeMenu() : setOpen(true));

  // Close instantly when the viewport grows past the mobile breakpoint —
  // otherwise the desktop nav and the mobile panel both show at once.
  React.useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)"); // md
    const onChange = () => {
      if (mq.matches) closeMenuNow();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-canvas md:sticky md:bg-canvas/80 md:backdrop-blur"
      style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
    >
      <div
        className={`flex h-16 items-center gap-6 px-6 lg:px-8 ${
          wide ? "w-full" : "mx-auto max-w-[88rem] lg:px-10"
        }`}
      >
        {/* Brand */}
        <a href="#home" className="flex items-center gap-2">
          <img src={asbirLogo} alt="AsbirUI logo" width={22} height={20} className="[html.light_&]:invert" />
          <span className="text-lg font-semibold tracking-[-0.03em] text-fg">
            AsbirUI
          </span>
        </a>

        {/* Primary nav (desktop) */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.replace(/^#/, "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-overlay/[0.06] text-fg"
                    : "text-fg/70 hover:bg-overlay/[0.04] hover:text-fg"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            title="GitHub repository"
            className="flex h-8 w-8 items-center justify-center rounded-md text-fg/70 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
          >
            {GitHubIcon}
          </a>
          <ThemeToggle />
          <a
            href="#components"
            className="ml-1 hidden items-center gap-1.5 rounded-asbir bg-solid px-3.5 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85 lg:inline-flex"
          >
            Get started
            <span>{ArrowIcon}</span>
          </a>

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-fg transition-colors hover:bg-overlay/[0.06] md:hidden"
          >
            {open && !closing ? CloseIcon : MenuIcon}
          </button>
        </div>
      </div>

      {/* Mobile menu — fixed overlay anchored to the viewport (outside the
          sticky header's stacking context) so the backdrop reliably catches
          outside clicks and nothing jitters on scroll. */}
      {open && (
        <div className="fixed inset-0 top-16 z-50 md:hidden">
          {/* click-away backdrop — full viewport under the panel */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenuNow}
            className="absolute inset-0 h-full w-full cursor-default bg-black/20"
          />
          <nav
            className={`absolute inset-x-0 top-0 border-b border-border bg-canvas px-6 py-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] ${
              closing ? "menu-exit" : "menu-enter"
            }`}
          >
            {navLinks.map((link) => {
              const isActive = active === link.href.replace(/^#/, "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-overlay/[0.06] font-medium text-fg"
                      : "text-fg/70 hover:bg-overlay/[0.04] hover:text-fg"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="#components"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-asbir bg-solid px-3.5 py-2.5 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
            >
              Get started
              <span>{ArrowIcon}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
