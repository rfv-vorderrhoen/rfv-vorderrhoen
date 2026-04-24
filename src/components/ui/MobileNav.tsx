import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { mainNav, siteConfig } from "@/lib/site";

type Props = {
  currentPath: string;
};

export default function MobileNav({ currentPath }: Props) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)]"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value: boolean) => !value)}
      >
        <span className="sr-only">Navigation umschalten</span>
        <div className="space-y-1.5">
          <span className="block h-0.5 w-5 bg-[var(--color-ink)]" />
          <span className="block h-0.5 w-5 bg-[var(--color-ink)]" />
          <span className="block h-0.5 w-5 bg-[var(--color-ink)]" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav-panel"
            aria-label="Mobile"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={reduceMotion ? {} : { opacity: 0, y: -8 }}
            className="panel absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] overflow-hidden bg-[rgb(255,252,247)] p-2"
          >
            {mainNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={currentPath === item.href ? "page" : undefined}
                data-active={currentPath === item.href ? "true" : undefined}
                className="menu-link menu-link--mobile text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={siteConfig.signupUrl}
              className="mt-2 block rounded-2xl bg-[var(--color-sand)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
              onClick={() => setOpen(false)}
            >
              Probetraining anfragen
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
