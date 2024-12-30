const staticCacheHeaders = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Netlify-CDN-Cache-Control": "public, max-age=300, stale-while-revalidate=31536000, durable",
};

export default defineNuxtConfig({
  compatibilityDate: "2024-12-24",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxtjs/tailwindcss"],
  routeRules: {
    "/": {
      prerender: true,
      headers: staticCacheHeaders,
    },
    "/thank-you": {
      prerender: true,
      headers: staticCacheHeaders,
    },
    "/polls/**": {
      headers: staticCacheHeaders,
    },
  },
});
