"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MobileNavOverlay } from "./MobileNavOverlay";
import { Logo } from "./Logo";

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Continuous scroll-tied scale (BRANDING.md §6's scoped exception) rather
  // than a binary swap — scrolling back to top smoothly regrows it for free,
  // no separate "return to top" case to handle.
  const logoScale = useTransform(scrollY, [0, 150], [1, shouldReduceMotion ? 1 : 0.74]);
  // Fades in over the same scroll range RathinamHero's own logo fades out
  // over (see RathinamHero.tsx's matching [0, 300] range, offset here to
  // start once the hero logo is mostly gone) — two independent elements
  // cross-dissolving on a coordinated schedule, approximating a handoff
  // rather than an abrupt swap. Reduced motion: always visible, no handoff.
  const logoOpacity = useTransform(scrollY, [150, 450], [shouldReduceMotion ? 1 : 0, 1]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-moderate",
          isScrolled ? "bg-[var(--color-black)]/95 backdrop-blur-md py-4 border-b border-[var(--color-gray-700)]" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between">
          {/* Logo Lockup — fades in as the hero logo hands off (see
              logoOpacity above), scales down smoothly with scroll (transform/
              opacity only, GPU-composited). */}
          <Link href="/" className="flex items-center focus-visible">
            <motion.div style={{ opacity: logoOpacity, scale: logoScale, transformOrigin: "left center" }}>
              <Logo className="h-10" />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6 text-eyebrow">
              {["Speakers", "Venue"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative group focus-visible"
                >
                  <span>{item}</span>
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--color-red)] scale-x-0 origin-left transition-transform duration-micro group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
            <Button asChild>
              <Link href="#tickets">Get Tickets</Link>
            </Button>
          </nav>

          {/* Mobile Nav Toggle */}
          <button
            className="lg:hidden text-white focus-visible p-2"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileNavOpen}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <MobileNavOverlay 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </>
  );
}
