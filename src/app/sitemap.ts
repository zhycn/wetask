import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://wetask.cc",
      lastModified: new Date("2026-11-20"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
