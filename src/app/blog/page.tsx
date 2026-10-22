import type { Metadata } from "next";
import { BlogIndex } from "@/components/pages/blog-index";
export const metadata: Metadata = {
  title: "Insights \u2014 Fresh Thinking, Forward Motion \u2014 Vectramind",
  description:
    "Explore healthcare insights, technology stories and ideas from Vectramind.",
};
export default function Page() {
  return <BlogIndex />;
}
