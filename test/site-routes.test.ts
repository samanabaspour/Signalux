import assert from 'node:assert/strict';
import { buildSitemap, canonicalOrigin, renderSitePage, resolvePage, siteRobots } from '../server/siteSeo';
import { canonicalPath, resolveRoute } from '../src/utils/router';

assert.equal(canonicalPath(resolveRoute('/about-us')), '/about');
assert.equal(canonicalPath(resolveRoute('/services/seo/')), '/services/seo');
assert.equal(canonicalPath(resolveRoute('/portfolio/berlin-beauty')), '/projects/berlin-beauty');
assert.equal(resolveRoute('/blog/%E2').view, 'not-found');
assert.equal(resolveRoute('/projects/unexpected/path').view, 'not-found');
assert.equal(resolvePage('/projects/unknown-project'), null);
assert.equal(resolvePage('/blog/unknown-article'), null);
assert.equal(resolvePage('/account')?.noIndex, true);
assert.equal(resolveRoute('/admin').view, 'not-found');
assert.equal(resolvePage('/admin'), null);
assert.equal(resolvePage('/admin/login'), null);
assert.equal(resolveRoute('/saman-panel').view, 'admin');
assert.equal(canonicalPath(resolveRoute('/saman-panel')), '/saman-panel');
assert.equal(resolvePage('/saman-panel')?.noIndex, true);
assert.equal(resolvePage('/projects/berlin-beauty')?.path, '/projects/berlin-beauty');

const template = '<head><title>Default</title><meta name="description" content="Default"></head><div id="root"></div>';
const service = renderSitePage(template, resolvePage('/services/seo'));
assert.match(service, /<h1>سئو و بهینه‌سازی سایت<\/h1>/);
assert.ok(service.includes(`rel="canonical" href="${canonicalOrigin()}/services/seo"`));
assert.match(renderSitePage(template, resolvePage('/account')), /content="noindex, follow"/);
assert.doesNotMatch(renderSitePage(template, null), /rel="canonical"/);

const originalVerification = process.env.GSC_VERIFICATION_CODE;
try {
  process.env.GSC_VERIFICATION_CODE = 'signalux-local-verification';
  const home = renderSitePage(template, resolvePage('/'));
  assert.equal([...home.matchAll(/name="google-site-verification"/g)].length, 1);
  assert.match(home, /content="signalux-local-verification"/);
  assert.doesNotMatch(renderSitePage(template, resolvePage('/services')), /google-site-verification/);
  process.env.GSC_VERIFICATION_CODE = 'invalid value';
  assert.doesNotMatch(renderSitePage(template, resolvePage('/')), /google-site-verification/);
} finally {
  if (originalVerification === undefined) delete process.env.GSC_VERIFICATION_CODE;
  else process.env.GSC_VERIFICATION_CODE = originalVerification;
}

const sitemap = buildSitemap();
assert.ok(sitemap.sitemapXml.includes(`<loc>${canonicalOrigin()}/projects/berlin-beauty</loc>`));
assert.doesNotMatch(sitemap.sitemapXml, /\/(admin|saman-panel|account|portfolio)<\/loc>/);
assert.equal([...sitemap.sitemapXml.matchAll(/<url>/g)].length, sitemap.urlCount);
assert.ok(siteRobots().includes(`Sitemap: ${canonicalOrigin()}/sitemap.xml`));
console.log('Signalux route and SEO assertions passed.');
