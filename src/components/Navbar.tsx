import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  PhoneCall,
  Sparkles,
  ChevronDown,
  Globe,
  Search,
  Grid,
  ArrowLeft,
  Headphones,
  User,
  LogOut,
  MessageSquare,
  LayoutTemplate,
  Palette
} from 'lucide-react';
import { getCurrentUser, logoutUser, AppUser, BlogPost } from '../services/apiClient';
import { PortfolioProject } from '../types';
import { SearchOverlay } from './SearchOverlay';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpenTickets?: () => void;
  onOpenAuth?: () => void;
  onNavigateHome?: () => void;
  onNavigateAbout?: () => void;
  onNavigateServices?: () => void;
  onNavigateWebDesign?: () => void;
  onNavigateSeo?: () => void;
  onNavigateTestimonialsMedia?: () => void;
  onNavigateContact?: () => void;
  onNavigateBlog?: () => void;
  onNavigateAccount?: () => void;
  onViewAllProjects?: () => void;
  onArticleSelect?: (post: BlogPost) => void;
  onProjectSelect?: (project: PortfolioProject) => void;
  activeView?: 'home' | 'about' | 'services' | 'web-design' | 'seo' | 'testimonials-media' | 'projects-list' | 'project-detail' | 'contact' | 'blog' | 'blog-detail' | 'account' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConsultation,
  onOpenTickets,
  onOpenAuth,
  onNavigateHome,
  onNavigateAbout,
  onNavigateServices,
  onNavigateWebDesign,
  onNavigateSeo,
  onNavigateTestimonialsMedia,
  onNavigateContact,
  onNavigateBlog,
  onNavigateAccount,
  onViewAllProjects,
  onArticleSelect,
  onProjectSelect,
  activeView = 'home'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const servicesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setIsServicesDropdownOpen(true);
  };

  const handleServicesMouseLeave = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
    }
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const isServicesActive = activeView === 'services' || activeView === 'web-design' || activeView === 'seo';

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeView !== 'home' && onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUserLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070609]/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-2xl'
          : 'bg-[#070609]/60 backdrop-blur-xs border-b border-amber-500/15 py-4'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
            aria-label="سیگنالوکس - صفحه اصلی"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[1px] rounded-[5px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full bg-[#070609] rounded-[4px] flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest text-white uppercase font-mono flex items-center gap-1">
                SIGNAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">UX</span>
              </span>
              <span className="text-[9px] text-amber-200/50 tracking-[0.2em] font-mono -mt-1 uppercase">آکادمی و استودیو دیزاین</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-widest font-medium">
            {/* صفحه اصلی */}
            <button
              onClick={onNavigateHome}
              className={`transition-colors duration-200 relative group py-1 cursor-pointer ${
                activeView === 'home' ? 'text-amber-300 font-bold' : 'text-amber-100/70 hover:text-amber-300'
              }`}
            >
              صفحه اصلی
              <span className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-200 transition-all duration-300 ${
                activeView === 'home' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

            {/* خدمات ما (Mega Menu Trigger) */}
            <div
              className="relative py-2"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                onClick={onNavigateServices}
                className={`transition-colors duration-200 relative group py-1 cursor-pointer flex items-center gap-1.5 ${
                  isServicesActive ? 'text-amber-300 font-bold' : 'text-amber-100/70 hover:text-amber-300'
                }`}
              >
                <span>خدمات ما</span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-200 transition-all duration-300 ${
                  isServicesActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>

              {/* Mega Menu Dropdown with seamless hover bridge */}
              {isServicesDropdownOpen && (
                <div
                  className="absolute top-full right-0 pt-2 w-[400px] z-50 overflow-hidden text-right"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <div className="bg-[#0c0a10]/95 backdrop-blur-2xl border border-amber-500/30 rounded-[8px] p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] relative">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="text-[10px] font-mono font-bold text-amber-400/80 uppercase tracking-widest mb-2 px-2 flex items-center justify-between border-b border-amber-500/15 pb-2">
                      <span>دسته‌بندی خدمات استودیو</span>
                      <span className="text-[9px] text-amber-300/40">SIGNALUX SERVICES</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {/* Sub Item 1: طراحی سایت وردپرسی */}
                      <button
                        onClick={() => {
                          setIsServicesDropdownOpen(false);
                          if (onNavigateWebDesign) onNavigateWebDesign();
                          else if (onNavigateServices) onNavigateServices();
                        }}
                        className="group flex items-start gap-3 p-2.5 rounded-[6px] hover:bg-gradient-to-l hover:from-amber-500/15 hover:to-transparent border border-transparent hover:border-amber-500/20 transition-all text-right w-full cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-[5px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0 mt-0.5">
                          <LayoutTemplate className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                            <span>طراحی سایت وردپرسی (قالب آماده و اختصاصی)</span>
                            <ArrowLeft className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-400" />
                          </div>
                          <p className="text-[11px] text-amber-100/60 font-light mt-0.5 leading-relaxed">
                            راه‌اندازی با قالب آماده پرسرعت یا پیاده‌سازی قالب اختصاصی المنتور و کدنویسی شده
                          </p>
                        </div>
                      </button>

                      {/* Sub Item 2: خدمات طراحی سایت اختصاصی */}
                      <button
                        onClick={() => {
                          setIsServicesDropdownOpen(false);
                          if (onNavigateWebDesign) onNavigateWebDesign();
                        }}
                        className="group flex items-start gap-3 p-2.5 rounded-[6px] hover:bg-gradient-to-l hover:from-amber-500/15 hover:to-transparent border border-transparent hover:border-amber-500/20 transition-all text-right w-full cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-[5px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0 mt-0.5">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                            <span>طراحی وب‌سایت‌های اختصاصی (React & Next.js)</span>
                            <ArrowLeft className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-400" />
                          </div>
                          <p className="text-[11px] text-amber-100/60 font-light mt-0.5 leading-relaxed">
                            توسعه وب‌اپلیکیشن‌ها، پلتفرم‌های سفارشی شرکتی و فروشگاه‌های سنگین
                          </p>
                        </div>
                      </button>

                      {/* Sub Item 3: خدمات سئو و بهینه‌سازی */}
                      <button
                        onClick={() => {
                          setIsServicesDropdownOpen(false);
                          if (onNavigateSeo) onNavigateSeo();
                        }}
                        className="group flex items-start gap-3 p-2.5 rounded-[6px] hover:bg-gradient-to-l hover:from-amber-500/15 hover:to-transparent border border-transparent hover:border-amber-500/20 transition-all text-right w-full cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-[5px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0 mt-0.5">
                          <Search className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                            <span>خدمات سئو و بهینه‌سازی دیتامحور</span>
                            <ArrowLeft className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-400" />
                          </div>
                          <p className="text-[11px] text-amber-100/60 font-light mt-0.5 leading-relaxed">
                            ارتقای رتبه گوگل، بهبود Core Web Vitals و سئوی فنی پیشرفته
                          </p>
                        </div>
                      </button>

                      {/* Sub Item 4: مشاهده همه خدمات */}
                      <button
                        onClick={() => {
                          setIsServicesDropdownOpen(false);
                          if (onNavigateServices) onNavigateServices();
                        }}
                        className="group flex items-center justify-between p-2.5 rounded-[6px] bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/25 transition-all mt-1 w-full cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-[4px] bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                            <Grid className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                              مشاهده همه خدمات
                            </div>
                          </div>
                        </div>
                        <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* نمونه‌کارها */}
            <button
              onClick={onViewAllProjects}
              className={`transition-colors duration-200 relative group py-1 cursor-pointer ${
                activeView === 'projects-list' ? 'text-amber-300 font-bold' : 'text-amber-100/70 hover:text-amber-300'
              }`}
            >
              نمونه‌کارها
              <span className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-200 transition-all duration-300 ${
                activeView === 'projects-list' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

            {/* نظرات و پادکست‌ها */}
            <button
              onClick={onNavigateTestimonialsMedia}
              className={`transition-colors duration-200 relative group py-1 cursor-pointer ${
                activeView === 'testimonials-media' ? 'text-amber-300 font-bold' : 'text-amber-100/70 hover:text-amber-300'
              }`}
            >
              نظرات و پادکست‌ها
              <span className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-200 transition-all duration-300 ${
                activeView === 'testimonials-media' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

            {/* وبلاگ و مقالات */}
            <button
              onClick={onNavigateBlog}
              className={`transition-colors duration-200 relative group py-1 cursor-pointer ${
                (activeView === 'blog' || activeView === 'blog-detail') ? 'text-amber-300 font-bold' : 'text-amber-100/70 hover:text-amber-300'
              }`}
            >
              وبلاگ
              <span className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 ${
                (activeView === 'blog' || activeView === 'blog-detail') ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

            {/* درباره ما */}
            <button
              onClick={onNavigateAbout}
              className={`transition-colors duration-200 relative group py-1 cursor-pointer ${
                activeView === 'about' ? 'text-amber-300 font-bold' : 'text-amber-100/70 hover:text-amber-300'
              }`}
            >
              درباره ما
              <span className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-200 transition-all duration-300 ${
                activeView === 'about' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

            {/* تماس با ما */}
            <button
              onClick={onNavigateContact}
              className={`transition-colors duration-200 relative group py-1 cursor-pointer ${
                activeView === 'contact' ? 'text-amber-300 font-bold' : 'text-amber-100/70 hover:text-amber-300'
              }`}
            >
              تماس با ما
              <span className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-200 transition-all duration-300 ${
                activeView === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Search Icon Button (Pure Icon, No Label) */}
            <button
              onClick={() => setIsSearchOverlayOpen(true)}
              className="h-10 w-10 flex items-center justify-center rounded-[5px] bg-white/5 hover:bg-amber-500/20 text-white/70 hover:text-amber-300 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shrink-0"
              aria-label="جستجو در سایت"
              title="جستجوی هوشمند در سایت (Ajax)"
            >
              <Search className="w-4 h-4 text-amber-400" />
            </button>

            {/* User Auth / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="h-10 flex items-center gap-2 px-3.5 rounded-[5px] bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono transition-colors cursor-pointer hover:bg-amber-500/20 shrink-0"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    {currentUser.firstName?.[0] || 'U'}
                  </div>
                  <span className="max-w-[80px] truncate">{currentUser.firstName || 'کاربر'}</span>
                  <ChevronDown className="w-3 h-3 text-amber-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-[#0e0c14] border border-amber-500/30 rounded-xl p-2 shadow-2xl z-50 text-right space-y-1">
                    <div className="px-3 py-2 border-b border-white/10 text-xs">
                      <div className="font-bold text-white">{currentUser.firstName} {currentUser.lastName}</div>
                      <div className="text-[10px] text-white/50 font-mono">{currentUser.phone || currentUser.email}</div>
                    </div>
                    {onNavigateAccount && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigateAccount();
                        }}
                        className="w-full text-right px-3 py-2 text-xs text-white/90 hover:text-amber-300 hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>حساب کاربری و تیکت‌ها</span>
                      </button>
                    )}
                    <button
                      onClick={handleUserLogout}
                      className="w-full text-right px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>خروج از حساب</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="h-10 flex items-center gap-2 px-3.5 rounded-[5px] bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>ورود / عضویت</span>
                </button>
              )
            )}

            {/* Consultation CTA */}
            <button
              onClick={onOpenConsultation}
              className="h-10 inline-flex items-center justify-center gap-2 px-5 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-300 transition-all duration-300 active:scale-95 cursor-pointer rounded-[5px] shadow-[0_0_20px_rgba(212,175,55,0.35)] shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>مشاوره اختصاصی</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Icon Button */}
            <button
              onClick={() => setIsSearchOverlayOpen(true)}
              className="p-2 bg-[#121017] border border-amber-500/20 text-amber-400 hover:text-amber-300 rounded-[5px]"
              aria-label="جستجو در سایت"
              title="جستجو"
            >
              <Search className="w-4 h-4" />
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  if (onNavigateAccount) onNavigateAccount();
                }}
                className="p-2 bg-[#121017] border border-amber-500/30 text-amber-300 rounded-[5px]"
                title="حساب کاربری و تیکت‌ها"
              >
                <User className="w-4 h-4" />
              </button>
            ) : onOpenAuth ? (
              <button
                onClick={onOpenAuth}
                className="p-2 bg-[#121017] border border-amber-500/20 text-amber-300 rounded-[5px]"
                title="ورود / عضویت"
              >
                <User className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={onOpenConsultation}
              className="px-3 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-500 to-yellow-500 transition-colors rounded-[5px]"
            >
              مشاوره
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 bg-[#121017] border border-amber-500/20 text-amber-200 rounded-[5px]"
              aria-label="باز کردن منو"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slide in from Right with Backdrop Overlay, Portaled to document.body) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[99999] lg:hidden pointer-events-auto" style={{ zIndex: 99999 }}>
              {/* Backdrop Overlay - Closes drawer on tap/click outside */}
              <motion.div
                id="mobile-drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99998] cursor-pointer"
                style={{ zIndex: 99998 }}
                aria-label="بستن منو"
              />

              {/* Slide-over Drawer Panel from Right */}
              <motion.aside
                id="mobile-drawer-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 right-0 bottom-0 w-[320px] max-w-[85vw] bg-[#0c0a10] border-l border-amber-500/30 z-[99999] flex flex-col h-[100dvh] shadow-[-25px_0_60px_rgba(0,0,0,0.95)] text-right overflow-hidden"
                style={{ zIndex: 99999 }}
              >
                {/* Drawer Top Header */}
                <div className="p-4 border-b border-amber-500/20 bg-[#08070c] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[1px] rounded-[5px] shadow-[0_0_12px_rgba(212,175,55,0.35)]">
                      <div className="w-full h-full bg-[#070609] rounded-[4px] flex items-center justify-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-widest text-white uppercase font-mono">
                        SIGNAL<span className="text-amber-400">UX</span>
                      </span>
                      <span className="text-[8px] text-amber-200/50 font-mono tracking-wider">استودیو دیزاین</span>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-[5px] bg-[#14101d] hover:bg-amber-500/15 text-amber-200 hover:text-amber-400 border border-amber-500/20 transition-all cursor-pointer"
                    aria-label="بستن منو"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Banner */}
                <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/15 flex items-center gap-2 text-[10px] text-amber-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>پذیرش پروژه جدید و مشاوره فعال است</span>
                </div>

                {/* Scrollable Navigation Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* User Info / Login Block */}
                  {currentUser ? (
                    <div className="p-3 rounded-[6px] bg-[#14101c] border border-amber-500/25 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                            {currentUser.avatar ? (
                              <img src={currentUser.avatar} alt={currentUser.firstName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              currentUser.firstName ? currentUser.firstName[0] : 'U'
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">{currentUser.firstName} {currentUser.lastName || ''}</span>
                            <span className="text-[10px] text-amber-300/60 font-mono">{currentUser.phone || currentUser.email}</span>
                          </div>
                        </div>
                        <button
                          onClick={handleUserLogout}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-[4px] transition-colors cursor-pointer"
                          title="خروج از حساب"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {onNavigateAccount && (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onNavigateAccount();
                          }}
                          className="w-full py-2 px-3 rounded-[5px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold font-mono flex items-center justify-center gap-2 border border-amber-500/30 transition-colors cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          <span>حساب کاربری و تیکت‌ها</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    onOpenAuth && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full py-2.5 px-3 rounded-[6px] bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-500/30 text-amber-200 text-xs font-mono flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all cursor-pointer"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        <span>ورود / عضویت کارفرمایان</span>
                      </button>
                    )
                  )}

                  {/* Nav Links */}
                  <nav className="flex flex-col space-y-1 text-xs">
                    {/* Home */}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onNavigateHome) onNavigateHome();
                      }}
                      className={`w-full text-right px-3 py-2.5 rounded-[5px] transition-all flex items-center justify-between ${
                        activeView === 'home'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-amber-100/70 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <span>صفحه اصلی</span>
                      {activeView === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>

                    {/* Services Accordion */}
                    <div className="flex flex-col border border-amber-500/15 rounded-[6px] bg-[#0f0d15] overflow-hidden">
                      <button
                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                        className="flex items-center justify-between text-right px-3 py-2.5 text-xs text-amber-100 hover:text-amber-300 w-full transition-colors"
                      >
                        <span className="font-bold">خدمات ما</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isMobileServicesOpen && (
                        <div className="flex flex-col gap-1 p-2 bg-[#09080d] border-t border-amber-500/15">
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (onNavigateWebDesign) onNavigateWebDesign();
                            }}
                            className={`flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-[4px] text-right transition-colors ${
                              activeView === 'web-design' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-amber-200/80 hover:text-amber-400 hover:bg-white/5'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>خدمات طراحی سایت</span>
                          </button>
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (onNavigateSeo) onNavigateSeo();
                            }}
                            className={`flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-[4px] text-right transition-colors ${
                              activeView === 'seo' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-amber-200/80 hover:text-amber-400 hover:bg-white/5'
                            }`}
                          >
                            <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>خدمات سئو و بهینه‌سازی</span>
                          </button>
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (onNavigateServices) onNavigateServices();
                            }}
                            className={`flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-[4px] text-right transition-colors ${
                              activeView === 'services' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-amber-300 hover:text-amber-200 font-semibold hover:bg-white/5'
                            }`}
                          >
                            <Grid className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                            <span>مشاهده همه خدمات استودیو</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Portfolio */}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onViewAllProjects) onViewAllProjects();
                      }}
                      className={`w-full text-right px-3 py-2.5 rounded-[5px] transition-all flex items-center justify-between ${
                        activeView === 'projects-list' || activeView === 'project-detail'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-amber-100/70 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <span>نمونه‌کارها</span>
                      {(activeView === 'projects-list' || activeView === 'project-detail') && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>

                    {/* Testimonials & Podcasts */}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onNavigateTestimonialsMedia) onNavigateTestimonialsMedia();
                      }}
                      className={`w-full text-right px-3 py-2.5 rounded-[5px] transition-all flex items-center justify-between ${
                        activeView === 'testimonials-media'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-amber-100/70 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <span>نظرات و پادکست‌ها</span>
                      {activeView === 'testimonials-media' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>

                    {/* Blog */}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onNavigateBlog) onNavigateBlog();
                      }}
                      className={`w-full text-right px-3 py-2.5 rounded-[5px] transition-all flex items-center justify-between ${
                        (activeView === 'blog' || activeView === 'blog-detail')
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-amber-100/70 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <span>وبلاگ و مقالات تخصصی</span>
                      {(activeView === 'blog' || activeView === 'blog-detail') && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>

                    {/* About Us */}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onNavigateAbout) onNavigateAbout();
                      }}
                      className={`w-full text-right px-3 py-2.5 rounded-[5px] transition-all flex items-center justify-between ${
                        activeView === 'about'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-amber-100/70 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <span>درباره ما</span>
                      {activeView === 'about' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>

                    {/* Contact Us */}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onNavigateContact) onNavigateContact();
                      }}
                      className={`w-full text-right px-3 py-2.5 rounded-[5px] transition-all flex items-center justify-between ${
                        activeView === 'contact'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-amber-100/70 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <span>تماس با ما</span>
                      {activeView === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                  </nav>
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-4 border-t border-amber-500/20 bg-[#08070c] flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenConsultation();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-[5px] shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-98 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>درخواست مشاوره رایگان</span>
                  </button>

                  <a
                    href="tel:09352997272"
                    className="w-full py-2.5 bg-[#121017] hover:bg-[#181520] border border-amber-500/20 text-amber-200/80 text-xs font-mono flex items-center justify-center gap-2 rounded-[5px] transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>تماس مستقیم: ۰۹۳۵۲۹۹۷۲۷۲</span>
                  </a>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Fullscreen Smart Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        onSelectArticle={onArticleSelect}
        onSelectProject={onProjectSelect}
        onNavigateServices={onNavigateServices}
        onNavigateWebDesign={onNavigateWebDesign}
        onNavigateSeo={onNavigateSeo}
        onNavigateAbout={onNavigateAbout}
        onNavigateContact={onNavigateContact}
        onNavigateBlog={onNavigateBlog}
        onViewAllProjects={onViewAllProjects}
        onOpenConsultation={onOpenConsultation}
      />
    </header>
  );
};
