import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { NotFoundPage } from './components/NotFoundPage';
import { ThreeSignalHero } from './components/ThreeSignalHero';
import { AboutPhilosophy } from './components/AboutPhilosophy';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { Certificate3DSlider } from './components/Certificate3DSlider';
import { ProcessTimeline } from './components/ProcessTimeline';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ConsultationForm } from './components/ConsultationForm';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { AllProjectsPage } from './components/AllProjectsPage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';
import { ServicesPage } from './components/ServicesPage';
import { WebDesignPage } from './components/WebDesignPage';
import { SeoPage } from './components/SeoPage';
import { TestimonialsMediaPage } from './components/TestimonialsMediaPage';
import { KineticMarquee } from './components/KineticMarquee';
import { TicketPortalModal } from './components/TicketPortalModal';
import { UserAuthModal } from './components/UserAuthModal';
import { UserAccountPage } from './components/UserAccountPage';
import { BlogSection } from './components/BlogSection';
import { BlogPostDetailPage } from './components/BlogPostDetailPage';

import { ServiceItem, PortfolioProject, CertificateItem, AppUser, BlogPost } from './types';
import { fetchSettings } from './services/apiClient';
import { parseCurrentRoute, navigateTo, ROUTE_PATHS, AppView, RouteInfo, isPrivateView, staticPages, StaticView } from './utils/router';

import { applyPageMetadata } from './utils/pageMetadata';

const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteInfo>(() => parseCurrentRoute());
  const activeView: AppView = currentRoute.view;

  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Modals for Tickets and User Auth (Mobile OTP / Google Login)
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(() =>
    currentRoute.view === 'account' && new URLSearchParams(window.location.search).get('login') === '1'
  );
  const [accountVersion, setAccountVersion] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Automatically fetch site settings and inject GTM & GSC tags
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const page = staticPages[activeView as StaticView];
    if (page) applyPageMetadata({ ...page, noIndex: isPrivateView(activeView) });
    if (activeView === 'not-found') {
      applyPageMetadata({ title: 'صفحه پیدا نشد', description: 'نشانی درخواستی وجود ندارد.', noIndex: true });
    }
  }, [activeView]);

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parseCurrentRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Centralized Navigation helper that updates both state and URL
  const changeRoute = (view: AppView, param?: string) => {
    let path: string = ROUTE_PATHS.home;
    if (view === 'project-detail' && param) {
      path = ROUTE_PATHS['project-detail'](param);
    } else if (view === 'blog-detail' && param) {
      path = ROUTE_PATHS['blog-detail'](param);
    } else if (typeof ROUTE_PATHS[view] === 'string') {
      path = ROUTE_PATHS[view] as string;
    }

    navigateTo(path);
  };

  const handleOpenConsultation = () => {
    if (activeView !== 'home') {
      changeRoute('home');
      setTimeout(() => {
        const consultationSection = document.getElementById('consultation');
        if (consultationSection) {
          consultationSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const consultationSection = document.getElementById('consultation');
      if (consultationSection) {
        consultationSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleViewAllProjects = () => {
    changeRoute('projects-list');
  };

  const handleNavigateAbout = () => {
    changeRoute('about');
  };

  const handleNavigateServices = () => {
    changeRoute('services');
  };

  const handleNavigateWebDesign = () => {
    changeRoute('web-design');
  };

  const handleNavigateSeo = () => {
    changeRoute('seo');
  };

  const handleNavigateTestimonialsMedia = () => {
    changeRoute('testimonials-media');
  };

  const handleNavigateContact = () => {
    changeRoute('contact');
  };

  const handleNavigateBlog = () => {
    changeRoute('blog');
  };

  const handleNavigateAccount = () => {
    changeRoute('account');
  };

  const handleOpenAuth = () => {
    if (!isPrivateView(activeView)) {
      navigateTo(ROUTE_PATHS.account + '?login=1');
      return;
    }
    if (activeView === 'admin') navigateTo(ROUTE_PATHS.account);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('login') === '1') {
      url.searchParams.delete('login');
      window.history.replaceState(null, '', url);
    }
    setAuthModalOpen(false);
  };

  const handleSelectBlogPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
    changeRoute('blog-detail', post.slug || post.id);
  };

  const handleSelectProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    changeRoute('project-detail', project.slug || project.id);
  };

  const handleBackToHome = () => {
    changeRoute('home');
  };

  const handleSelectCertificate = (cert: CertificateItem) => {
    setSelectedCertificate(cert);
    setSelectedProject(null);
    setLightboxOpen(true);
  };

  const handleSelectService = (_service: ServiceItem) => {
    handleOpenConsultation();
  };

  const handleAuthSuccess = (_user: AppUser) => {
    setAccountVersion(version => version + 1);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-gray-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 z-50 origin-left shadow-[0_0_12px_rgba(245,158,11,0.6)]"
        style={{ scaleX }}
      />

      {/* Custom Desktop Magnetic Cursor */}
      <CustomCursor />

      {/* Main Content */}
      <>
          {/* Navigation */}
          <Navbar
            key={accountVersion}
            onOpenConsultation={handleOpenConsultation}
            onOpenAuth={handleOpenAuth}
            onNavigateHome={handleBackToHome}
            onNavigateAbout={handleNavigateAbout}
            onNavigateServices={handleNavigateServices}
            onNavigateWebDesign={handleNavigateWebDesign}
            onNavigateSeo={handleNavigateSeo}
            onNavigateTestimonialsMedia={handleNavigateTestimonialsMedia}
            onNavigateContact={handleNavigateContact}
            onNavigateBlog={handleNavigateBlog}
            onNavigateAccount={handleNavigateAccount}
            onViewAllProjects={handleViewAllProjects}
            onArticleSelect={handleSelectBlogPost}
            onProjectSelect={handleSelectProject}
            activeView={activeView}
          />

          {activeView === 'not-found' ? (
            <NotFoundPage />
          ) : activeView === 'about' ? (
            <AboutUsPage
              onBackToHome={handleBackToHome}
              onOpenConsultation={handleOpenConsultation}
              onViewServices={handleNavigateServices}
            />
          ) : activeView === 'account' ? (
            <UserAccountPage
              key={accountVersion}
              onBackToHome={handleBackToHome}
              onOpenAuth={handleOpenAuth}
            />
          ) : activeView === 'blog' ? (
            <div className="pt-16 min-h-screen bg-[#0B0B0F]">
              <BlogSection
                isHomePage={false}
                showFilters={true}
                onArticleSelect={handleSelectBlogPost}
                onBackToHome={handleBackToHome}
              />
            </div>
          ) : activeView === 'blog-detail' ? (
            <BlogPostDetailPage
              key={currentRoute.param}
              post={selectedBlogPost && [selectedBlogPost.slug, selectedBlogPost.id].includes(currentRoute.param ?? '') ? selectedBlogPost : null}
              slugParam={currentRoute.param || selectedBlogPost?.slug || selectedBlogPost?.id}
              onBack={handleNavigateBlog}
              onBackToHome={handleBackToHome}
              onSelectPost={handleSelectBlogPost}
              onOpenConsultation={handleOpenConsultation}
            />
          ) : activeView === 'services' ? (
            <ServicesPage
              onBackToHome={handleBackToHome}
              onOpenConsultation={handleOpenConsultation}
            />
          ) : activeView === 'web-design' ? (
            <WebDesignPage
              onBackToHome={handleBackToHome}
              onOpenConsultation={handleOpenConsultation}
              onViewProjects={handleViewAllProjects}
            />
          ) : activeView === 'seo' ? (
            <SeoPage
              onBackToHome={handleBackToHome}
              onOpenConsultation={handleOpenConsultation}
            />
          ) : activeView === 'testimonials-media' ? (
            <TestimonialsMediaPage
              onBackToHome={handleBackToHome}
              onOpenConsultation={handleOpenConsultation}
            />
          ) : activeView === 'contact' ? (
            <ContactUsPage
              onBackToHome={handleBackToHome}
            />
          ) : activeView === 'admin' ? (
            <Suspense fallback={<p role="status" className="p-24 text-center">در حال بارگیری پنل…</p>}>
              <AdminDashboard onBackToHome={handleBackToHome} />
            </Suspense>
          ) : activeView === 'projects-list' ? (
            <AllProjectsPage
              onBackToHome={handleBackToHome}
              onSelectProject={handleSelectProject}
              onOpenConsultation={handleOpenConsultation}
            />
          ) : activeView === 'project-detail' ? (
            <ProjectDetailPage
              key={currentRoute.param}
              project={selectedProject && [selectedProject.slug, selectedProject.id].includes(currentRoute.param) ? selectedProject : null}
              projectId={currentRoute.param || selectedProject?.id}
              onBack={handleViewAllProjects}
              onSelectProject={handleSelectProject}
              onOpenConsultation={handleOpenConsultation}
            />
          ) : (
            <main>
              {/* Hero Section with Interactive 3D Canvas */}
              <ThreeSignalHero onOpenConsultation={handleOpenConsultation} />

              {/* About & Philosophy Storytelling */}
              <AboutPhilosophy />

              {/* 3 Pillars Services Section & Estimator */}
              <ServicesSection
                onSelectService={handleSelectService}
                onOpenConsultation={handleOpenConsultation}
              />

              {/* Portfolio Grid Gallery */}
              <PortfolioSection
                onSelectProject={handleSelectProject}
                onViewAllProjects={handleViewAllProjects}
              />

              {/* Special Section: 3D Certificate & Accreditation Slider */}
              <Certificate3DSlider onSelectCertificate={handleSelectCertificate} />

              {/* Process Timeline */}
              <ProcessTimeline />

              {/* Latest Blog Articles & SEO Knowledge Base */}
              <BlogSection
                isHomePage={true}
                showFilters={false}
                onArticleSelect={handleSelectBlogPost}
                onViewAllArticles={handleNavigateBlog}
              />

              {/* Testimonials Slider */}
              <TestimonialsSection />

              {/* FAQ Section */}
              <FaqSection />

              {/* Consultation Form & Direct Messengers */}
              <ConsultationForm />
            </main>
          )}

          {/* Footer */}
          {activeView !== 'admin' && (
            <Footer
              onNavigateHome={handleBackToHome}
              onNavigateAbout={handleNavigateAbout}
              onNavigateServices={handleNavigateServices}
              onNavigateWebDesign={handleNavigateWebDesign}
              onNavigateSeo={handleNavigateSeo}
              onNavigatePortfolio={handleViewAllProjects}
              onNavigateTestimonials={handleNavigateTestimonialsMedia}
              onNavigateBlog={handleNavigateBlog}
              onNavigateContact={handleNavigateContact}
            />
          )}

          {/* Modal Lightbox for Certificates only */}
          <LightboxModal
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            project={null}
            certificate={selectedCertificate}
            onOpenConsultation={handleOpenConsultation}
          />

          {/* Ticket System Modal */}
          <TicketPortalModal
            isOpen={ticketModalOpen}
            onClose={() => setTicketModalOpen(false)}
            onOpenAuth={() => {
              setTicketModalOpen(false);
              handleOpenAuth();
            }}
          />

          {/* User Auth Modal (Mobile OTP / Google Login) */}
          <UserAuthModal
            isOpen={authModalOpen}
            onClose={handleCloseAuth}
            onSuccess={handleAuthSuccess}
          />
      </>
    </div>
  );
}
