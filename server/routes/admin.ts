import { Router, Request, Response } from 'express';
import { store } from '../store';
import { authenticateJwt, requirePermissions } from '../backend/common/guards';
import { readTagManagerSettings, saveTagManagerSettings } from '../backend/services/tag-manager.service';

const router = Router();
router.use(authenticateJwt);

// GET /api/v1/admin/stats
router.get('/stats', requirePermissions('dashboard.view'), (req: Request, res: Response) => {
  const services = store.getServices();
  const projects = store.getProjects();
  const leads = store.getLeads();

  res.json({
    success: true,
    data: {
      servicesCount: services.length,
      projectsCount: projects.length,
      leadsCount: leads.length,
      newLeadsCount: leads.filter(l => l.status === 'new').length
    }
  });
});

// GET /api/v1/admin/leads
router.get('/leads', requirePermissions('leads.view'), (req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.getLeads()
  });
});

// PATCH /api/v1/admin/leads/:id/status
router.patch('/leads/:id/status', requirePermissions('leads.manage'), (req: Request, res: Response) => {
  const { status } = req.body || {};
  if (!['new', 'contacted', 'closed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const updated = store.updateLeadStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  res.json({ success: true, data: updated });
});

// DELETE /api/v1/admin/leads/:id
router.delete('/leads/:id', requirePermissions('leads.manage'), (req: Request, res: Response) => {
  const success = store.deleteLead(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  res.json({ success: true, message: 'Lead deleted successfully' });
});

// GET & PUT /api/v1/admin/settings
router.get('/settings', requirePermissions('settings.view'), async (_req, res, next) => {
  try {
    const tags = await readTagManagerSettings();
    res.json({ success: true, data: { ...store.getSettings(), ...tags } });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', requirePermissions('settings.manage'), async (req, res, next) => {
  try {
    const { gtmContainerId, gtmEnabled, ...settings } = req.body ?? {};
    const tags = gtmContainerId !== undefined || gtmEnabled !== undefined
      ? await saveTagManagerSettings({ gtmContainerId, gtmEnabled })
      : await readTagManagerSettings();
    const updated = store.updateSettings(settings);
    res.json({ success: true, data: { ...updated, ...tags } });
  } catch (error) {
    next(error);
  }
});

// Testimonials Admin Routes
router.post('/testimonials', requirePermissions('testimonials.manage'), (req: Request, res: Response) => {
  const created = store.addTestimonial(req.body);
  res.status(201).json({ success: true, data: created });
});

router.put('/testimonials/:id', requirePermissions('testimonials.manage'), (req: Request, res: Response) => {
  const updated = store.updateTestimonial(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/testimonials/:id', requirePermissions('testimonials.manage'), (req: Request, res: Response) => {
  const success = store.deleteTestimonial(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  res.json({ success: true, message: 'Testimonial deleted' });
});

// Certificates Admin Routes
router.post('/certificates', requirePermissions('settings.manage'), (req: Request, res: Response) => {
  const created = store.addCertificate(req.body);
  res.status(201).json({ success: true, data: created });
});

router.put('/certificates/:id', requirePermissions('settings.manage'), (req: Request, res: Response) => {
  const updated = store.updateCertificate(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Certificate not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/certificates/:id', requirePermissions('settings.manage'), (req: Request, res: Response) => {
  const success = store.deleteCertificate(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Certificate not found' });
  }
  res.json({ success: true, message: 'Certificate deleted' });
});

// FAQs Admin Routes
router.post('/faqs', requirePermissions('faqs.manage'), (req: Request, res: Response) => {
  const created = store.addFaq(req.body);
  res.status(201).json({ success: true, data: created });
});

router.put('/faqs/:id', requirePermissions('faqs.manage'), (req: Request, res: Response) => {
  const updated = store.updateFaq(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/faqs/:id', requirePermissions('faqs.manage'), (req: Request, res: Response) => {
  const success = store.deleteFaq(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  res.json({ success: true, message: 'FAQ deleted' });
});

// POST /api/v1/admin/services
router.post('/services', requirePermissions('services.manage'), (req: Request, res: Response) => {
  const newService = req.body;
  if (!newService.title || !newService.id) {
    return res.status(400).json({ success: false, message: 'Title and ID are required' });
  }
  const created = store.addService(newService);
  res.status(201).json({ success: true, data: created });
});

// PUT /api/v1/admin/services/:id
router.put('/services/:id', requirePermissions('services.manage'), (req: Request, res: Response) => {
  const updated = store.updateService(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/v1/admin/services/:id
router.delete('/services/:id', requirePermissions('services.manage'), (req: Request, res: Response) => {
  const success = store.deleteService(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, message: 'Service deleted successfully' });
});

// POST /api/v1/admin/projects
router.post('/projects', requirePermissions('projects.manage'), (req: Request, res: Response) => {
  const newProject = req.body;
  if (!newProject.title || !newProject.id) {
    return res.status(400).json({ success: false, message: 'Title and ID are required' });
  }
  const created = store.addProject(newProject);
  res.status(201).json({ success: true, data: created });
});

// PUT /api/v1/admin/projects/:id
router.put('/projects/:id', requirePermissions('projects.manage'), (req: Request, res: Response) => {
  const updated = store.updateProject(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/v1/admin/projects/:id
router.delete('/projects/:id', requirePermissions('projects.manage'), (req: Request, res: Response) => {
  const success = store.deleteProject(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, message: 'Project deleted successfully' });
});

// --- ADMIN USERS & RBAC ---
// GET /api/v1/admin/users
router.get('/users', requirePermissions('roles.manage'), (req: Request, res: Response) => {
  res.json({ success: true, data: store.getAdminUsers() });
});

// POST /api/v1/admin/users
router.post('/users', requirePermissions('roles.manage'), (req: Request, res: Response) => {
  const { username, fullName, email, role, phone, permissions, avatar, isActive } = req.body || {};
  if (!username || !fullName || !email) {
    return res.status(400).json({ success: false, message: 'نام کاربری، نام کامل و ایمیل الزامی هستند.' });
  }
  const created = store.createAdminUser({
    username,
    fullName,
    email,
    role: role || 'support',
    phone: phone || '',
    permissions: permissions || [],
    avatar: avatar || '',
    isActive: isActive !== undefined ? isActive : true
  });
  res.status(201).json({ success: true, data: created });
});

// PUT /api/v1/admin/users/:id
router.put('/users/:id', requirePermissions('roles.manage'), (req: Request, res: Response) => {
  const { username, fullName, email, role, phone, permissions, avatar, isActive } = req.body || {};
  const fields = { username, fullName, email, role, phone, permissions, avatar, isActive };
  const updated = store.updateAdminUser(req.params.id, Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  ));
  if (!updated) {
    return res.status(404).json({ success: false, message: 'کاربر مورد نظر یافت نشد.' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/v1/admin/users/:id
router.delete('/users/:id', requirePermissions('roles.manage'), (req: Request, res: Response) => {
  const success = store.deleteAdminUser(req.params.id);
  if (!success) {
    return res.status(400).json({ success: false, message: 'امکان حذف کاربر اصلی وجود ندارد.' });
  }
  res.json({ success: true, message: 'کاربر با موفقیت حذف شد.' });
});

// --- BLOG MANAGEMENT ---
// GET /api/v1/admin/blog
router.get('/blog', requirePermissions('blog.manage'), (req: Request, res: Response) => {
  res.json({ success: true, data: store.getBlogPosts() });
});

// POST /api/v1/admin/blog
router.post('/blog', requirePermissions('blog.manage'), (req: Request, res: Response) => {
  const { title, slug, excerpt, content, category, featuredImage, tags, author, readingTime, status, metaTitle, metaDescription, metaKeywords, focusKeyword } = req.body || {};
  if (!title) {
    return res.status(400).json({ success: false, message: 'عنوان مقاله الزامی است.' });
  }
  const created = store.createBlogPost({
    title,
    slug: slug || `article-${Date.now()}`,
    excerpt: excerpt || '',
    content: content || '',
    category: category || 'سئو و بهینه‌سازی',
    featuredImage: featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    tags: Array.isArray(tags) ? tags : [],
    author: author || 'استودیو سیگنالوکس',
    readingTime: readingTime || '۵ دقیقه',
    status: status || 'published',
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || excerpt || '',
    metaKeywords: metaKeywords || '',
    focusKeyword: focusKeyword || ''
  });
  res.status(201).json({ success: true, data: created });
});

// PUT /api/v1/admin/blog/:id
router.put('/blog/:id', requirePermissions('blog.manage'), (req: Request, res: Response) => {
  const updated = store.updateBlogPost(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد.' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/v1/admin/blog/:id
router.delete('/blog/:id', requirePermissions('blog.manage'), (req: Request, res: Response) => {
  const success = store.deleteBlogPost(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'مقاله یافت نشد.' });
  }
  res.json({ success: true, message: 'مقاله با موفقیت حذف شد.' });
});

// --- SEO SUITE MANAGEMENT ---
// GET /api/v1/admin/seo
router.get('/seo', requirePermissions('seo.manage'), (req: Request, res: Response) => {
  res.json({ success: true, data: store.getSeoSettings() });
});

// PUT /api/v1/admin/seo
router.put('/seo', requirePermissions('seo.manage'), (req: Request, res: Response) => {
  const updated = store.updateSeoSettings(req.body);
  res.json({ success: true, data: updated });
});

// --- BLOG COMMENTS MANAGEMENT ---
// GET /api/v1/admin/comments
router.get('/comments', requirePermissions('comments.manage'), (req: Request, res: Response) => {
  const { status, postId } = req.query;
  const comments = store.getComments(
    typeof postId === 'string' ? postId : undefined,
    typeof status === 'string' ? status : undefined
  );
  res.json({ success: true, data: comments });
});

// PATCH /api/v1/admin/comments/:id/status
router.patch('/comments/:id/status', requirePermissions('comments.manage'), (req: Request, res: Response) => {
  const { status } = req.body || {};
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'وضعیت نامعتبر است.' });
  }
  const updated = store.updateCommentStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'دیدگاه یافت نشد.' });
  }
  res.json({ success: true, data: updated, message: 'وضعیت نظر با موفقیت تغییر کرد.' });
});

// POST /api/v1/admin/comments/:id/reply
router.post('/comments/:id/reply', requirePermissions('comments.manage'), (req: Request, res: Response) => {
  const { author, content } = req.body || {};
  if (!content) {
    return res.status(400).json({ success: false, message: 'متن پاسخ الزامی است.' });
  }
  const updated = store.replyComment(req.params.id, { author, content });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'دیدگاه یافت نشد.' });
  }
  res.json({ success: true, data: updated, message: 'پاسخ به نظر ثبت شد.' });
});

// DELETE /api/v1/admin/comments/:id
router.delete('/comments/:id', requirePermissions('comments.manage'), (req: Request, res: Response) => {
  const success = store.deleteComment(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'دیدگاه یافت نشد.' });
  }
  res.json({ success: true, message: 'دیدگاه با موفقیت حذف شد.' });
});

export default router;
