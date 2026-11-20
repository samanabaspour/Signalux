import { store } from './store';
import { canonicalPath, isPrivateView, publicPages, resolveRoute, ROUTE_PATHS, staticPages } from '../src/utils/router';

export interface PageMetadata {
  path: string;
  heading: string;
  title: string;
  description: string;
  noIndex?: boolean;
  image?: string;
  links?: { path: string; heading: string }[];
}

const missingPage: PageMetadata = {
  path: '/404',
  heading: 'صفحه پیدا نشد',
  title: 'صفحه پیدا نشد',
  description: 'این نشانی دیگر در دسترس نیست. از پیوندهای زیر برای ادامه استفاده کنید.',
  noIndex: true,
};

export function canonicalOrigin(): string {
  const configured = process.env.APP_URL || store.getSeoSettings().canonicalBaseUrl;
  try {
    const url = new URL(configured);
    if ((url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password) {
      return url.origin;
    }
  } catch {
    // Use the production origin when no valid site origin was configured.
  }
  return 'https://signalux.ir';
}

export function resolvePage(pathname: string): PageMetadata | null {
  const route = resolveRoute(pathname);
  const path = canonicalPath(route);
  if (route.view === 'not-found' || path === null) return null;

  if (route.view === 'blog-detail') {
    const post = store.findBlogPost(route.param!);
    if (!post || post.status !== 'published') return null;
    return {
      path: ROUTE_PATHS['blog-detail'](post.slug),
      heading: post.title,
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      image: post.ogImage || post.featuredImage,
      noIndex: post.noIndex,
    };
  }

  if (route.view === 'project-detail') {
    const project = store.getProjectById(route.param!);
    if (!project) return null;
    return {
      path: ROUTE_PATHS['project-detail'](project.slug || project.id),
      heading: project.title, title: project.title,
      description: project.summary, image: project.thumbnail,
    };
  }

  const page = { ...staticPages[route.view], noIndex: isPrivateView(route.view) };
  if (route.view === 'projects-list') {
    return { ...page, links: store.getProjects().map(project => ({
      path: ROUTE_PATHS['project-detail'](project.slug || project.id), heading: project.title,
    })) };
  }
  if (route.view === 'blog') {
    return { ...page, links: store.getBlogPosts('published').map(post => ({
      path: ROUTE_PATHS['blog-detail'](post.slug), heading: post.title,
    })) };
  }
  return page;
}

function escapeMarkup(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

export function renderSitePage(template: string, page: PageMetadata | null): string {
  const metadata = page ?? missingPage;
  const origin = canonicalOrigin();
  const canonical = escapeMarkup(origin + metadata.path);
  const title = escapeMarkup(metadata.title + ' | Signalux Studio');
  const description = escapeMarkup(metadata.description);
  const gscCode = process.env.GSC_VERIFICATION_CODE?.trim() || '';
  const head = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    metadata.path === '/' && /^[A-Za-z0-9_-]{1,200}$/.test(gscCode)
      ? `<meta name="google-site-verification" content="${gscCode}">` : '',
    page ? `<link rel="canonical" href="${canonical}">` : '',
    metadata.noIndex ? '<meta name="robots" content="noindex, follow">' : '',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    page ? `<meta property="og:url" content="${canonical}">` : '',
    metadata.image ? `<meta property="og:image" content="${escapeMarkup(metadata.image)}">` : '',
  ].join('\n');

  const links = (metadata.links || publicPages).slice(0, 100).map(link =>
    `<li><a href="${escapeMarkup(link.path)}">${escapeMarkup(link.heading)}</a></li>`).join('');
  const body = `<div id="root"><main><h1>${escapeMarkup(metadata.heading)}</h1><p>${description}</p><ul>${links}</ul></main></div>`;
  return template
    .replace(/<title>[\s\S]*?<\/title>\s*<meta name="description"[^>]*>/, () => head)
    .replace('<div id="root"></div>', () => body);
}

export function buildSitemap() {
  const baseUrl = canonicalOrigin();
  const entries: { path: string; updatedAt?: string }[] = publicPages.map(page => ({ path: page.path }));
  for (const project of store.getProjects()) {
    entries.push({ path: ROUTE_PATHS['project-detail'](project.slug || project.id) });
  }
  for (const post of store.getBlogPosts('published')) {
    if (!post.noIndex) entries.push({ path: ROUTE_PATHS['blog-detail'](post.slug), updatedAt: post.updatedAt || post.publishedAt });
  }
  const urls = entries.map(({ path, updatedAt }) => {
    const date = updatedAt && /^\d{4}-\d{2}-\d{2}(?:T|\s|$)/.test(updatedAt) ? updatedAt.slice(0, 10) : '';
    return `  <url><loc>${escapeMarkup(baseUrl + path)}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`;
  });
  const sitemapXml = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>'].join('\n');
  return { sitemapXml, urlCount: entries.length, baseUrl };
}

export function siteRobots(): string {
  const configured = store.getSeoSettings().robotsTxt || 'User-agent: *\nDisallow: /api/';
  const directives = configured.split(/\r?\n/).filter(line => !/^\s*sitemap:/i.test(line)).join('\n').trim();
  return `${directives}\n\nSitemap: ${canonicalOrigin()}/sitemap.xml\n`;
}
