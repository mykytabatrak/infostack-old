export const getURL = () => {
  let url = import.meta.env.VITE_VERCEL_URL ?? "http://localhost:5173/";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
};
