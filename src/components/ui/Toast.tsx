"use client";
import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

/**
 * A single, self-built toast — not worth a new dependency for one transient
 * message (CLAUDE.md's "propose a real gap before adding a library" rule).
 * Auto-dismiss timing lives in the caller (Speakers.tsx), which owns the
 * message state; this component is purely presentational.
 */
export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-8 z-50 mx-auto w-fit rounded-[4px] border border-[var(--color-gray-700)] bg-[var(--color-black)]/95 px-6 py-3 text-small text-[var(--color-white)] shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          onAnimationComplete={() => {
            /* no-op: dismissal timing owned by caller, this just plays exit when message becomes null */
          }}
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)] align-middle" aria-hidden="true" />
          {message}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="focus-visible ml-4 text-[var(--color-gray-500)] hover:text-[var(--color-white)]"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
