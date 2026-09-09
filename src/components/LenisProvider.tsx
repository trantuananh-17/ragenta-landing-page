"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __ragentaLenis?: Lenis;
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Smooth scrolling is momentum applied to the whole page — the single
    // largest source of motion on this site, and the one most likely to make
    // somebody ill. Anyone who has asked the OS for less movement keeps the
    // browser's own scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.25,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      anchors: { offset: 0 },
    });
    window.__ragentaLenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      if (window.__ragentaLenis === lenis) {
        window.__ragentaLenis = undefined;
      }
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    requestAnimationFrame(() => {
      window.__ragentaLenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  // `reducedMotion="user"` makes every `motion.*` on the site honour the OS
  // setting: transform and layout animations are dropped, opacity is kept, so
  // the 19 scroll-triggered reveals still resolve to their final state instead
  // of leaving content invisible.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
