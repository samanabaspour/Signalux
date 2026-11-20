// Signalux Client-side SPA Router Utility
// Provides clean, independent URLs for all pages and components

export type AppView =
  | 'home'
  | 'about'
  | 'services'
  | 'web-design'
  | 'seo'
  | 'testimonials-media'
  | 'projects-list'
  | 'project-detail'
  | 'contact'
  | 'blog'
  | 'blog-detail'
  | 'account'
  | 'admin';

export interface RouteState {
  view: AppView;
  param?: string; // slug or id for blog or project
}

export type RouteInfo = RouteState;

export const ROUTE_PATHS = {
  home: '/',
  about: '/about',
  services: '/services',
  'web-design': '/services/web-design',
  seo: '/services/seo',
  'projects-list': '/projects',
  'project-detail': (id: string) => `/projects/${encodeURIComponent(id)}`,
  'testimonials-media': '/testimonials',
  contact: '/contact',
  blog: '/blog',
  'blog-detail': (slugOrId: string) => `/blog/${encodeURIComponent(slugOrId)}`,
  account: '/account',
  admin: '/admin',
};

/**
 * Parses current window.location into view and param
 */
export function parseCurrentRoute(): RouteState {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }

  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

  // Check admin
  if (pathname === '/admin' || hash === 'admin') {
    return { view: 'admin' };
  }

  // Check user account / tickets
  if (pathname === '/account' || pathname === '/profile' || hash === 'account' || hash === 'profile') {
    return { view: 'account' };
  }

  // Check blog detail: /blog/:slug or #blog/:slug
  const blogDetailMatch = pathname.match(/^\/blog\/(.+)$/) || hash.match(/^blog\/(.+)$/);
  if (blogDetailMatch && blogDetailMatch[1]) {
    return { view: 'blog-detail', param: decodeURIComponent(blogDetailMatch[1]) };
  }

  // Check blog listing
  if (pathname === '/blog' || pathname === '/articles' || hash === 'blog') {
    return { view: 'blog' };
  }

  // Check project detail: /projects/:id or /portfolio/:id
  const projectDetailMatch = pathname.match(/^\/(?:projects|portfolio)\/(.+)$/) || hash.match(/^(?:projects|portfolio)\/(.+)$/);
  if (projectDetailMatch && projectDetailMatch[1]) {
    return { view: 'project-detail', param: decodeURIComponent(projectDetailMatch[1]) };
  }

  // Check projects listing
  if (pathname === '/projects' || pathname === '/portfolio' || hash === 'projects' || hash === 'portfolio') {
    return { view: 'projects-list' };
  }

  // Check testimonials
  if (pathname === '/testimonials' || pathname === '/reviews' || hash === 'testimonials') {
    return { view: 'testimonials-media' };
  }

  // Check about
  if (pathname === '/about' || pathname === '/about-us' || hash === 'about') {
    return { view: 'about' };
  }

  // Check contact
  if (pathname === '/contact' || pathname === '/contact-us' || hash === 'contact') {
    return { view: 'contact' };
  }

  // Check services
  if (pathname === '/services/web-design' || hash === 'services/web-design') {
    return { view: 'web-design' };
  }
  if (pathname === '/services/seo' || hash === 'services/seo') {
    return { view: 'seo' };
  }
  if (pathname === '/services' || hash === 'services') {
    return { view: 'services' };
  }

  // Fallback to home
  return { view: 'home' };
}

/**
 * Navigate to a specific URL path with HTML5 history update
 */
export function navigateTo(path: string, options?: { replace?: boolean; scrollToTop?: boolean }) {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search;
  if (currentPath !== path) {
    if (options?.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
  }

  if (options?.scrollToTop !== false) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Dispatch custom popstate-like event so all subscribers re-evaluate
  window.dispatchEvent(new Event('popstate'));
}
