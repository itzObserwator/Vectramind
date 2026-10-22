"use client";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message01Icon,
  AiBrain01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

import { platformBenefits } from "@/content/site";

import { Arrow, Mark, SectionLabel } from "@/components/site-primitives";
import { MacBookMockup } from "@/components/visuals/macbook-mockup";

gsap.registerPlugin(ScrollTrigger);

export function PlatformShowcase() {
  const [platform, setPlatform] = useState<"synapse" | "firstpass">("synapse");
  const showcase = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: reduce)", () => {
      setReduced(true);
      return () => setReduced(false);
    });
    media.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = showcase.current;
        const display = track?.querySelector<HTMLElement>(".platform-display");
        const device = track?.querySelector<HTMLElement>(".macbook-mockup");
        if (!track || !display || !device) return;
        const pedestal = device.querySelector<HTMLElement>(".macbook-pedestal");
        // Start with the entire laptop and plinth in view. Zoom from the lid's
        // top edge so the keyboard drops out of frame, as in the recording.
        const startScale = () =>
          Math.min(
            0.72,
            (display.clientHeight - 48) /
              (device.offsetHeight + (pedestal?.offsetHeight || 0)),
          );
        const endScale = () =>
          (display.clientHeight - 36) /
          device.querySelector<HTMLElement>(".macbook-lid")!.offsetHeight;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .fromTo(
            device,
            { scale: startScale },
            { scale: endScale, duration: 0.78 },
            0,
          )
          .fromTo(
            track,
            { "--dashboard-reveal": 0.35 },
            { "--dashboard-reveal": 1, duration: 0.55 },
            0.16,
          )
          .to(device, { scale: endScale, duration: 0.22 }, 0.78);
        const resize = new ResizeObserver(() =>
          timeline.scrollTrigger?.refresh(),
        );
        resize.observe(device);
        resize.observe(display);
        return () => {
          resize.disconnect();
          gsap.set(device, { clearProps: "transform,transformOrigin" });
          track.style.removeProperty("--dashboard-reveal");
        };
      },
      showcase,
    );
    return () => media.revert();
  }, []);
  useEffect(() => {
    const selectFromHash = () => {
      if (location.hash === "#firstpass") setPlatform("firstpass");
      if (location.hash === "#synapse") setPlatform("synapse");
    };
    const selectFromLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const href = event.target.closest("a")?.getAttribute("href");
      if (href === "#firstpass") setPlatform("firstpass");
      if (href === "#synapse") setPlatform("synapse");
    };
    selectFromHash();
    document.addEventListener("click", selectFromLink);
    window.addEventListener("hashchange", selectFromHash);
    return () => {
      document.removeEventListener("click", selectFromLink);
      window.removeEventListener("hashchange", selectFromHash);
    };
  }, []);
  return (
    <section className="platform-section page-padding section-space">
      <SectionLabel right="04 / Built around you">Working with us</SectionLabel>
      <h2 className="display section-heading" data-reveal>
        Better connections.
        <br />
        Bigger possibilities.
        <br />
        <span className="muted">With Vectramind.</span>
      </h2>
      <div className="benefit-grid">
        <div className="benefit-intro">
          <Mark />
          <h3>
            Two platforms.
            <br />
            One human ambition.
          </h3>
          <p>
            Bring meaningful engagement to every conversation and every step of
            the patient journey.
          </p>
        </div>
        <div className="benefit-list">
          {platformBenefits.map((b, i) => (
            <div key={b.title} data-reveal>
              <span>0{i + 1}</span>
              <div>
                <h4>{b.title}</h4>
                <p>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="platform-showcase-track" ref={showcase}>
        <div className="platform-showcase-sticky">
          <div
            className="platform-tabs"
            role="tablist"
            aria-label="Explore platforms"
          >
            <button
              role="tab"
              aria-selected={platform === "synapse"}
              onClick={() => setPlatform("synapse")}
            >
              Synapse <span>Customer engagement</span>
            </button>
            <button
              role="tab"
              aria-selected={platform === "firstpass"}
              onClick={() => setPlatform("firstpass")}
            >
              Firstpass <span>Patient experience</span>
            </button>
          </div>
          <div className="platform-display" id="synapse">
            <span
              id="firstpass"
              className="platform-anchor"
              aria-hidden="true"
            />
            <div className="platform-device-positioner">
              <MacBookMockup>
                <div className="platform-device">
                  <div className="device-chrome">
                    <span />
                    <span />
                    <span />
                    <p>vectramind / {platform}</p>
                    <span className="device-status">Connected</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      className="platform-screen-content"
                      key={platform}
                      initial={reduced ? false : { opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.35 }}
                    >
                      {platform === "synapse" ? (
                        <div className="synapse-preview">
                          <div className="preview-side">
                            <img
                              src="/images/synapse.svg"
                              alt="Synapse"
                              width="100"
                              height="35"
                            />
                            <span className="selected">Overview</span>
                            <span>Conversations</span>
                            <span>Campaigns</span>
                            <span>Analytics</span>
                            <span>Integrations</span>
                            <small>Illustrative platform view</small>
                          </div>
                          <div className="preview-main">
                            <div className="preview-heading">
                              <div>
                                <span className="eyebrow">
                                  Your engagement, connected
                                </span>
                                <h3>Every conversation matters.</h3>
                              </div>
                              <Mark />
                            </div>
                            <div className="preview-stats">
                              <div>
                                <span>One platform</span>
                                <strong>Many channels</strong>
                              </div>
                              <div>
                                <span>Real-time insights</span>
                                <strong>Clearer decisions</strong>
                              </div>
                              <div>
                                <span>Built for your business</span>
                                <strong>Ready to scale</strong>
                              </div>
                            </div>
                            <div className="preview-chart">
                              <div className="chart-heading">
                                Connected customer journeys{" "}
                                <span>Illustration</span>
                              </div>
                              <div className="chart-bars">
                                {[
                                  30, 45, 38, 62, 50, 72, 58, 66, 80, 68, 85,
                                  78, 90, 82, 95, 88, 98, 92,
                                ].map((h, i) => (
                                  <i key={i} style={{ height: `${h}%` }} />
                                ))}
                              </div>
                              <div className="chart-axis">
                                <span>Connect</span>
                                <span>Engage</span>
                                <span>Evolve</span>
                              </div>
                            </div>
                            <div className="preview-tags">
                              <span>SMS</span>
                              <span>WhatsApp</span>
                              <span>Email</span>
                              <span>RCS</span>
                              <span>Push</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="firstpass-preview">
                          <img
                            src="/images/firstpass.svg"
                            alt="Firstpass"
                            width="160"
                            height="55"
                          />
                          <span className="eyebrow">
                            Your unified patient experience platform
                          </span>
                          <h3>
                            A connected journey.
                            <br />A better experience.
                          </h3>
                          <div className="patient-journey">
                            {["Schedule", "Check in", "Care", "Engage"].map(
                              (label, i) => (
                                <div key={label}>
                                  <span>0{i + 1}</span>
                                  <strong>{label}</strong>
                                  <HugeiconsIcon
                                    icon={
                                      i === 0
                                        ? Calendar03Icon
                                        : i === 3
                                          ? Message01Icon
                                          : AiBrain01Icon
                                    }
                                    size={34}
                                  />
                                </div>
                              ),
                            )}
                          </div>
                          <small>Illustrative patient journey</small>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </MacBookMockup>
            </div>
          </div>
          <div className="platform-bottom">
            <p>
              {platform === "synapse"
                ? "Turn functional messaging into meaningful conversations."
                : "Take the dis-appointment out of appointments in patient care."}
            </p>
            <Button asChild variant="outline">
              <Link href={`/${platform}`}>
                Explore {platform === "synapse" ? "Synapse" : "Firstpass"}
                <Arrow />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
