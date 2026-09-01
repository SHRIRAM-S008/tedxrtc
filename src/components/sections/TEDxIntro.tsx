import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { FloatingGallery } from "./FloatingGallery";

/** Chapter 2's continuation — same content/structure as the former `About`,
 * now reached after TEDxArrival rather than opening the page. */
export function TEDxIntro() {
  return (
    <section id="tedx" className="relative bg-[var(--color-black)] overflow-hidden py-20 lg:py-40">
      <div className="container mx-auto px-6 lg:px-16">
        <FloatingGallery>
          <div className="flex flex-col items-center gap-12 text-center">
            <RevealOnScroll>
              <h2 className="text-display-l text-white">What is TEDxRTC?</h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="flex flex-col gap-4">
                <h3 className="text-eyebrow text-[var(--color-gray-500)]">What is TEDx</h3>
                <p className="text-body-l text-[var(--color-gray-100)]">
                  TED is a global platform for ideas that change how we think, work, and live. TEDx brings that same energy to local communities — independently organized, globally connected.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="flex flex-col gap-4">
                <h3 className="text-eyebrow text-[var(--color-gray-500)]">What is TEDxRTC</h3>
                <p className="text-body-l text-[var(--color-gray-100)]">
                  TEDxRathinam Technical Campus is Coimbatore’s student-led stage for bold ideas. We bring together thinkers, builders, and doers from campus and beyond — to spark conversations that don’t end when the event does.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="flex flex-col gap-3 pt-4">
                <h3 className="text-eyebrow text-[var(--color-red)]">WRITTEN, REWRITTEN, DELIVERED</h3>
                <p className="text-body-l text-[var(--color-white)]">
                  <strong className="font-heading text-h3 block mb-2 font-normal text-[var(--color-red)]">The Unfinished.</strong>
                  Every generation inherits something — a problem, a movement, a dream — left incomplete by those before them. This year, we ask: what did you inherit, and what will you do with it?
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </FloatingGallery>
      </div>
    </section>
  );
}
