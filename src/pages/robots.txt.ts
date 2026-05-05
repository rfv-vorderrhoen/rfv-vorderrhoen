import type { APIRoute } from "astro";

const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("sitemap.xml", new URL(baseUrl, site));

  return new Response(
    [
      "User-agent: Googlebot",
      "User-agent: Googlebot-Image",
      "User-agent: Googlebot-Video",
      "User-agent: Googlebot-News",
      "User-agent: Google-InspectionTool",
      "Allow: /",
      "",
      "User-agent: Google-Extended",
      "Disallow: /",
      "",
      "User-agent: *",
      "Disallow: /",
      "",
      `Sitemap: ${sitemapUrl.toString()}`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
