export default defineNuxtPlugin({
  setup() {
    const { loggedIn, token } = useJwtAuth();

    const api = $fetch.create({
      baseURL: "/api/",

      onRequest({ request, options, error }) {
        const authToken = `Bearer ${token.value}`;
        if (loggedIn) {
          const headers = (options.headers ||= {});
          if (Array.isArray(headers)) {
            headers.push(["Authorization", authToken]);
          } else if (headers instanceof Headers) {
            headers.set("Authorization", authToken);
          } else {
            headers.Authorization = authToken;
          }
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await navigateTo("/login");
        }
      },
    });

    // Expose to useNuxtApp().$api
    return {
      provide: {
        api,
      },
    };
  },
});
