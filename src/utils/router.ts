import manifest from '../../site-pages.json';

export const staticPages = manifest.pages;
export type StaticView = keyof typeof staticPages;
export type AppView = StaticView | 'project-detail' | 'blog-detail' | 'not-found';

export interface RouteInfo {
  view: AppView;
  param?: string;
}

export const ROUTE_PATHS = {
  home: staticPages.home.path,
  about: staticPages.about.path,
  services: staticPages.services.path,
  'web-design': staticPages['web-design'].path,
  seo: staticPages.seo.path,
  'projects-list': staticPages['projects-list'].path,
  'project-detail': (id: string) => `/projects/${encodeURIComponent(id)}`,
  'testimonials-media': staticPages['testimonials-media'].path,
  contact: staticPages.contact.path,
  blog: staticPages.blog.path,
  'blog-detail': (slug: string) => `/blog/${encodeURIComponent(slug)}`,
  account: staticPages.account.path,
  admin: staticPages.admin.path,
};

export const publicPages = Object.entries(staticPages)
  .filter(([view]) => view !== 'admin' && view !== 'account')
  .map(([, page]) => page);

export function isPrivateView(view: AppView): boolean {
  return view === 'admin' || view === 'account';
}

export function resolveRoute(path: string): RouteInfo {
  const normalized = path.replace(/\/+$/, '') || '/';
  const lowercase = normalized.toLowerCase();
  const canonical = Object.hasOwn(manifest.aliases, lowercase)
    ? manifest.aliases[lowercase as keyof typeof manifest.aliases]
    : lowercase;
  const staticView = (Object.keys(staticPages) as StaticView[]).find(view => staticPages[view].path === canonical);
  if (staticView) return { view: staticView };

  const match = /^\/(blog|projects|portfolio)\/([^/]+)$/i.exec(normalized);
  if (!match) return { view: 'not-found' };
  try {
    const param = decodeURIComponent(match[2]);
    if (!param || /[/\\\p{Cc}]/u.test(param) || param === '.' || param === '..') {
      return { view: 'not-found' };
    }
    return { view: match[1].toLowerCase() === 'blog' ? 'blog-detail' : 'project-detail', param };
  } catch {
    return { view: 'not-found' };
  }
}

export function canonicalPath(route: RouteInfo): string | null {
  if (route.view === 'not-found') return null;
  const path = ROUTE_PATHS[route.view];
  return typeof path === 'function' ? (route.param ? path(route.param) : null) : path;
}

export function parseCurrentRoute(): RouteInfo {
  if (typeof window === 'undefined') return { view: 'home' };

  if (window.location.pathname === '/' && window.location.hash) {
    const legacyRoute = resolveRoute('/' + window.location.hash.replace(/^#\/?/, ''));
    const path = canonicalPath(legacyRoute);
    if (path && path !== '/') {
      window.history.replaceState(null, '', path + window.location.search);
      return legacyRoute;
    }
  }
  return resolveRoute(window.location.pathname);
}

export function navigateTo(path: string, options?: { replace?: boolean; scrollToTop?: boolean }) {
  if (typeof window === 'undefined') return;

  const nextUrl = new URL(path, window.location.href);
  if (isPrivateView(resolveRoute(window.location.pathname).view) !== isPrivateView(resolveRoute(nextUrl.pathname).view)) {
    // A new document keeps public analytics scripts out of the account and admin interfaces.
    if (options?.replace) window.location.replace(path);
    else window.location.assign(path);
    return;
  }

  if (window.location.pathname + window.location.search + window.location.hash !== path) {
    if (options?.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
  }

  if (options?.scrollToTop !== false) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.dispatchEvent(new Event('popstate'));
}
