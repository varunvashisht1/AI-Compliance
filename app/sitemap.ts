import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = ["", "/how-it-works", "/compare", "/about", "/privacy", "/terms"];
  return paths.map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1.0 : 0.7,
  }));
}
