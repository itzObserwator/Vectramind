import { SiteShell } from "@/components/site-shell";
export default function Template({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
