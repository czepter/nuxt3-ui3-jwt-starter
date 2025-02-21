// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/ui", "@vueuse/nuxt", "nuxt-jwt-auth", "nuxt-gravatar", "nuxt-viewport"],
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    API_URL: process.env.NUXT_API_URL,
  },

  nuxtJwtAuth: {
    baseUrl: "/api", // URL of your backend
    endpoints: {
      login: "/auth/login", // Where to request login (POST)
      logout: "auth/logout", // Where to request logout (POST)
      user: "/account", // Where to request user data (GET)
      signup: "/auth/register", // Where to request signup (POST)
    },
    redirects: {
      home: "/", // Where to redirect after successfull login and logout
      login: "/login", // Where to redirect if user is not logged in and accesses a logged-only route
      logout: "/logout", // Where to redirect if user is logged in and accesses a guest-only route
    },
  },
});