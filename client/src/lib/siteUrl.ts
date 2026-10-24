export const SITE_ORIGIN = "https://list.abitingpokedex.com";

/**
 * GitHub Pages serves directory index files on the trailing-slash URL.
 * Keep every first-party URL in that canonical directory form.
 */
export function withTrailingSlash(path: string): string {
  if (!path || path === "/") return "/";

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedPath.replace(/\/+$/, "")}/`;
}

export function toSiteUrl(path: string): string {
  return `${SITE_ORIGIN}${withTrailingSlash(path)}`;
}

export function updatePageUrlMetadata(path: string): string {
  const url = toSiteUrl(path);

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    document.head.appendChild(ogUrl);
  }
  ogUrl.content = url;

  return url;
}
