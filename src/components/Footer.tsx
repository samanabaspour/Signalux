import { ROUTE_PATHS } from '../utils/router';
import { SITE_CONTACT } from '../utils/siteContact';
import React, { useEffect, useState } from 'react';
import { Radio, ArrowUp, Mail, MapPin, Phone, Instagram, Linkedin, Send as TelegramIcon, Github } from 'lucide-react';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateAbout?: () => void;
  onNavigateServices?: () => void;
  onNavigateWebDesign?: () => void;
  onNavigateSeo?: () => void;
  onNavigatePortfolio?: () => void;
  onNavigateTestimonials?: () => void;
  onNavigateBlog?: () => void;
  onNavigateContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateAbout,
  onNavigateServices,
  onNavigateWebDesign,
  onNavigateSeo,
  onNavigatePortfolio,
  onNavigateTestimonials,
  onNavigateBlog,
  onNavigateContact
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const update = () => setShowBackToTop(window.scrollY > window.innerHeight);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#070609] border-t border-amber-500/15 pt-16 pb-8 text-amber-100/70 text-xs overflow-hidden">
      {/* Background Lighting Glob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={onNavigateHome || scrollToTop}
              className="flex items-center gap-3 text-right cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 rounded-[5px] group-hover:scale-105 transition-transform">
                <Radio className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-xl font-black text-white font-mono tracking-wider">
                SIGNAL<span className="text-amber-400">UX</span>
              </span>
            </button>

            <p className="text-amber-100/60 text-xs font-light leading-relaxed">
              آژانس پیشتاز توسعه وب، سئو و دیجیتال مارکتینگ. ما با ترکیب هنر کدنویسی، هندسه نوری و تحلیل دقیق داده، کسب‌وکارها را در بازار دیجیتال متمایز می‌سازیم.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 bg-[#121017] border border-amber-500/20 flex items-center justify-center hover:bg-amber-500 hover:border-amber-400 hover:text-slate-950 transition-all rounded-[5px]"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#121017] border border-amber-500/20 flex items-center justify-center hover:bg-amber-500 hover:border-amber-400 hover:text-slate-950 transition-all rounded-[5px]"
                aria-label="لینکدین"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONTACT.telegramUrl}
                className="w-8 h-8 bg-[#121017] border border-amber-500/20 flex items-center justify-center hover:bg-amber-500 hover:border-amber-400 hover:text-slate-950 transition-all rounded-[5px]"
                aria-label="تلگرام"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#121017] border border-amber-500/20 flex items-center justify-center hover:bg-amber-500 hover:border-amber-400 hover:text-slate-950 transition-all rounded-[5px]"
                aria-label="گیت‌هاب"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">نقشه سایت</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={ROUTE_PATHS['projects-list']}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigatePortfolio?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  نمونه‌کارها
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS['testimonials-media']}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigateTestimonials?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  نظرات و رسانه‌ها
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.blog}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigateBlog?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  وبلاگ و مقالات
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.about}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigateAbout?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  درباره ما
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.contact}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigateContact?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  تماس با ما
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">خدمات اصلی</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={ROUTE_PATHS['web-design']}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigateWebDesign?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  طراحی و توسعه وب اختصاصی
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.seo}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigateSeo?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  سئوی فنی و کلاسترینگ محتوا
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.services}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigateServices?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-right cursor-pointer"
                >
                  مشاهده تمام خدمات
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">اطلاعات آدرس و تماس</h4>
            <div className="space-y-2.5 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>کرج / محمدشهر</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={'tel:' + SITE_CONTACT.phone} className="font-mono dir-ltr hover:text-amber-300 transition-colors">{SITE_CONTACT.phoneDisplay}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">hello@signalux.ir</span>
              </div>
            </div>
            <a
              href="https://trustseal.enamad.ir/?id=362129&Code=a61gVIGVrv0lKzDbPyfs"
              target="_blank"
              rel="noopener"
              referrerPolicy="origin"
              className="inline-block rounded-[5px] bg-white p-1"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=362129&Code=a61gVIGVrv0lKzDbPyfs"
                alt="نماد اعتماد الکترونیکی سیگنالوکس"
                width="80"
                height="80"
                loading="lazy"
                className="h-20 w-20 object-contain cursor-pointer"
                {...{ code: 'a61gVIGVrv0lKzDbPyfs' }}
              />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
          <p>© ۲۰۲۶ تمامی حقوق مادی و معنوی متعلق به آژانس دیجیتال سیگنالوکس است.</p>

          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="fixed left-4 bottom-4 z-30 p-2.5 bg-[#121017] border border-amber-500/20 text-white hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-widest text-[10px] rounded-[5px]"
            >
              <span>بازگشت به بالا</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

