import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkObsidianImageEmbeds from "./src/markdown/remark-obsidian-image-embeds.mjs";

export default defineConfig({
  site: "https://rfv-vorderrhoen.de",
  base: "/",
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
      config: {}
    }
  },
  markdown: {
    remarkPlugins: [remarkObsidianImageEmbeds]
  },
  i18n: {
    locales: ["de"],
    defaultLocale: "de",
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkObsidianImageEmbeds]
    }),
    react(),
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
