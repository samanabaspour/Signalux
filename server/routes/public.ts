import { Router, Request, Response } from 'express';
import { store } from '../store';
import { buildSitemap, siteRobots } from '../siteSeo';
import { readTagManagerSettings } from '../backend/services/tag-manager.service';

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
router.get('/settings', async (_req, res, next) => {
  try {
    const { melipayamakUsername, melipayamakSenderNumber, melipayamakOtpBodyId, ...settings } = store.getSettings();
    const tags = await readTagManagerSettings();
    res.json({ success: true, data: { ...settings, ...tags } });
  } catch (error) {
    next(error);
  }
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

router.get('/sitemap.xml', (req, res) => {
  const data = buildSitemap();
  if (req.query.raw === 'true') return res.type('application/xml').send(data.sitemapXml);
  res.json({ success: true, data });
});

router.get('/robots.txt', (req, res) => {
  const robotsTxt = siteRobots();
  if (req.query.raw === 'true') return res.type('text/plain').send(robotsTxt);
  res.json({ success: true, data: { robotsTxt } });
});

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
  const post = store.getBlogPosts('published').find(post => post.slug === slugOrId || post.id === slugOrId);
  if (!post) return res.status(404).json({ success: false, message: 'مقاله پیدا نشد.' });

  // Retrieve comments matching either post id or slug
  const commentsById = store.getComments(post.id, 'approved');
  const commentsBySlug = store.getComments(post.slug, 'approved');
  const combined = Array.from(new Map([...commentsById, ...commentsBySlug].map(c => [c.id, c])).values());

  res.json({
    success: true,
    data: combined.map(({ authorEmail, ...comment }) => comment)
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

  const post = store.getBlogPosts('published').find(post => post.slug === slugOrId || post.id === slugOrId);
  if (!post) return res.status(404).json({ success: false, message: 'مقاله پیدا نشد.' });

  const newComment = store.createComment({
    postId: post.id,
    postTitle: post.title,
    authorName,
    authorEmail: authorEmail || '',
    content,
    rating: typeof rating === 'number' ? rating : 5
  });

  const { authorEmail: privateEmail, ...comment } = newComment;
  res.status(201).json({
    success: true,
    message: 'دیدگاه ثبت شد و در انتظار بررسی است.',
    data: comment
  });
});

export default router;
