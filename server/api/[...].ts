import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
  const proxyUrl = useRuntimeConfig().API_URL;

  const path = event.path.replace(/^\/api\//, "");

  const target = joinURL(proxyUrl, path);

  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return proxyRequest(event, target, options);
});
