"use client";
import Link from "next/link";

import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { Arrow } from "@/components/site-primitives";
export function ContactDialog() {
  return (
    <DialogContent>
      <span className="eyebrow">A conversation is a good beginning</span>
      <DialogTitle className="display dialog-title">
        Let’s evolve.
        <br />
        Together.
      </DialogTitle>
      <DialogDescription className="dialog-description">
        Tell our team what you have in mind. Explore Synapse, Firstpass, or a
        solution built around your business.
      </DialogDescription>
      <div className="contact-options">
        <DialogClose asChild>
          <Link href="/firstpass">
            Explore Firstpass <Arrow />
          </Link>
        </DialogClose>
        <DialogClose asChild>
          <Link href="/synapse">
            Explore Synapse <Arrow />
          </Link>
        </DialogClose>
        <DialogClose asChild>
          <Link href="/contact">
            Contact the Vectramind team <Arrow />
          </Link>
        </DialogClose>
      </div>
      <p className="contact-note">
        Explore our platforms or tell us what you have in mind.
      </p>
    </DialogContent>
  );
}
