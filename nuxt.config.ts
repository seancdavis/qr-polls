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
    },
    "/thank-you": {
      prerender: true,
    },
  },
});
