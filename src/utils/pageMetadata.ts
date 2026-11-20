export function applyPageMetadata(page: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
}): void {
  const previousCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const origin = previousCanonical ? new URL(previousCanonical.href).origin
    : import.meta.env.VITE_SITE_URL || 'https://signalux.ir';
  document.title = page.title + ' | Signalux Studio';

  function setMeta(key: 'name' | 'property', name: string, value?: string) {
    const existing = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${name}"]`);
    if (!value) {
      existing?.remove();
      return;
    }
    const meta = existing ?? document.createElement('meta');
    meta.setAttribute(key, name);
    meta.content = value;
    if (!existing) document.head.append(meta);
  }

  if (page.path) {
    const canonical = previousCanonical ?? document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = new URL(page.path, origin).href;
    if (!previousCanonical) document.head.append(canonical);
    setMeta('property', 'og:url', canonical.href);
  } else {
    previousCanonical?.remove();
    setMeta('property', 'og:url');
  }

  setMeta('name', 'description', page.description);
  setMeta('name', 'robots', page.noIndex ? 'noindex, follow' : undefined);
  setMeta('property', 'og:title', document.title);
  setMeta('property', 'og:description', page.description);
  setMeta('property', 'og:image', page.image);
}
