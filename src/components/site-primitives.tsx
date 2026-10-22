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
      <svg viewBox="0 0 31 31" fill="none" focusable="false">
        <path
          d="M17.3597 0.172911C16.6236 0.0598538 15.8674 0 15.0911 0C14.3215 0 13.5652 0.0598538 12.8291 0.172911V4.91465C14.4219 5.74596 15.941 6.70361 17.3597 7.77433V0.179561V0.172911Z"
          fill="currentColor"
        />
        <path
          d="M0.80957 10.1552C5.6012 10.7737 9.95115 12.8087 13.411 15.8347C14.194 14.5378 15.0908 13.3142 16.1013 12.1969C12.4407 9.09114 7.97025 6.88986 3.05816 5.9588C2.09448 7.21573 1.33156 8.63227 0.80957 10.1619V10.1552Z"
          fill="#235bf0"
        />
        <path
          d="M0.0200765 14.2386C0.00669204 14.4913 0 14.744 0 15.0034C0 16.3401 0.18069 17.6369 0.508609 18.8673C6.23715 19.9313 10.828 24.2075 12.3137 29.7407C13.2171 29.9069 14.1407 30.0001 15.091 30.0001C15.7401 30.0001 16.3692 29.9535 16.9982 29.8737C15.3854 21.6272 8.52589 15.2162 0.0200765 14.2319V14.2386Z"
          fill="currentColor"
        />
        <path
          d="M16.543 18.8673C17.694 20.3104 18.6778 21.8866 19.4675 23.5758C20.9933 18.6212 25.0354 14.7507 30.1148 13.4406C29.9542 11.911 29.5593 10.4412 28.9637 9.08453C23.5765 10.4745 19.0927 14.0856 16.543 18.8673Z"
          fill="currentColor"
        />
      </svg>
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
}: {
  children?: React.ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <DialogTrigger asChild>
      <Button
        variant={secondary ? "secondary" : "default"}
        className={className}
      >
        {children}
        <Arrow />
      </Button>
    </DialogTrigger>
  );
}
