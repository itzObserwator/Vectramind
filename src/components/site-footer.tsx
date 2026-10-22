"use client";
import Link from "next/link";

import { offices } from "@/content/site";
import { SignalField } from "@/components/visuals/signal-field";

import {
  Arrow,
  SectionLabel,
  ContactButton,
} from "@/components/site-primitives";
export function Footer() {
  return (
    <footer className="footer page-padding">
      <SignalField className="footer-signal" />
      <SectionLabel right="The next chapter starts with a conversation">
        Let’s move forward
      </SectionLabel>
      <div className="footer-cta">
        <h2 className="display" data-reveal>
          Ready to
          <br />
          adapt & evolve?
        </h2>
        <ContactButton className="footer-cta-button">
          Let’s talk <span className="sr-only">about your project</span>
        </ContactButton>
      </div>
      <div className="footer-grid">
        <div>
          <Link href="/" className="logo">
            <img
              src="/images/vectramind-logo.svg"
              alt="Vectramind"
              width="205"
              height="40"
            />
          </Link>
          <p>
            Transforming human experiences.
            <br />
            With you in mind.
          </p>
          <div className="social-links">
            <a
              href="https://www.linkedin.com/company/vectramind/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Arrow />
            </a>
            <a href="https://x.com/vectramind" target="_blank" rel="noreferrer">
              X <Arrow />
            </a>
          </div>
        </div>
        <div>
          <span className="eyebrow">Our platforms</span>
          <Link href="/synapse">Synapse</Link>
          <Link href="/firstpass">Firstpass</Link>
        </div>
        <div>
          <span className="eyebrow">Explore</span>
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/about">About us</Link>
          <Link href="/support">Support</Link>
          <Link href="/blog">Insights</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <span className="eyebrow">Our world</span>
          {offices.map((office) => (
            <a
              key={office}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Vectramind ${office}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              {office}
              <Arrow />
            </a>
          ))}
        </div>
      </div>
      <div className="footer-wordmark display" aria-hidden="true">
        Vectramind<span>®</span>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Vectramind Corporation.</span>
        <div className="footer-legal">
          <Link href="/terms-of-use">Terms of use</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
