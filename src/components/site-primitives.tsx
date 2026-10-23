"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
export const Arrow = () => (
  <HugeiconsIcon icon={ArrowUpRight01Icon} size={19} strokeWidth={1.6} />
);
export function Mark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <img src="/images/vectramind-mark.svg" alt="" width="31" height="30" />
    </span>
  );
}
export function SectionLabel({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: string;
}) {
  return (
    <div className="section-label">
      <span>
        <span className="label-dot" />
        {children}
      </span>
      <span>{right}</span>
    </div>
  );
}
export function ContactButton({
  children = "Let’s talk",
  secondary = false,
  className = "",
  showArrow = true,
}: {
  children?: React.ReactNode;
  secondary?: boolean;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <DialogTrigger asChild>
      <Button
        variant={secondary ? "secondary" : "default"}
        className={className}
      >
        {children}
        {showArrow && <Arrow />}
      </Button>
    </DialogTrigger>
  );
}
