"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __ragentaLenis?: Lenis;
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
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

  return <>{children}</>;
}
