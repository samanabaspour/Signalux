import { Router, Request, Response } from 'express';
import { store } from '../store';

const router = Router();

// GET /api/v1/public/services
router.get('/services', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.getServices()
  });
});

// GET /api/v1/public/services/:id
router.get('/services/:id', (req: Request, res: Response) => {
  const service = store.getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, data: service });
});

// GET /api/v1/public/projects
router.get('/projects', (req: Request, res: Response) => {
  const { category } = req.query;
  let projects = store.getProjects();
  if (category && typeof category === 'string' && category !== 'all') {
    projects = projects.filter(p => p.category === category);
  }
  res.json({
    success: true,
    data: projects
  });
});

// GET /api/v1/public/projects/:id
router.get('/projects/:id', (req: Request, res: Response) => {
  const project = store.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

// GET /api/v1/public/settings
router.get('/settings', (req: Request, res: Response) => {
  res.json({ success: true, data: store.getSettings() });
});

// GET /api/v1/public/testimonials
router.get('/testimonials', (req: Request, res: Response) => {
  res.json({ success: true, data: store.getTestimonials() });
});

// GET /api/v1/public/certificates
router.get('/certificates', (req: Request, res: Response) => {
  res.json({ success: true, data: store.getCertificates() });
});

// GET /api/v1/public/faqs
router.get('/faqs', (req: Request, res: Response) => {
  res.json({ success: true, data: store.getFaqs() });
});

// GET /api/v1/public/blog (or /api/v1/blog)
router.get('/blog', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let posts = store.getBlogPosts('published');
  
  if (category && typeof category === 'string' && category !== 'all' && category !== 'همه') {
    posts = posts.filter(p => p.category === category);
  }
  
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  
  res.json({ success: true, data: posts });
});

// GET /api/v1/public/blog/:slug
router.get('/blog/:slug', (req: Request, res: Response) => {
  const post = store.getBlogPostBySlug(req.params.slug);
  if (!post || post.status !== 'published') {
    return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد.' });
  }
  res.json({ success: true, data: post });
});

// GET /api/v1/public/seo (or /api/v1/seo)
router.get('/seo', (req: Request, res: Response) => {
  res.json({ success: true, data: store.getSeoSettings() });
});

// GET /api/v1/public/sitemap.xml (or /sitemap.xml)
router.get('/sitemap.xml', (req: Request, res: Response) => {
  const seo = store.getSeoSettings();
  const baseUrl = (seo.canonicalBaseUrl || 'https://signalux.ir').replace(/\/$/, '');
  const posts = store.getBlogPosts('published');
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    { path: '/about-us', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact-us', priority: '0.8', changefreq: 'monthly' },
    { path: '/web-design', priority: '0.85', changefreq: 'weekly' },
    { path: '/seo-services', priority: '0.85', changefreq: 'weekly' },
  ];

  staticRoutes.forEach(r => {
    xml += `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
  });

  posts.forEach(p => {
    const postDate = p.publishedAt ? p.publishedAt.split('T')[0] : today;
    xml += `  <url>\n    <loc>${baseUrl}/blog/${p.slug}</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;

  if (req.query.raw === 'true') {
    res.setHeader('Content-Type', 'application/xml');
    return res.send(xml);
  }

  res.json({
    success: true,
    data: {
      sitemapXml: xml,
      urlCount: staticRoutes.length + posts.length,
      baseUrl,
      generatedAt: new Date().toISOString()
    }
  });
});

// GET /api/v1/public/robots.txt (or /robots.txt)
router.get('/robots.txt', (req: Request, res: Response) => {
  const seo = store.getSeoSettings();
  if (req.query.raw === 'true') {
    res.setHeader('Content-Type', 'text/plain');
    return res.send(seo.robotsTxt);
  }
  res.json({ success: true, data: { robotsTxt: seo.robotsTxt } });
});

// POST /api/v1/public/consultation
router.post('/consultation', (req: Request, res: Response) => {
  const { name, email, phone, service, budget, message } = req.body || {};
  
  if (!name || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: 'نام و حداقل یکی از موارد ایمیل یا شماره تماس الزامی است.'
    });
  }

  const newLead = store.addLead({
    type: 'consultation',
    name,
    email: email || '',
    phone: phone || '',
    service: service || '',
    budget: budget || '',
    message: message || ''
  });

  res.status(201).json({
    success: true,
    message: 'درخواست مشاوره شما با موفقیت ثبت شد و به زودی با شما تماس خواهیم گرفت.',
    data: newLead
  });
});

// POST /api/v1/public/contact
router.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body || {};

  if (!name || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: 'نام و حداقل یکی از راه های ارتباطی (ایمیل یا شماره تلفن) الزامی است.'
    });
  }

  const newLead = store.addLead({
    type: 'contact',
    name,
    email: email || '',
    phone: phone || '',
    message: message || ''
  });

  res.status(201).json({
    success: true,
    message: 'پیام شما با موفقیت دریافت شد.',
    data: newLead
  });
});

// --- BLOG COMMENTS ENDPOINTS ---
// GET /api/v1/public/blog/:slugOrId/comments
router.get('/blog/:slugOrId/comments', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const post = store.getBlogPostBySlug(slugOrId);
  const postId = post ? post.id : slugOrId;
  const postSlug = post ? post.slug : slugOrId;

  // Retrieve comments matching either post id or slug
  const commentsById = store.getComments(postId, 'approved');
  const commentsBySlug = store.getComments(postSlug, 'approved');
  const combined = Array.from(new Map([...commentsById, ...commentsBySlug].map(c => [c.id, c])).values());

  res.json({
    success: true,
    data: combined
  });
});

// POST /api/v1/public/blog/:slugOrId/comments
router.post('/blog/:slugOrId/comments', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const { authorName, authorEmail, content, rating } = req.body || {};

  if (!authorName || !content) {
    return res.status(400).json({
      success: false,
      message: 'نام و متن دیدگاه الزامی است.'
    });
  }

  const post = store.getBlogPostBySlug(slugOrId);
  const targetId = post ? post.id : slugOrId;
  const targetTitle = post ? post.title : 'مقاله وبلاگ';

  const newComment = store.createComment({
    postId: targetId,
    postTitle: targetTitle,
    authorName,
    authorEmail: authorEmail || '',
    content,
    rating: typeof rating === 'number' ? rating : 5
  });

  res.status(201).json({
    success: true,
    message: 'دیدگاه شما با موفقیت ثبت شد و منتشر گردید.',
    data: newComment
  });
});

export default router;
