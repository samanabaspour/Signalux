import React, { useState, useEffect } from 'react';
import { adminFetch, signInAdmin, signOutAdmin } from '../services/session';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Award,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Lock,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Search,
  Sparkles,
  ChevronRight,
  Globe,
  MapPin,
  Instagram,
  Linkedin,
  Send,
  Github,
  CheckCircle,
  Clock,
  XCircle,
  Headphones,
  Smartphone,
  Shield,
  Key,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Copy,
  ChevronLeft,
  ChevronDown,
  Type,
  Sliders,
  Eye,
  Palette,
  FileText,
  BookOpen,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  FolderTree,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  ServiceItem,
  PortfolioProject,
  CertificateItem,
  Testimonial,
  TicketItem,
  TicketDepartment,
  TicketPriority,
  TicketStatus,
  SmsLogItem,
  AvailableFontFamily,
  TagTypographySettings,
  TagTypographyItem,
  PageCustomSettings
} from '../types';
import {
  FAQItem,
  SiteSettings,
  fetchAdminTickets,
  adminReplyTicket,
  updateAdminTicketStatus,
  deleteAdminTicket,
  testMelipayamakSms,
  fetchSmsLogs,
  PERSIAN_FONT_PRESETS,
  FONT_SIZE_PRESETS,
  HEADING_SCALE_PRESETS,
  FONT_WEIGHT_PRESETS,
  DEFAULT_TAG_TYPOGRAPHY,
  applyTypographyToDocument,
  updateSiteSettings,
  DEFAULT_PAGES_CONFIG
} from '../services/apiClient';
import { AdminTeamManager } from './admin/AdminTeamManager';
import { BlogManager } from './admin/BlogManager';
import { CommentsManager } from './admin/CommentsManager';
import { SeoSuiteManager } from './admin/SeoSuiteManager';
import { PagesManager } from './admin/PagesManager';
import { SecurityManager } from './admin/SecurityManager';
import { SpeedOptimizerManager } from './admin/SpeedOptimizerManager';
import { MediaTestimonialsManager } from './admin/MediaTestimonialsManager';

interface Lead {
  id: string;
  type: 'consultation' | 'contact';
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

interface Stats {
  servicesCount: number;
  projectsCount: number;
  leadsCount: number;
  newLeadsCount: number;
  ticketsCount?: number;
  openTicketsCount?: number;
}

interface AdminDashboardProps {
  onBackToHome: () => void;
}

const DEPARTMENTS: { key: TicketDepartment; label: string }[] = [
  { key: 'technical', label: 'پشتیبانی فنی' },
  { key: 'seo_design', label: 'طراحی وب و سئو' },
  { key: 'sales', label: 'مشاوره و فروش' },
  { key: 'finance', label: 'امور مالی و فاکتور' },
  { key: 'general', label: 'پشتیبانی عمومی' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'pages'
    | 'blog'
    | 'comments'
    | 'seo-suite'
    | 'speed-optimizer'
    | 'security'
    | 'team-rbac'
    | 'tickets'
    | 'sms-gateway'
    | 'google-integrations'
    | 'typography'
    | 'leads'
    | 'services'
    | 'projects'
    | 'testimonials'
    | 'media-testimonials'
    | 'certificates'
    | 'faqs'
    | 'settings'
  >('overview');

  // Collapsible Sidebar & Submenu State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('signalux_admin_sidebar_collapsed') === 'true';
    }
    return false;
  });
  const [isPagesMenuExpanded, setIsPagesMenuExpanded] = useState<boolean>(true);

  // Selected tag for Granular Typography Editor
  const [selectedTypographyTag, setSelectedTypographyTag] = useState<
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'button' | 'small' | 'navbar'
  >('h1');

  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [smsLogs, setSmsLogs] = useState<SmsLogItem[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Ticket Management Modal / Drawer State
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>('');
  const [replyLoading, setReplyLoading] = useState<boolean>(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [ticketDeptFilter, setTicketDeptFilter] = useState<string>('all');

  // SMS Test State
  const [testSmsPhone, setTestSmsPhone] = useState<string>('09120000000');
  const [testSmsCode, setTestSmsCode] = useState<string>('58291');
  const [testSmsLoading, setTestSmsLoading] = useState<boolean>(false);
  const [testSmsResult, setTestSmsResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  // Service Edit/Add Modal State
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Project Edit/Add Modal State
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Testimonial Edit/Add Modal State
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // Certificate Edit/Add Modal State
  const [editingCertificate, setEditingCertificate] = useState<Partial<CertificateItem> | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // FAQ Edit/Add Modal State
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Settings Save Status
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem('signalux_admin_token');
    const expire = () => setIsAuthenticated(false);
    window.addEventListener('signalux-admin-session-ended', expire);
    return () => { window.removeEventListener('signalux-admin-session-ended', expire); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginPending(true);
    setLoginError('');
    try {
      await signInAdmin(adminEmail.trim(), password);
      setIsAuthenticated(true);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "خطا در ورود به پنل.");
    } finally {
      setPassword('');
      setLoginPending(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    void signOutAdmin().catch(() => {});
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        leadsRes,
        ticketsData,
        servicesRes,
        projectsRes,
        testimonialsRes,
        certificatesRes,
        faqsRes,
        settingsRes,
        smsLogsData
      ] = await Promise.all([
        adminFetch('/api/v1/admin/stats').then(r => r.json()),
        adminFetch('/api/v1/admin/leads').then(r => r.json()),
        fetchAdminTickets(),
        fetch('/api/v1/public/services').then(r => r.json()),
        fetch('/api/v1/public/projects').then(r => r.json()),
        fetch('/api/v1/public/testimonials').then(r => r.json()),
        fetch('/api/v1/public/certificates').then(r => r.json()),
        fetch('/api/v1/public/faqs').then(r => r.json()),
        adminFetch('/api/v1/admin/settings').then(r => r.json()),
        fetchSmsLogs()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (leadsRes.success) setLeads(leadsRes.data);
      setTickets(ticketsData);
      if (servicesRes.success) setServices(servicesRes.data);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (testimonialsRes.success) setTestimonials(testimonialsRes.data);
      if (certificatesRes.success) setCertificates(certificatesRes.data);
      if (faqsRes.success) setFaqs(faqsRes.data);
      if (settingsRes.success) setSiteSettings(settingsRes.data);
      setSmsLogs(smsLogsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Lead handlers
  const handleUpdateLeadStatus = async (id: string, status: Lead['status']) => {
    try {
      const res = await adminFetch(`/api/v1/admin/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
      }
    } catch (err) {
      console.error('Failed to update lead status', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('آیا از حذف این لید اطمینان دارید؟')) return;
    try {
      const res = await adminFetch(`/api/v1/admin/leads/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete lead', err);
    }
  };

  // Ticket handlers
  const handleAdminReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !adminReplyText.trim()) return;

    setReplyLoading(true);
    const success = await adminReplyTicket(selectedTicket.id, {
      message: adminReplyText.trim(),
      newStatus: 'answered',
      senderName: 'تیم پشتیبانی سیگنالوکس'
    });
    setReplyLoading(false);

    if (success) {
      setAdminReplyText('');
      loadData();
      const updatedTickets = await fetchAdminTickets();
      const updated = updatedTickets.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: TicketStatus) => {
    const success = await updateAdminTicketStatus(ticketId, status);
    if (success) {
      setTickets(prev => prev.map(t => (t.id === ticketId ? { ...t, status } : t)));
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status } : null);
      }
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm('آیا از حذف این تیکت اطمینان دارید؟')) return;
    const success = await deleteAdminTicket(ticketId);
    if (success) {
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      if (selectedTicket?.id === ticketId) setSelectedTicket(null);
    }
  };

  // SMS Test
  const handleTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestSmsLoading(true);
    setTestSmsResult(null);

    const res = await testMelipayamakSms(testSmsPhone, testSmsCode);
    setTestSmsLoading(false);
    setTestSmsResult(res);

    // Refresh logs
    const logs = await fetchSmsLogs();
    setSmsLogs(logs);
  };

  // Settings Save
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!siteSettings) return;
    setSettingsError('');
    setSettingsSuccess(false);

    try {
      const res = await adminFetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSiteSettings(json.data);
        applyTypographyToDocument(json.data);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        setSettingsError(json.error?.message || 'تنظیمات ذخیره نشد.');
      }
    } catch (err) {
      setSettingsError('تنظیمات ذخیره نشد. دوباره تلاش کنید.');
    }
  };

  // Typography Live Modifiers (Shabnam & Granular Tag Settings)
  const handleFontFamilyChange = (fontId: AvailableFontFamily) => {
    if (!siteSettings) return;
    const updated = { ...siteSettings, fontFamily: fontId };
    setSiteSettings(updated);
    applyTypographyToDocument(updated);
  };

  const handleFontSizeChange = (size: string) => {
    if (!siteSettings) return;
    const updated = { ...siteSettings, fontSizeBase: size };
    setSiteSettings(updated);
    applyTypographyToDocument(updated);
  };

  const handleHeadingScaleChange = (scale: string) => {
    if (!siteSettings) return;
    const updated = { ...siteSettings, fontHeadingScale: scale };
    setSiteSettings(updated);
    applyTypographyToDocument(updated);
  };

  const handleFontWeightChange = (weight: string) => {
    if (!siteSettings) return;
    const updated = { ...siteSettings, fontWeightBase: weight };
    setSiteSettings(updated);
    applyTypographyToDocument(updated);
  };

  const handleLineHeightChange = (lineHeight: string) => {
    if (!siteSettings) return;
    const updated = { ...siteSettings, lineHeightScale: lineHeight };
    setSiteSettings(updated);
    applyTypographyToDocument(updated);
  };

  const handleTagTypographyChange = (
    tag: keyof TagTypographySettings,
    field: keyof TagTypographyItem,
    value: string
  ) => {
    if (!siteSettings) return;
    const currentTags: TagTypographySettings =
      siteSettings.tagsTypography || DEFAULT_TAG_TYPOGRAPHY;
    const currentTagItem: TagTypographyItem = currentTags[tag] || DEFAULT_TAG_TYPOGRAPHY[tag];

    const updatedTags: TagTypographySettings = {
      ...currentTags,
      [tag]: {
        ...currentTagItem,
        [field]: value
      }
    };

    const updated: SiteSettings = {
      ...siteSettings,
      tagsTypography: updatedTags
    };
    setSiteSettings(updated);
    applyTypographyToDocument(updated);
  };

  const handleResetTypographyDefaults = () => {
    if (!siteSettings) return;
    const updated: SiteSettings = {
      ...siteSettings,
      fontFamily: 'Shabnam',
      fontSizeBase: '16px',
      fontHeadingScale: '1.25',
      fontWeightBase: '400',
      lineHeightScale: '1.65',
      tagsTypography: { ...DEFAULT_TAG_TYPOGRAPHY }
    };
    setSiteSettings(updated);
    applyTypographyToDocument(updated);
  };

  // Service CRUD
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    const isNew = !services.some(s => s.id === editingService.id);
    const url = isNew ? '/api/v1/admin/services' : `/api/v1/admin/services/${editingService.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const serviceData = {
      id: editingService.id || `srv-${Date.now()}`,
      title: editingService.title,
      subtitle: editingService.subtitle || '',
      category: editingService.category || 'web',
      iconName: editingService.iconName || 'Code',
      description: editingService.description || '',
      features: editingService.features || ['طراحی اختصاصی'],
      metrics: editingService.metrics || 'ارتقای نرخ تبدیل',
      deliverables: editingService.deliverables || ['پروژه کامل'],
      gradient: editingService.gradient || 'from-amber-500/20 via-orange-500/10 to-transparent'
    };

    try {
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
      const json = await res.json();
      if (json.success) {
        loadData();
        setIsServiceModalOpen(false);
        setEditingService(null);
      }
    } catch (err) {
      console.error('Error saving service', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('آیا از حذف این خدمت اطمینان دارید؟')) return;
    try {
      const res = await adminFetch(`/api/v1/admin/services/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setServices(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete service', err);
    }
  };

  // Project CRUD
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    const isNew = !projects.some(p => p.id === editingProject.id);
    const url = isNew ? '/api/v1/admin/projects' : `/api/v1/admin/projects/${editingProject.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const projectData = {
      id: editingProject.id || `proj-${Date.now()}`,
      title: editingProject.title,
      client: editingProject.client || '',
      category: editingProject.category || 'web',
      categoryLabel: editingProject.categoryLabel || 'طراحی و توسعه وب',
      thumbnail: editingProject.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      year: editingProject.year || '۱۴۰۳',
      summary: editingProject.summary || '',
      fullDescription: editingProject.fullDescription || '',
      tags: editingProject.tags || ['Next.js', 'React'],
      impactMetrics: editingProject.impactMetrics || [{ label: 'رشد ترافیک', value: '+۱۸۰%' }]
    };

    try {
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const json = await res.json();
      if (json.success) {
        loadData();
        setIsProjectModalOpen(false);
        setEditingProject(null);
      }
    } catch (err) {
      console.error('Error saving project', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('آیا از حذف این پروژه اطمینان دارید؟')) return;
    try {
      const res = await adminFetch(`/api/v1/admin/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  // Testimonial CRUD
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name) return;

    const isNew = !testimonials.some(t => t.id === editingTestimonial.id);
    const url = isNew ? '/api/v1/admin/testimonials' : `/api/v1/admin/testimonials/${editingTestimonial.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial)
      });
      const json = await res.json();
      if (json.success) {
        loadData();
        setIsTestimonialModalOpen(false);
        setEditingTestimonial(null);
      }
    } catch (err) {
      console.error('Error saving testimonial', err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
    try {
      const res = await adminFetch(`/api/v1/admin/testimonials/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete testimonial', err);
    }
  };

  // Certificate CRUD
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertificate || !editingCertificate.title) return;

    const isNew = !certificates.some(c => c.id === editingCertificate.id);
    const url = isNew ? '/api/v1/admin/certificates' : `/api/v1/admin/certificates/${editingCertificate.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCertificate)
      });
      const json = await res.json();
      if (json.success) {
        loadData();
        setIsCertificateModalOpen(false);
        setEditingCertificate(null);
      }
    } catch (err) {
      console.error('Error saving certificate', err);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm('آیا از حذف این گواهینامه اطمینان دارید؟')) return;
    try {
      const res = await adminFetch(`/api/v1/admin/certificates/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setCertificates(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete certificate', err);
    }
  };

  // FAQ CRUD
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question) return;

    const isNew = !faqs.some(f => f.id === editingFaq.id);
    const url = isNew ? '/api/v1/admin/faqs' : `/api/v1/admin/faqs/${editingFaq.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq)
      });
      const json = await res.json();
      if (json.success) {
        loadData();
        setIsFaqModalOpen(false);
        setEditingFaq(null);
      }
    } catch (err) {
      console.error('Error saving FAQ', err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('آیا از حذف این سوال متداول اطمینان دارید؟')) return;
    try {
      const res = await adminFetch(`/api/v1/admin/faqs/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete FAQ', err);
    }
  };

  // Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1528] flex items-center justify-center p-4 font-sans admin-light-mode" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl mx-auto flex items-center justify-center shadow-xs">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-xl font-black text-[#0F172A] font-mono tracking-wider">
              ورود به پنل مدیریت سیگنالوکس
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Signalux Studio Master Control Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-xs text-slate-700">
              ایمیل حساب مدیریت
              <input type="email" required autoComplete="username" dir="ltr" value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl bg-white" />
            </label>
            <div>
              <label className="block text-xs font-mono text-slate-700 mb-2">
                کلمه عبور مدیر ارشد
              </label>
              <input
                type="password"
                value={password}
                required autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-mono bg-red-50 p-2.5 rounded-lg border border-red-200">
                {loginError}
              </p>
            )}

            <button
              type="submit" disabled={loginPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono py-3 rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              ورود به سامانه
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-500 hover:text-blue-600 font-mono transition-colors cursor-pointer"
            >
              ← بازگشت به وب‌سایت اصلی
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filtered Tickets
  const filteredTickets = tickets.filter(t => {
    const matchesQuery =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userPhone.includes(searchQuery) ||
      t.id.includes(searchQuery);

    const matchesStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
    const matchesDept = ticketDeptFilter === 'all' || t.department === ticketDeptFilter;

    return matchesQuery && matchesStatus && matchesDept;
  });

  const getSidebarItemClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `w-full flex items-center ${
      isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
    } py-2.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
      isActive
        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 border border-blue-500'
        : 'text-slate-300 hover:bg-[#152544] hover:text-white'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans admin-light-mode" dir="rtl">
      {/* Top Admin Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-xs">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
            <span className="text-base font-black tracking-widest text-[#0F172A] font-mono">
              SIGNAL<span className="text-blue-600">UX</span> CONTROL
            </span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            پنل مدیریت اختصاصی • سفید / سورمه‌ای / آبی کاربنی
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="بروزرسانی اطلاعات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            مشاهده سایت
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-mono transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar (Collapsible & Expandable) */}
        <aside
          className={`bg-[#0B1528] border-l border-[#1E293B] p-3 space-y-1.5 shrink-0 shadow-lg text-slate-200 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-64'
          }`}
        >
          {/* Sidebar Header & Toggle */}
          <div className="flex items-center justify-between px-2 py-1.5 mb-1">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                منوی راهبری مدیریت
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                const next = !isSidebarCollapsed;
                setIsSidebarCollapsed(next);
                try {
                  localStorage.setItem('signalux_admin_sidebar_collapsed', String(next));
                } catch {}
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors mx-auto cursor-pointer"
              title={isSidebarCollapsed ? 'باز کردن سایدبار' : 'جمع کردن سایدبار'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* MAIN TABS */}
          <button
            onClick={() => setActiveTab('overview')}
            title="داشبورد و آمار"
            className={getSidebarItemClass('overview')}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>داشبورد و آمار</span>}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>

          {/* ========================================================= */}
          {/* PAGES & SUB-PAGES MENU (REQUESTED BY USER) */}
          {/* ========================================================= */}
          <div className="space-y-1">
            <div
              className={getSidebarItemClass('pages')}
              onClick={() => setActiveTab('pages')}
              title="مدیریت برگه‌ها و صفحات سایت"
            >
              <div className="flex items-center gap-2.5">
                <FolderTree className={`w-4 h-4 ${activeTab === 'pages' ? 'text-white' : 'text-blue-400'}`} />
                {!isSidebarCollapsed && (
                  <span className="font-bold">برگه‌ها و صفحات سایت</span>
                )}
              </div>

              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono">
                    ۹ برگه
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPagesMenuExpanded(!isPagesMenuExpanded);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/50 transition-transform ${
                        isPagesMenuExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Sub-pages Tree when expanded */}
            {!isSidebarCollapsed && isPagesMenuExpanded && (
              <div className="mr-4 pr-3 border-r border-blue-500/30 space-y-1 my-1">
                {[
                  { id: 'page_home', slug: 'home', label: 'صفحه اصلی (خانه)' },
                  { id: 'page_about', slug: 'about', label: 'درباره ما' },
                  { id: 'page_services', slug: 'services', label: 'خدمات اصلی' },
                  { id: 'page_web_design', slug: 'web-design', label: 'طراحی سایت' },
                  { id: 'page_seo', slug: 'seo', label: 'سئو و بهینه‌سازی' },
                  { id: 'page_projects', slug: 'projects-list', label: 'نمونه‌کارها' },
                  { id: 'page_testimonials_media', slug: 'testimonials-media', label: 'نظرات و پادکست‌ها' },
                  { id: 'page_blog', slug: 'blog', label: 'وبلاگ' },
                  { id: 'page_contact', slug: 'contact', label: 'تماس با ما' }
                ].map(subPage => (
                  <button
                    key={subPage.id}
                    onClick={() => {
                      setActiveTab('pages');
                    }}
                    className="w-full text-right px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 hover:text-white hover:bg-[#152544] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>• {subPage.label}</span>
                    <span className="text-[9px] text-slate-400">/{subPage.slug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('tickets')}
            title="تیکت‌ها و پشتیبانی"
            className={getSidebarItemClass('tickets')}
          >
            <div className="flex items-center gap-2.5">
              <Headphones className={`w-4 h-4 ${activeTab === 'tickets' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">تیکت‌ها و پشتیبانی</span>}
            </div>
            {!isSidebarCollapsed && tickets.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/30 text-blue-200 font-mono font-bold">
                {tickets.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            title="لیدها و مشاوره‌ها"
            className={getSidebarItemClass('leads')}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${activeTab === 'leads' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>لیدها و مشاوره‌ها</span>}
            </div>
            {!isSidebarCollapsed && leads.filter(l => l.status === 'new').length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500 text-white font-bold font-mono">
                {leads.filter(l => l.status === 'new').length}
              </span>
            )}
          </button>

          {!isSidebarCollapsed && (
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              سرویس‌های خارجی و اتصال‌ها
            </div>
          )}

          <button
            onClick={() => setActiveTab('sms-gateway')}
            title="سامانه پیامک (ملی‌پیامک)"
            className={getSidebarItemClass('sms-gateway')}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className={`w-4 h-4 ${activeTab === 'sms-gateway' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>سامانه پیامک (ملی‌پیامک)</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono">پترن</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('google-integrations')}
            title="گوگل، GTM و سرچ کنسول"
            className={getSidebarItemClass('google-integrations')}
          >
            <div className="flex items-center gap-2.5">
              <Globe className={`w-4 h-4 ${activeTab === 'google-integrations' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>گوگل، GTM و سرچ کنسول</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono">GTM+GSC</span>
            )}
          </button>

          {!isSidebarCollapsed && (
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              وبلاگ، سئو و تیم ادمین
            </div>
          )}

          <button
            onClick={() => setActiveTab('blog')}
            title="وبلاگ و مقالات"
            className={getSidebarItemClass('blog')}
          >
            <div className="flex items-center gap-2.5">
              <FileText className={`w-4 h-4 ${activeTab === 'blog' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">وبلاگ و مقالات</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono font-bold">بلاگ</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            title="مدیریت دیدگاه‌ها و نظرات مقالات"
            className={getSidebarItemClass('comments')}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className={`w-4 h-4 ${activeTab === 'comments' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">دیدگاه‌ها و نظرات</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono font-bold">نظرات</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('seo-suite')}
            title="سئو و سایت مپ (SEO)"
            className={getSidebarItemClass('seo-suite')}
          >
            <div className="flex items-center gap-2.5">
              <Globe className={`w-4 h-4 ${activeTab === 'seo-suite' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">سئو و سایت مپ (SEO)</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono">Sitemap</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('speed-optimizer')}
            title="تست سرعت، کش و بهینه‌سازی (Speed & CWV)"
            className={getSidebarItemClass('speed-optimizer')}
          >
            <div className="flex items-center gap-2.5">
              <Zap className={`w-4 h-4 ${activeTab === 'speed-optimizer' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">تست سرعت و بهینه‌سازی کش</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono font-bold">
                99/100
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            title="مرکز امنیت و فایروال (AIOS)"
            className={getSidebarItemClass('security')}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">مرکز امنیت و فایروال</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono font-bold">
                AIOS WAF
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('team-rbac')}
            title="تیم و دسترسی‌ها (RBAC)"
            className={getSidebarItemClass('team-rbac')}
          >
            <div className="flex items-center gap-2.5">
              <Shield className={`w-4 h-4 ${activeTab === 'team-rbac' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">تیم و دسترسی‌ها (RBAC)</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono">کاربران</span>
            )}
          </button>

          {!isSidebarCollapsed && (
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              طراحی و تایپوگرافی شبنم
            </div>
          )}

          <button
            onClick={() => setActiveTab('typography')}
            title="تنظیمات فونت شبنم و تگ‌ها"
            className={getSidebarItemClass('typography')}
          >
            <div className="flex items-center gap-2.5">
              <Type className={`w-4 h-4 ${activeTab === 'typography' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>فونت شبنم و تگ‌های H1-H6</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono">
                شبنم
              </span>
            )}
          </button>

          {!isSidebarCollapsed && (
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              مدیریت محتوا
            </div>
          )}

          <button
            onClick={() => setActiveTab('services')}
            title="خدمات"
            className={getSidebarItemClass('services')}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className={`w-4 h-4 ${activeTab === 'services' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>خدمات ({services.length})</span>}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            title="پروژه‌ها"
            className={getSidebarItemClass('projects')}
          >
            <div className="flex items-center gap-2.5">
              <Layers className={`w-4 h-4 ${activeTab === 'projects' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>پروژه‌ها ({projects.length})</span>}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            title="نظرات متنی مشتریان"
            className={getSidebarItemClass('testimonials')}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquareQuote className={`w-4 h-4 ${activeTab === 'testimonials' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>نظرات متنی ({testimonials.length})</span>}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>

          <button
            onClick={() => setActiveTab('media-testimonials')}
            title="پادکست‌ها و ویدئوهای رضایت"
            className={getSidebarItemClass('media-testimonials')}
          >
            <div className="flex items-center gap-2.5">
              <Headphones className={`w-4 h-4 ${activeTab === 'media-testimonials' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span className="font-bold">پادکست و ویدئوی رضایت</span>}
            </div>
            {!isSidebarCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-slate-200 font-mono">
                صوت+فیلم
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            title="گواهینامه‌ها"
            className={getSidebarItemClass('certificates')}
          >
            <div className="flex items-center gap-2.5">
              <Award className={`w-4 h-4 ${activeTab === 'certificates' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>گواهینامه‌ها ({certificates.length})</span>}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            title="سوالات متداول"
            className={getSidebarItemClass('faqs')}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className={`w-4 h-4 ${activeTab === 'faqs' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>سوالات متداول ({faqs.length})</span>}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            title="تنظیمات عمومی سایت"
            className={getSidebarItemClass('settings')}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-blue-400'}`} />
              {!isSidebarCollapsed && <span>تنظیمات عمومی سایت</span>}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>
        </aside>

        {/* Workspace Canvas */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {/* ========================================================================= */}
          {/* 0. PAGES & SUBPAGES MANAGEMENT TAB */}
          {/* ========================================================================= */}
          {activeTab === 'pages' && (
            <PagesManager />
          )}

          {/* ========================================================================= */}
          {/* 1. OVERVIEW TAB */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] font-mono">داشبورد و آمار کلی</h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  وضعیت سرویس‌ها، تیکت‌ها، پروژه‌ها و لیدهای ورودی
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-blue-600">
                    <span className="text-xs font-mono text-slate-600">تیکت‌های مشتریان</span>
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-[#0F172A] font-mono">{tickets.length}</div>
                  <div className="text-[11px] text-blue-700 font-mono font-medium">
                    {tickets.filter(t => t.status === 'new' || t.status === 'open').length} تیکت باز در انتظار پاسخ
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-blue-600">
                    <span className="text-xs font-mono text-slate-600">کل لیدهای ورودی</span>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-[#0F172A] font-mono">{leads.length}</div>
                  <div className="text-[11px] text-blue-700 font-mono font-medium">
                    {leads.filter(l => l.status === 'new').length} لید جدید نیازمند تماس
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-blue-600">
                    <span className="text-xs font-mono text-slate-600">پیامک‌های ارسالی</span>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-[#0F172A] font-mono">{smsLogs.length}</div>
                  <div className="text-[11px] text-blue-700 font-mono font-medium">
                    پترن فعال ملی‌پیامک
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-blue-600">
                    <span className="text-xs font-mono text-slate-600">نمونه‌کارها و خدمات</span>
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-[#0F172A] font-mono">
                    {projects.length + services.length}
                  </div>
                  <div className="text-[11px] text-blue-700 font-mono font-medium">
                    {projects.length} پروژه و {services.length} خدمت فعال
                  </div>
                </div>
              </div>

              {/* DirectAdmin Quick Info Box */}
              <div className="p-6 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-sm font-bold font-mono">سیستم یکپارچه بک‌اند PHP دایرکت‌ادمین</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تمام اطلاعات جدول‌های MySQL شامل لیدها، تیکت‌های پشتیبانی، گواهی‌ها، خدمات و لاگ‌های پیامکی به صورت زنده در دیتابیس <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-mono">soheils4_signalux</code> مدیریت می‌شوند.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TICKETS & SUPPORT TAB */}
          {/* ========================================================================= */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">مدیریت تیکت‌ها و پشتیبانی ۲۴/۷</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    پاسخگویی به درخواست‌های فنی، سئو، فروش و قراردادهای مشتریان
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={ticketStatusFilter}
                    onChange={e => setTicketStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="new">جدید</option>
                    <option value="in_progress">در حال بررسی</option>
                    <option value="answered">پاسخ داده شده</option>
                    <option value="closed">بسته شده</option>
                  </select>

                  <select
                    value={ticketDeptFilter}
                    onChange={e => setTicketDeptFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="all">همه دپارتمان‌ها</option>
                    <option value="technical">پشتیبانی فنی</option>
                    <option value="seo_design">طراحی وب و سئو</option>
                    <option value="sales">مشاوره و فروش</option>
                    <option value="finance">امور مالی</option>
                  </select>
                </div>
              </div>

              {/* Tickets Table / List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {filteredTickets.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-mono">
                    تیکتی مطابق فیلترهای انتخابی یافت نشد.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredTickets.map(ticket => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#0F172A]">{ticket.subject}</span>
                            <span className="text-[10px] font-mono text-slate-400">#{ticket.id}</span>
                            {ticket.status === 'new' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono">جدید</span>
                            )}
                            {ticket.status === 'in_progress' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-mono">در حال بررسی</span>
                            )}
                            {ticket.status === 'answered' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">پاسخ داده شده</span>
                            )}
                            {ticket.status === 'closed' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-mono">بسته شده</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                            <span>مشتری: <strong className="text-slate-800">{ticket.userName}</strong> ({ticket.userPhone})</span>
                            <span>•</span>
                            <span>بخش: {DEPARTMENTS.find(d => d.key === ticket.department)?.label || ticket.department}</span>
                            <span>•</span>
                            <span>اولویت: {ticket.priority}</span>
                            <span>•</span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-mono font-medium transition-colors border border-blue-200"
                          >
                            مشاهده و پاسخ ({ticket.messages?.length || 1})
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="حذف تیکت"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ticket Conversation Drawer / Modal */}
              {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                  <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#0F172A] text-base font-mono">{selectedTicket.subject}</h3>
                          <span className="text-xs font-mono text-slate-400">#{selectedTicket.id}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          ارسال‌کننده: {selectedTicket.userName} - {selectedTicket.userPhone}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedTicket(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Status switcher bar */}
                    <div className="p-2.5 px-4 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">تغییر وضعیت:</span>
                        <button
                          onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'in_progress')}
                          className={`px-2 py-1 rounded text-xs transition-colors ${selectedTicket.status === 'in_progress' ? 'bg-amber-500 text-white font-bold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          در حال بررسی
                        </button>
                        <button
                          onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'answered')}
                          className={`px-2 py-1 rounded text-xs transition-colors ${selectedTicket.status === 'answered' ? 'bg-emerald-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          پاسخ داده شده
                        </button>
                        <button
                          onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'closed')}
                          className={`px-2 py-1 rounded text-xs transition-colors ${selectedTicket.status === 'closed' ? 'bg-slate-700 text-white font-bold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          بستن تیکت
                        </button>
                      </div>
                    </div>

                    {/* Messages Thread */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                      {selectedTicket.messages?.map((msg, idx) => (
                        <div
                          key={msg.id || idx}
                          className={`flex flex-col ${msg.senderType === 'admin' ? 'items-start' : 'items-end'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 text-xs leading-relaxed shadow-xs ${
                              msg.senderType === 'admin'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                              <span>{msg.senderName}</span>
                              <span>{new Date(msg.createdAt).toLocaleTimeString('fa-IR')}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Form */}
                    <form onSubmit={handleAdminReplyTicket} className="p-4 border-t border-slate-200 bg-white space-y-2">
                      <textarea
                        rows={3}
                        placeholder="پاسخ رسمی پشتیبانی سیگنالوکس را بنویسید..."
                        value={adminReplyText}
                        onChange={e => setAdminReplyText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs text-slate-800 focus:outline-none resize-none shadow-inner"
                      />
                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={replyLoading || !adminReplyText.trim()}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs rounded-xl shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          {replyLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 rotate-180" />}
                          <span>ارسال پاسخ به کاربر</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. SMS GATEWAY (MELIPAYAMAK) TAB */}
          {/* ========================================================================= */}
          {activeTab === 'sms-gateway' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] font-mono">
                  تنظیمات سامانه پیامک ملی‌پیامک (Melipayamak Pattern SMS)
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  پیکربندی ارسال کدهای یکبار مصرف (OTP) بر اساس پترن / الگوی وب‌سرویس خدماتی ملی پیامک
                </p>
              </div>

              {/* Melipayamak Config Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-blue-700 font-mono flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <span>مشخصات وب‌سرویس ملی‌پیامک</span>
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">نام کاربری ملی‌پیامک (Username)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={siteSettings?.melipayamakUsername || ''}
                        onChange={e => setSiteSettings(s => s ? { ...s, melipayamakUsername: e.target.value } : null)}
                        placeholder="مثال: signalux_user"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">کلمه عبور / کلید وب‌سرویس (API Key / Password)</label>
                      <p className="text-xs text-slate-500">رمز سامانه فقط روی سرور تنظیم می‌شود.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">شماره خط ارسال‌کننده (Sender Number)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={siteSettings?.melipayamakSenderNumber || '50004001'}
                        onChange={e => setSiteSettings(s => s ? { ...s, melipayamakSenderNumber: e.target.value } : null)}
                        placeholder="مثال: 50004001 یا خط خدماتی"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">کد متن / الگوی اعتبارسنجی (Pattern Code / BodyId)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={siteSettings?.melipayamakPatternCode || '123456'}
                        onChange={e => setSiteSettings(s => s ? { ...s, melipayamakPatternCode: e.target.value } : null)}
                        placeholder="مثال: 24589"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">نام متغیر در پترن (Variable Name)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={siteSettings?.melipayamakParamName || 'code'}
                        onChange={e => setSiteSettings(s => s ? { ...s, melipayamakParamName: e.target.value } : null)}
                        placeholder="پیش‌فرض: code"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="melipayamakSandbox"
                        checked={siteSettings?.melipayamakSandbox ?? false}
                        onChange={e => setSiteSettings(s => s ? { ...s, melipayamakSandbox: e.target.checked } : null)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="melipayamakSandbox" className="text-xs text-slate-700 cursor-pointer">
                        حالت شبیه‌ساز تست (Sandbox - عدم کسر شارژ در محیط توسعه)
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      ذخیره تنظیمات ملی‌پیامک
                    </button>
                  </div>
                </div>

                {/* SMS Test Console */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-blue-700 font-mono flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>تست ارسال زنده پیامک با پترن</span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    یک شماره موبایل وارد کنید تا وب‌سرویس پترن ملی‌پیامک فراخوانی شده و نتیجه خروجی آن به همراه کد وضعیت نمایش داده شود.
                  </p>

                  <form onSubmit={handleTestSms} className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">شماره موبایل گیرنده تست</label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={testSmsPhone}
                        onChange={e => setTestSmsPhone(e.target.value)}
                        placeholder="09123456789"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">کد تستی ارسالی</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={testSmsCode}
                        onChange={e => setTestSmsCode(e.target.value)}
                        placeholder="58291"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={testSmsLoading}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      {testSmsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
                      <span>ارسال آزمایشی پیامک پترن</span>
                    </button>
                  </form>

                  {testSmsResult && (
                    <div className={`p-4 rounded-xl text-xs space-y-1.5 ${testSmsResult.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                      <div className="font-bold">{testSmsResult.message}</div>
                      {testSmsResult.details && (
                        <pre className="text-[10px] font-mono bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(testSmsResult.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SMS Logs Table */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-[#0F172A] font-mono">گزارش آخرین پیامک‌های ارسالی سیستم</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs font-mono">
                    <thead className="border-b border-slate-100 text-slate-500">
                      <tr>
                        <th className="py-2.5 px-3">شماره گیرنده</th>
                        <th className="py-2.5 px-3">کد</th>
                        <th className="py-2.5 px-3">شناسه الگو</th>
                        <th className="py-2.5 px-3">وضعیت</th>
                        <th className="py-2.5 px-3">زمان ارسال</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {smsLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            هنوز پیامکی در سیستم ثبت نشده است.
                          </td>
                        </tr>
                      ) : (
                        smsLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">{log.phone}</td>
                            <td className="py-2.5 px-3">{log.code}</td>
                            <td className="py-2.5 px-3">{log.patternCode}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {log.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{new Date(log.createdAt).toLocaleString('fa-IR')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. GOOGLE INTEGRATIONS (GTM, GSC, GOOGLE OAUTH) TAB */}
          {/* ========================================================================= */}
          {activeTab === 'google-integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] font-mono">
                  اتصال به ابزارهای گوگل (Google Tag Manager, Search Console & OAuth)
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  پیکربندی تگ منیجر، تایید مالکیت در گوگل سرچ کنسول و احراز هویت ورود با جیمیل
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. GTM */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Globe className="w-5 h-5" />
                    <h3 className="text-sm font-bold font-mono">Google Tag Manager (GTM)</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    با وارد کردن شناسه GTM، تگ‌های آنالیتیکس و رهگیری به صورت خودکار در تمام صفحات سایت لود می‌شوند.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="gtmContainerId" className="block text-xs font-mono text-slate-600 mb-1">GTM Container ID</label>
                      <input
                        id="gtmContainerId"
                        type="text"
                        dir="ltr"
                        value={siteSettings?.gtmContainerId || ''}
                        onChange={e => setSiteSettings(s => s ? { ...s, gtmContainerId: e.target.value.trim() } : null)}
                        placeholder="GTM-XXXXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="gtmEnabled"
                        checked={siteSettings?.gtmEnabled ?? false}
                        onChange={e => setSiteSettings(s => s ? { ...s, gtmEnabled: e.target.checked } : null)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="gtmEnabled" className="text-xs text-slate-700 cursor-pointer">
                        فعال‌سازی اسکریپت تگ منیجر در صفحات
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold font-mono text-blue-700">Google Search Console</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    برای مالکیت از نوع URL-prefix، مقدار content متاتگ را در متغیر سرور
                    <code dir="ltr"> GSC_VERIFICATION_CODE </code>
                    قرار دهید. تأیید مالکیت از نوع Domain با رکورد DNS انجام می‌شود.
                  </p>
                </div>

                {/* 3. Google OAuth */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Mail className="w-5 h-5" />
                    <h3 className="text-sm font-bold font-mono">ورود با گوگل (Google OAuth)</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    شناسه کلاینت احراز هویت گوگل برای ورود سریع کاربران با جیمیل.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1">Google Client ID</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={siteSettings?.googleClientId || ''}
                        onChange={e => setSiteSettings(s => s ? { ...s, googleClientId: e.target.value } : null)}
                        placeholder="...apps.googleusercontent.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="googleLoginEnabled"
                        checked={siteSettings?.googleLoginEnabled ?? true}
                        onChange={e => setSiteSettings(s => s ? { ...s, googleLoginEnabled: e.target.checked } : null)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="googleLoginEnabled" className="text-xs text-slate-700 cursor-pointer">
                        نمایش دکمه ورود با جیمیل در پاپ‌آپ ورود
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {settingsError && <p role="alert" className="text-sm text-red-700">{settingsError}</p>}
              {settingsSuccess && <p role="status" className="text-sm text-green-700">تنظیمات ذخیره شد.</p>}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs shadow-sm cursor-pointer transition-colors"
                >
                  ذخیره تنظیمات اتصال گوگل
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. LEADS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">درخواست‌های مشاوره و تماس</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    لیست پیام‌ها و فرم‌های تکمیل‌شده توسط بازدیدکنندگان وب‌سایت
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                {leads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">هیچ درخواستی ثبت نشده است.</div>
                ) : (
                  leads.map(lead => (
                    <div key={lead.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A]">{lead.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            {lead.type === 'consultation' ? 'فرم مشاوره اختصاصی' : 'فرم تماس سریع'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-slate-400">{new Date(lead.createdAt).toLocaleDateString('fa-IR')}</span>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="حذف لید"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>شماره تماس: <strong className="text-slate-900">{lead.phone || 'ثبت نشده'}</strong></div>
                        <div>ایمیل: <strong className="text-slate-900">{lead.email || 'ثبت نشده'}</strong></div>
                        {lead.budget && <div>بودجه: <strong className="text-blue-700">{lead.budget}</strong></div>}
                      </div>

                      {lead.message && (
                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                          {lead.message}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">وضعیت پیگیری:</span>
                        {(['new', 'contacted', 'closed'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => handleUpdateLeadStatus(lead.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                              lead.status === st
                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st === 'new' ? 'جدید' : st === 'contacted' ? 'تماس گرفته شد' : 'بسته شده'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. SERVICES TAB */}
          {/* ========================================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">مدیریت خدمات استودیو</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">افزودن، ویرایش و چیدمان پکیج‌های خدماتی</p>
                </div>
                <button
                  onClick={() => {
                    setEditingService({
                      title: '',
                      subtitle: '',
                      category: 'web',
                      iconName: 'Code',
                      description: '',
                      features: [''],
                      metrics: '',
                      deliverables: ['']
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن خدمت جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(srv => (
                  <div key={srv.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#0F172A] text-sm font-mono">{srv.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingService(srv);
                            setIsServiceModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. PROJECTS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">مدیریت نمونه‌کارها و پروژه‌ها</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">پروژه‌های شاخص طراحی وب و سئو</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      client: '',
                      category: 'web',
                      categoryLabel: 'طراحی وب',
                      thumbnail: '',
                      year: '۱۴۰۳',
                      summary: '',
                      fullDescription: '',
                      tags: ['React'],
                      impactMetrics: [{ label: 'رشد ترافیک', value: '+۱۵۰%' }]
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن نمونه‌کار جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map(proj => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition-colors">
                    <img src={proj.thumbnail} alt={proj.title} className="w-full h-36 object-cover rounded-xl border border-slate-100" />
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#0F172A] font-mono">{proj.title}</h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          className="p-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. TESTIMONIALS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">نظرات و توصیه‌نامه‌های مشتریان</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">بازخوردهای مدیران و کارفرمایان</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTestimonial({
                      name: '',
                      role: '',
                      company: '',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      quote: '',
                      rating: 5,
                      resultsAchieved: ''
                    });
                    setIsTestimonialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن نظر جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                        <div>
                          <div className="font-bold text-xs text-[#0F172A]">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.role} - {item.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTestimonial(item);
                            setIsTestimonialModalOpen(true);
                          }}
                          className="p-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{item.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. CERTIFICATES TAB */}
          {/* ========================================================================= */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">مدیریت گواهینامه‌ها و مدارک</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">مدارک بین‌المللی Google, HubSpot, Meta</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCertificate({
                      title: '',
                      issuer: 'Google',
                      issueDate: '۲۰۲۴',
                      credentialId: '',
                      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
                      badgeType: 'gold',
                      description: '',
                      skills: ['SEO']
                    });
                    setIsCertificateModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن گواهینامه جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition-colors">
                    <img src={cert.image} alt={cert.title} className="w-full h-32 object-cover rounded-xl border border-slate-100" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#0F172A]">{cert.title}</h4>
                        <span className="text-[10px] text-blue-700 font-mono font-medium">{cert.issuer}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCertificate(cert);
                            setIsCertificateModalOpen(true);
                          }}
                          className="p-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. FAQS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">سوالات متداول</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">مدیریت پرسش‌ها و پاسخ‌های پرتکرار</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaq({
                      question: '',
                      answer: '',
                      category: 'عمومی'
                    });
                    setIsFaqModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن سوال جدید</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map(faq => (
                  <div key={faq.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                          {faq.category}
                        </span>
                        <h4 className="font-bold text-xs text-[#0F172A]">{faq.question}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingFaq(faq);
                            setIsFaqModalOpen(true);
                          }}
                          className="p-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. TYPOGRAPHY & FONT SETTINGS TAB (EXCLUSIVE SHABNAM + PER-TAG ENGINE) */}
          {/* ========================================================================= */}
          {activeTab === 'typography' && siteSettings && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-xs">
                      <Type className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0F172A] font-mono">مدیریت فونت شبنم و تنظیمات مجزای تگ‌ها</h2>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    تنظیم اختصاصی اندازه (Size)، ضخامت (Weight) و ارتفاع خط (Line Height) برای تک‌تک تگ‌های H1 تا H6، متن بدنه، دکمه‌ها و ناوبری با فونت شبنم
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetTypographyDefaults}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono transition-colors cursor-pointer"
                  >
                    بازگردانی پیش‌فرض (شبنم)
                  </button>
                  {settingsSuccess && (
                    <span className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-mono flex items-center gap-1.5 animate-pulse">
                      <CheckCircle className="w-3.5 h-3.5" />
                      تنظیمات ذخیره شد
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    ذخیره کلیه تنظیمات فونت
                  </button>
                </div>
              </div>

              {/* 1. EXCLUSIVE SHABNAM FONT HERO CARD */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <span className="text-2xl font-black font-mono">ش</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#0F172A] font-mono">فونت رسمی وب‌سایت: فونت شبنم (Shabnam)</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-bold font-mono">
                          فونت اختصاصی فعال
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        فونت شبنم با وضوح فوق‌العاده، رنده‌سازی هندسی شارپ و پشتیبانی کامل از ۷ وزن (از ۳۰۰ تا ۹۰۰) برای کل بخش‌های سایت
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-blue-800 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>تایپ‌فیس یکپارچه در کل سامانه</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-slate-100">
                  {[
                    { weight: '300', label: 'سبک (Light)', sample: 'سیگنالوکس ۳۰۰' },
                    { weight: '400', label: 'معمولی (Regular)', sample: 'سیگنالوکس ۴۰۰' },
                    { weight: '500', label: 'متوسط (Medium)', sample: 'سیگنالوکس ۵۰۰' },
                    { weight: '600', label: 'نیمه‌بولد (SemiBold)', sample: 'سیگنالوکس ۶۰۰' },
                    { weight: '700', label: 'بولد (Bold)', sample: 'سیگنالوکس ۷۰۰' },
                    { weight: '800', label: 'خیلی بولد (ExtraBold)', sample: 'سیگنالوکس ۸۰۰' },
                    { weight: '900', label: 'سیاه (Black)', sample: 'سیگنالوکس ۹۰۰' }
                  ].map(w => (
                    <div key={w.weight} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-500 font-mono">{w.label}</div>
                      <div className="text-xs text-[#0F172A] mt-1" style={{ fontWeight: Number(w.weight) }}>
                        {w.sample}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. GRANULAR PER-TAG CONTROLS (H1, H2, H3, H4, H5, H6, P, BUTTON, SMALL, NAVBAR) */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-5 h-5 text-blue-700" />
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A] font-mono">
                        تنظیمات تفکیکی و مجزای تگ‌های HTML (Tag-by-Tag Granular Control)
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        روی هر تگ کلیک کنید تا اندازه (Font Size)، ضخامت (Font Weight) و فاصله خطوط (Line Height) آن را مستقل تغییر دهید:
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 font-medium">
                    تگ انتخابی: <strong className="text-blue-700 uppercase">{selectedTypographyTag}</strong>
                  </span>
                </div>

                {/* Tag Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                  {[
                    { id: 'h1', label: 'H1', title: 'تیتر اصلی' },
                    { id: 'h2', label: 'H2', title: 'تیتر بخش' },
                    { id: 'h3', label: 'H3', title: 'زیرتیتر' },
                    { id: 'h4', label: 'H4', title: 'عنوان کارت' },
                    { id: 'h5', label: 'H5', title: 'تیتر کوچک' },
                    { id: 'h6', label: 'H6', title: 'برچسب ریز' },
                    { id: 'p', label: 'P', title: 'متن بدنه' },
                    { id: 'button', label: 'BTN', title: 'دکمه‌ها' },
                    { id: 'small', label: 'Small', title: 'متن کمکی' },
                    { id: 'navbar', label: 'Nav', title: 'منوی ناوبری' }
                  ].map(t => {
                    const isSelected = selectedTypographyTag === t.id;
                    const tagConf = (siteSettings.tagsTypography || DEFAULT_TAG_TYPOGRAPHY)[t.id as keyof TagTypographySettings] || DEFAULT_TAG_TYPOGRAPHY[t.id as keyof TagTypographySettings];
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTypographyTag(t.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-600 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-xs font-black font-mono uppercase">{t.label}</span>
                        <span className="text-[9px] text-slate-400">{t.title}</span>
                        <span className="text-[9px] font-mono text-slate-600 mt-1 px-1.5 py-0.5 rounded bg-slate-200/60">
                          {tagConf.fontSize} | {tagConf.fontWeight}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Tag Customizer Card */}
                {(() => {
                  const tagKey = selectedTypographyTag;
                  const currentTags = siteSettings.tagsTypography || DEFAULT_TAG_TYPOGRAPHY;
                  const activeConfig = currentTags[tagKey] || DEFAULT_TAG_TYPOGRAPHY[tagKey];

                  const tagDescriptions: Record<string, { name: string; role: string; sample: string }> = {
                    h1: {
                      name: 'تگ H1 (Heading 1)',
                      role: 'تیترهای اصلی صفحه اصلی، مقالات وبلاگ و بنر هر صفحه',
                      sample: 'آژانس دیجیتال مارکتینگ و توسعه وب سیگنالوکس'
                    },
                    h2: {
                      name: 'تگ H2 (Heading 2)',
                      role: 'تیتر بخش‌های اصلی سایت (خدمات، نمونه کارها، درباره ما، تماس)',
                      sample: 'راهکارهای اختصاصی سئو، طراحی UI/UX و برندینگ سازمانی'
                    },
                    h3: {
                      name: 'تگ H3 (Heading 3)',
                      role: 'زیربخش‌ها و عناوین گروه‌بندی شده در سکشن‌ها',
                      sample: 'طراحی معماری میکروسرویس و پنل‌های مدیریتی پیشرفته'
                    },
                    h4: {
                      name: 'تگ H4 (Heading 4)',
                      role: 'عناوین کارت‌های خدمات، گواهینامه‌ها و پروژه‌های شاخص',
                      sample: 'توسعه پلتفرم ابری اختصاصی با امنیت فوق پیشرفته'
                    },
                    h5: {
                      name: 'تگ H5 (Heading 5)',
                      role: 'عناوین ماژول‌های فرعی، فیچرهای جانبی و ابزارک‌ها',
                      sample: 'سیستم ثبت تیکت پشتیبانی ۲۴ ساعته و ارسال پیامک'
                    },
                    h6: {
                      name: 'تگ H6 (Heading 6)',
                      role: 'برچسب‌های متنی ریز، نام دسته‌بندی‌ها و تگ‌های شناور',
                      sample: 'برچسب سئو و بهینه‌سازی تکنیکال'
                    },
                    p: {
                      name: 'تگ P (Paragraph / Body)',
                      role: 'متن اصلی پاراگراف‌ها، توضیحات خدمات و متون وبلاگ',
                      sample: 'ما در استودیو سیگنالوکس با بهره‌گیری از به‌روزترین متدهای طراحی و توسعه نرم‌افزار، به برندها کمک می‌کنیم تا سهم بازار خود را تا چند برابر افزایش دهند.'
                    },
                    button: {
                      name: 'تگ Button (دکمه‌ها و CTA)',
                      role: 'دکمه‌های ثبت درخواست، دکمه‌های فرم‌ها و کال‌تو‌اکشن‌ها',
                      sample: 'دریافت مشاوره تخصصی رایگان'
                    },
                    small: {
                      name: 'تگ Small (متون کمکی و فوتر)',
                      role: 'متون راهنما زیر فیلدها، توضیحات فوتر و کپی‌رایت',
                      sample: 'تمامی حقوق مادی و معنوی متعلق به آژانس سیگنالوکس است.'
                    },
                    navbar: {
                      name: 'منوی ناوبری (Navbar Links)',
                      role: 'آیتم‌های هدر، لینک‌های منوی بالای سایت و زیرمنوها',
                      sample: 'نمونه‌کارها  |  درباره ما  |  خدمات  |  تماس با ما'
                    }
                  };

                  const info = tagDescriptions[tagKey] || {
                    name: `تگ ${tagKey.toUpperCase()}`,
                    role: 'عنصر سفارشی تایپوگرافی',
                    sample: 'متن نمونه فونت شبنم سیگنالوکس'
                  };

                  return (
                    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                        <div>
                          <h4 className="text-sm font-bold text-blue-700 font-mono flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                            {info.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{info.role}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
                          <span>اندازه فعلی: <strong className="text-blue-700">{activeConfig.fontSize}</strong></span>
                          <span>|</span>
                          <span>وزن: <strong className="text-slate-800">{activeConfig.fontWeight}</strong></span>
                          <span>|</span>
                          <span>ارتفاع خط: <strong className="text-slate-800">{activeConfig.lineHeight || '1.4'}</strong></span>
                        </div>
                      </div>

                      {/* Control Grid: Size, Weight, Line-Height */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* 1. Tag Size */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#0F172A] font-mono">
                              اندازه فونت (Font Size)
                            </label>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                              {activeConfig.fontSize}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={activeConfig.fontSize}
                              onChange={e => handleTagTypographyChange(tagKey, 'fontSize', e.target.value)}
                              placeholder="مثلاً 2.25rem یا 24px"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Quick Size Presets for this tag */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {['0.75rem', '0.875rem', '1rem', '1.15rem', '1.25rem', '1.5rem', '1.75rem', '2rem', '2.25rem', '2.75rem', '3rem'].map(sz => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => handleTagTypographyChange(tagKey, 'fontSize', sz)}
                                className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                                  activeConfig.fontSize === sz
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Tag Weight */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#0F172A] font-mono">
                              وزن و ضخامت (Font Weight)
                            </label>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                              {activeConfig.fontWeight}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            {FONT_WEIGHT_PRESETS.map(w => {
                              const isActive = activeConfig.fontWeight === w.id;
                              return (
                                <button
                                  key={w.id}
                                  type="button"
                                  onClick={() => handleTagTypographyChange(tagKey, 'fontWeight', w.id)}
                                  className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                                    isActive
                                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  }`}
                                >
                                  <div className="text-[11px] font-mono font-bold">{w.id}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Tag Line Height */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#0F172A] font-mono">
                              ارتفاع خط (Line Height)
                            </label>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                              {activeConfig.lineHeight || '1.4'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={activeConfig.lineHeight || '1.4'}
                              onChange={e => handleTagTypographyChange(tagKey, 'lineHeight', e.target.value)}
                              placeholder="مثلاً 1.3 یا 1.6"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {['1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '2.0'].map(lh => (
                              <button
                                key={lh}
                                type="button"
                                onClick={() => handleTagTypographyChange(tagKey, 'lineHeight', lh)}
                                className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                                  (activeConfig.lineHeight || '1.4') === lh
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {lh}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Live Isolated Tag Preview */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>پیش‌نمایش رندر زنده تگ با استایل‌های بالا:</span>
                          <span className="text-blue-700 font-mono font-medium">
                            font-size: {activeConfig.fontSize}; font-weight: {activeConfig.fontWeight}; line-height: {activeConfig.lineHeight || '1.4'};
                          </span>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center min-h-[70px]">
                          <div
                            style={{
                              fontSize: activeConfig.fontSize,
                              fontWeight: Number(activeConfig.fontWeight) || 400,
                              lineHeight: activeConfig.lineHeight || '1.4',
                              fontFamily: "'Shabnam', system-ui, sans-serif"
                            }}
                            className="text-[#0F172A] transition-all text-center"
                          >
                            {info.sample}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* All Tags Matrix Table */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#0F172A] font-mono">
                    جدول ماتریس جامع کلیه تگ‌های تایپوگرافی سایت
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                    <table className="w-full text-right text-xs font-mono">
                      <thead className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="p-3">تگ HTML</th>
                          <th className="p-3">عنوان و کاربرد</th>
                          <th className="p-3">اندازه (Size)</th>
                          <th className="p-3">ضخامت (Weight)</th>
                          <th className="p-3">فاصله خط (LH)</th>
                          <th className="p-3 text-center">عملیات ویرایش</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {[
                          { key: 'h1', tag: 'H1', desc: 'تیتر اصلی صفحه و مقالات' },
                          { key: 'h2', tag: 'H2', desc: 'تیتر بخش‌های اصلی سایت' },
                          { key: 'h3', tag: 'H3', desc: 'زیربخش‌ها و عنوان دسته‌ها' },
                          { key: 'h4', tag: 'H4', desc: 'عنوان کارت‌ها و پروژه‌ها' },
                          { key: 'h5', tag: 'H5', desc: 'تیترهای فرعی و ابزارک‌ها' },
                          { key: 'h6', tag: 'H6', desc: 'برچسب‌ها و تگ‌های کوچک' },
                          { key: 'p', tag: 'P', desc: 'متن بدنه و پاراگراف‌ها' },
                          { key: 'button', tag: 'Button', desc: 'دکمه‌ها و فراخوان‌های اقدام' },
                          { key: 'small', tag: 'Small', desc: 'متن‌های کمکی و کپی‌رایت' },
                          { key: 'navbar', tag: 'Navbar', desc: 'منوی ناوبری هدر و زیرمنوها' }
                        ].map(row => {
                          const conf = (siteSettings.tagsTypography || DEFAULT_TAG_TYPOGRAPHY)[row.key as keyof TagTypographySettings] || DEFAULT_TAG_TYPOGRAPHY[row.key as keyof TagTypographySettings];
                          const isSelected = selectedTypographyTag === row.key;
                          return (
                            <tr
                              key={row.key}
                              className={`hover:bg-slate-50 transition-colors ${
                                isSelected ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <td className="p-3 font-bold text-blue-700 uppercase">{row.tag}</td>
                              <td className="p-3 text-slate-700">{row.desc}</td>
                              <td className="p-3 text-blue-600 font-bold">{conf.fontSize}</td>
                              <td className="p-3 text-slate-800 font-bold">{conf.fontWeight}</td>
                              <td className="p-3 text-slate-600 font-bold">{conf.lineHeight || '1.4'}</td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedTypographyTag(row.key as any)}
                                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-mono cursor-pointer transition-colors font-medium border border-blue-200"
                                >
                                  تنظیم اختصاصی
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 3. GLOBAL BASE SIZES & LINE HEIGHT CONTROLS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Base Font Size */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-700" />
                      <h3 className="text-xs font-bold text-[#0F172A] font-mono">اندازه پایه متون (Base Size)</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                      {siteSettings.fontSizeBase || '16px'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
                    اندازه پایه متن بدنه، کارت‌ها و پاراگراف‌ها را در کل صفحات تعیین می‌کند.
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {FONT_SIZE_PRESETS.slice(0, 6).map(preset => {
                      const isActive = (siteSettings.fontSizeBase || '16px') === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleFontSizeChange(preset.id)}
                          className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="text-xs font-mono font-bold">{preset.id}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{preset.label.split(' ')[0]}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>اسلایدر دقیق (۱۳ تا ۲۲ پیکسل):</span>
                      <span className="text-blue-700 font-bold">{siteSettings.fontSizeBase || '16px'}</span>
                    </div>
                    <input
                      type="range"
                      min="13"
                      max="22"
                      step="1"
                      value={parseInt(siteSettings.fontSizeBase || '16', 10) || 16}
                      onChange={e => handleFontSizeChange(`${e.target.value}px`)}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Heading Scale Multiplier */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-700" />
                      <h3 className="text-xs font-bold text-[#0F172A] font-mono">مقیاس عناوین (Heading Scale)</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                      {siteSettings.fontHeadingScale || '1.25'}x
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
                    نسبت بزرگی تگ‌های H1, H2, H3 نسبت به متن پایه را به صورت هماهنگ تنظیم می‌کند.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {HEADING_SCALE_PRESETS.map(preset => {
                      const isActive = (siteSettings.fontHeadingScale || '1.25') === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleHeadingScaleChange(preset.id)}
                          className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="text-xs font-mono font-bold">{preset.id}x</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{preset.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>اسلایدر مقیاس (۱.۱۰ تا ۱.۵۰):</span>
                      <span className="text-blue-700 font-bold">{siteSettings.fontHeadingScale || '1.25'}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.10"
                      max="1.50"
                      step="0.05"
                      value={parseFloat(siteSettings.fontHeadingScale || '1.25') || 1.25}
                      onChange={e => handleHeadingScaleChange(e.target.value)}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Line Height Scale */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-700" />
                      <h3 className="text-xs font-bold text-[#0F172A] font-mono">ارتفاع خطوط بدنه (Line Height)</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                      {siteSettings.lineHeightScale || '1.65'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
                    فاصله عمودی خطوط متون بدنه و پاراگراف‌ها را تنظیم می‌کند.
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: '1.50', label: 'فشرده' },
                      { value: '1.65', label: 'استاندارد' },
                      { value: '1.80', label: 'خوانایی بالا' }
                    ].map(preset => {
                      const isActive = (siteSettings.lineHeightScale || '1.65') === preset.value;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => handleLineHeightChange(preset.value)}
                          className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="text-xs font-mono font-bold">{preset.value}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{preset.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>تنظیم دقیق (۱.۴۰ تا ۲.۱۰):</span>
                      <span className="text-blue-700 font-bold">{siteSettings.lineHeightScale || '1.65'}</span>
                    </div>
                    <input
                      type="range"
                      min="1.40"
                      max="2.10"
                      step="0.05"
                      value={parseFloat(siteSettings.lineHeightScale || '1.65') || 1.65}
                      onChange={e => handleLineHeightChange(e.target.value)}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 4. LIVE TYPOGRAPHY PREVIEW STUDIO */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-blue-700" />
                    <h3 className="text-sm font-bold text-[#0F172A] font-mono">استودیوی پیش‌نمایش زنده تایپوگرافی شبنم</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    تغییرات به صورت لحظه‌ای در همین صفحه و کل وب‌سایت اعمال می‌شود
                  </span>
                </div>

                {/* Preview Box */}
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-6">
                  {/* Headline Preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">تیتر اصلی سطح ۱ (Heading 1)</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                      آژانس دیجیتال سیگنالوکس؛ خلق تجارب دیجیتال بدون مرز
                    </h1>
                  </div>

                  {/* Subhead Preview */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">تیتر سطح ۲ (Heading 2)</span>
                    <h2 className="text-lg sm:text-xl font-bold text-blue-900">
                      طراحی وب‌سایت‌های اختصاصی، استراتژی سئو و توسعه پلتفرم‌های ابری
                    </h2>
                  </div>

                  {/* Paragraph Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">متن بدنه و پاراگراف (Body Text)</span>
                    <p className="text-slate-700 leading-relaxed">
                      ما در استودیو سیگنالوکس با اتکا به دانش روز طراحی رابط کاربری (UI/UX)، معماری مقیاس‌پذیر و استانداردهای پیشرفته تایپوگرافی فارسی، کسب‌وکار شما را در مسیر رشد سریع و فروش پایدار هدایت می‌کنیم. تمامی المان‌ها متناسب با هویت برند شما بهینه‌سازی می‌شوند.
                    </p>
                  </div>

                  {/* Badges, Numbers & Buttons Preview */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
                    <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors">
                      دکمه ثبت درخواست مشاوره
                    </button>
                    <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-medium">
                      نمونه نشان تایپوگرافی
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-medium">
                      اعداد فارسی: ۱۲۳،۴۵۶،۷۸۹ تومان (+۲۱۰٪)
                    </span>
                  </div>
                </div>

                {/* Footer Save Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    ذخیره تنظیمات فونت در سرور
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. GENERAL SETTINGS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && siteSettings && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] font-mono">تنظیمات عمومی وب‌سایت</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">عناوین، راه‌های ارتباطی و شبکه‌های اجتماعی</p>
                </div>
                {settingsSuccess && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-mono">
                    تنظیمات با موفقیت ذخیره شد
                  </span>
                )}
              </div>

              {/* Quick Font Summary Card inside Settings */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] font-mono">تایپوگرافی و فونت فعال وب‌سایت</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      فونت: <span className="text-blue-700 font-bold">{PERSIAN_FONT_PRESETS.find(p => p.id === (siteSettings.fontFamily || 'Shabnam'))?.name.replace(/ \(.*\)/, '') || 'شبنم'}</span> | سایز پایه: <span className="text-blue-700 font-bold">{siteSettings.fontSizeBase || '16px'}</span> | مقیاس تیترها: <span className="text-blue-700 font-bold">{siteSettings.fontHeadingScale || '1.25'}x</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('typography')}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-mono transition-colors cursor-pointer font-medium"
                >
                  ویرایش فونت و سایزها ←
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">عنوان سایت</label>
                    <input
                      type="text"
                      value={siteSettings.siteTitle}
                      onChange={e => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">تلفن تماس</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={siteSettings.contactPhone}
                      onChange={e => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">ایمیل ارتباطی</label>
                    <input
                      type="email"
                      dir="ltr"
                      value={siteSettings.contactEmail}
                      onChange={e => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">آدرس اینستاگرام</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={siteSettings.instagramUrl}
                      onChange={e => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">تیتر اصلی هیرو (Hero Headline)</label>
                  <input
                    type="text"
                    value={siteSettings.heroHeadline}
                    onChange={e => setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">زیرعنوان هیرو (Hero Subtitle)</label>
                  <textarea
                    rows={3}
                    value={siteSettings.heroSubtitle}
                    onChange={e => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
                  >
                    ذخیره تنظیمات سایت
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MEDIA TESTIMONIALS (PODCASTS & VIDEOS) TAB */}
          {/* ========================================================================= */}
          {activeTab === 'media-testimonials' && <MediaTestimonialsManager />}

          {/* ========================================================================= */}
          {/* BLOG MANAGER TAB */}
          {/* ========================================================================= */}
          {activeTab === 'blog' && <BlogManager />}

          {/* ========================================================================= */}
          {/* COMMENTS & DISCUSSION MANAGER TAB */}
          {/* ========================================================================= */}
          {activeTab === 'comments' && <CommentsManager />}

          {/* ========================================================================= */}
          {/* SEO SUITE & SITEMAP TAB */}
          {/* ========================================================================= */}
          {activeTab === 'seo-suite' && <SeoSuiteManager />}

          {/* ========================================================================= */}
          {/* SPEED & CACHE OPTIMIZER TAB */}
          {/* ========================================================================= */}
          {activeTab === 'speed-optimizer' && <SpeedOptimizerManager />}

          {/* ========================================================================= */}
          {/* SECURITY SUITE (AIOS) TAB */}
          {/* ========================================================================= */}
          {activeTab === 'security' && <SecurityManager />}

          {/* ========================================================================= */}
          {/* TEAM RBAC TAB */}
          {/* ========================================================================= */}
          {activeTab === 'team-rbac' && <AdminTeamManager />}
        </main>
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleSaveService} className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="font-bold text-[#0F172A] text-base font-mono">
              {services.some(s => s.id === editingService.id) ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">عنوان خدمت</label>
              <input
                type="text"
                value={editingService.title || ''}
                onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">زیرعنوان</label>
              <input
                type="text"
                value={editingService.subtitle || ''}
                onChange={e => setEditingService({ ...editingService, subtitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">توضیحات</label>
              <textarea
                rows={3}
                value={editingService.description || ''}
                onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 cursor-pointer font-mono"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs shadow-sm cursor-pointer transition-colors"
              >
                ذخیره خدمت
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project Modal */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleSaveProject} className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="font-bold text-[#0F172A] text-base font-mono">
              {projects.some(p => p.id === editingProject.id) ? 'ویرایش پروژه' : 'افزودن نمونه‌کار جدید'}
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">عنوان پروژه</label>
              <input
                type="text"
                value={editingProject.title || ''}
                onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">کارفرما / برند</label>
              <input
                type="text"
                value={editingProject.client || ''}
                onChange={e => setEditingProject({ ...editingProject, client: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">لینک تصویر شاخص (URL)</label>
              <input
                type="text"
                dir="ltr"
                value={editingProject.thumbnail || ''}
                onChange={e => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">خلاصه توضیحات</label>
              <textarea
                rows={3}
                value={editingProject.summary || ''}
                onChange={e => setEditingProject({ ...editingProject, summary: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 cursor-pointer font-mono"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs shadow-sm cursor-pointer transition-colors"
              >
                ذخیره نمونه‌کار
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleSaveTestimonial} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-[#0F172A] text-base font-mono">
              {testimonials.some(t => t.id === editingTestimonial.id) ? 'ویرایش نظر' : 'افزودن نظر جدید'}
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">نام مشتری</label>
              <input
                type="text"
                value={editingTestimonial.name || ''}
                onChange={e => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">سمت و شرکت</label>
              <input
                type="text"
                value={editingTestimonial.role || ''}
                onChange={e => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                placeholder="مدیر مارکتینگ - تپسی"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">متن نظر</label>
              <textarea
                rows={3}
                value={editingTestimonial.quote || ''}
                onChange={e => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 cursor-pointer font-mono"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs shadow-sm cursor-pointer transition-colors"
              >
                ذخیره نظر
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certificate Modal */}
      {isCertificateModalOpen && editingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleSaveCertificate} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-[#0F172A] text-base font-mono">
              {certificates.some(c => c.id === editingCertificate.id) ? 'ویرایش مدرک' : 'افزودن گواهینامه'}
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">عنوان مدرک</label>
              <input
                type="text"
                value={editingCertificate.title || ''}
                onChange={e => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">صادرکننده</label>
              <input
                type="text"
                value={editingCertificate.issuer || ''}
                onChange={e => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })}
                placeholder="Google / HubSpot"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">لینک تصویر مدرک</label>
              <input
                type="text"
                dir="ltr"
                value={editingCertificate.image || ''}
                onChange={e => setEditingCertificate({ ...editingCertificate, image: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCertificateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 cursor-pointer font-mono"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs shadow-sm cursor-pointer transition-colors"
              >
                ذخیره مدرک
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleSaveFaq} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-[#0F172A] text-base font-mono">
              {faqs.some(f => f.id === editingFaq.id) ? 'ویرایش سوال' : 'افزودن سوال جدید'}
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">دسته‌بندی</label>
              <input
                type="text"
                value={editingFaq.category || ''}
                onChange={e => setEditingFaq({ ...editingFaq, category: e.target.value })}
                placeholder="طراحی وب / سئو / عمومی"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">متن سوال</label>
              <input
                type="text"
                value={editingFaq.question || ''}
                onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1 font-medium">پاسخ</label>
              <textarea
                rows={3}
                value={editingFaq.answer || ''}
                onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 cursor-pointer font-mono"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs shadow-sm cursor-pointer transition-colors"
              >
                ذخیره سوال
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
