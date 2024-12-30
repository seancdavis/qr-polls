export default defineEventHandler((event) => {
  const urlPath = getRequestURL(event).pathname;

  if (!urlPath.startsWith("/polls/")) {
    return;
  }

  // Set the cache tag for individual poll pages
  const id = urlPath.split("/")[2];
  event.headers.set("Netlify-Cache-Tag", `poll-${id}-page`);
});
