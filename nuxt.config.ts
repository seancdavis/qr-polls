export default defineNuxtConfig({
  compatibilityDate: "2024-12-24",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxtjs/tailwindcss"],
  routeRules: {
    "/": {
      static: true,
    },
    "/thank-you": {
      static: true,
    },
    "/polls/**": {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control":
          "public, max-age=300, stale-while-revalidate=31536000, durable",
      },
    },
  },
});
