"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { name: "Speakers", href: "#speakers" },
  { name: "Venue", href: "#venue" },
];

export function MobileNavOverlay({ isOpen, onClose }: MobileNavOverlayProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 bg-[var(--color-black)] flex flex-col justify-between p-6 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center focus-visible" onClick={onClose}>
              <Logo className="h-12" />
            </Link>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2 focus-visible"
              aria-label="Close menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6 mt-16">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-display-l block hover:text-[var(--color-red)] transition-colors focus-visible w-fit"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="mt-auto pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button asChild className="w-full">
              <Link href="#tickets" onClick={onClose}>Get Tickets</Link>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
