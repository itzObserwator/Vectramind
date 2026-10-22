"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Arrow, ContactButton } from "@/components/site-primitives";

const navigation = [
  ["Synapse", "/synapse"],
  ["Firstpass", "/firstpass"],
  ["Capabilities", "/capabilities"],
  ["About us", "/about"],
  ["Support", "/support"],
];
export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <header
      className={`header ${scrolled ? "header-scrolled" : ""} ${pathname !== "/" ? "header-inner" : "header-home"}`}
    >
      <Link href="/" aria-label="Vectramind home" className="logo">
        <img
          src="/images/vectramind-logo.svg"
          alt="Vectramind"
          fetchPriority="high"
          width="205"
          height="40"
        />
      </Link>
      <nav aria-label="Main navigation" className="desktop-nav">
        {navigation.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              pathname === href || pathname === href + "/" ? "page" : undefined
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <ContactButton>Consultation</ContactButton>
        <button
          className="menu-button"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="mobile-nav"
          onClick={() => setMenu(!menu)}
        >
          <HugeiconsIcon icon={menu ? Cancel01Icon : Menu01Icon} size={24} />
        </button>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {[
              ...navigation,
              ["Our clients", "/#clients"],
              ["Insights", "/blog"],
              ["Careers", "/careers"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenu(false)}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
                <Arrow />
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
