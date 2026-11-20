import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { submitToWeb3Forms } from '../services/web3forms';
import { submitContact, fetchContactDetails, DEFAULT_CONTACT_DETAILS, ContactPageDetails } from '../services/apiClient';
import {
  ArrowRight,
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Globe,
  Home,
  Copy,
  Check,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface ContactUsPageProps {
  onBackToHome: () => void;
  onOpenConsultationModal?: () => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onBackToHome,
  onOpenConsultationModal
}) => {
  const [details, setDetails] = useState<ContactPageDetails>(DEFAULT_CONTACT_DETAILS);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'web',
    budget: '50-100',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    fetchContactDetails().then(data => {
      if (data) {
        setDetails(data);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await Promise.allSettled([
        submitContact({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `خدمت: ${formData.service} | بودجه: ${formData.budget} تومان - پیام: ${formData.message}`
        }),
        submitToWeb3Forms({
          subject: `پیام جدید تماس با ما از ${formData.name || 'کاربر وب‌سایت'}`,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          budget: formData.budget,
          message: formData.message,
        })
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070609] text-gray-100 pt-24 pb-20 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/15">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#121017] border border-amber-500/20 hover:border-amber-400/50 text-white text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer group"
          >
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>بازگشت به صفحه اصلی</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>صفحه اصلی</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">ارتباط و تماس با ما</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-[5px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{details.responseCommitmentBadge || 'پاسخگویی فعال (کمتر از ۲ ساعت)'}</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>پل‌های ارتباط مستقیم</span>
          </span>

          <h1 className="text-[24px] font-black text-white tracking-tight leading-tight mb-4 uppercase">
            ارتباط با متخصصان <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سیگنالوکس</span>
          </h1>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          {/* Phone Call Card */}
          <div className="glow-border-card trionn-tilt-card p-6 border border-amber-500/20 rounded-[5px] flex flex-col justify-between bg-[#121017]" data-cursor-text="تماس">
            <div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px] w-fit mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 uppercase">{details.phoneTitle || 'تماس تلفنی مستقیم'}</h3>
              <p className="text-xs text-amber-200/50 mb-4 font-mono">{details.phoneSubtitle || 'شنبه تا چهارشنبه - ۹:۰۰ الی ۱۸:۰۰'}</p>
              <div className="text-lg font-bold font-mono text-amber-300 ltr text-right mb-4">
                {details.phoneNumber || '۰۹۱۹ ۵۴۶ ۶۴۰۰'}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(details.phoneRaw || details.phoneNumber.replace(/\s+/g, ''), 'phone')}
                className="w-full py-2.5 bg-[#070609] border border-amber-500/20 hover:border-amber-400/50 text-white text-xs font-mono rounded-[5px] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedPhone ? 'شماره کپی شد' : (details.phoneCopyButtonText || 'کپی شماره تماس')}</span>
              </button>
              <a
                href={`tel:${details.phoneRaw || '09352997272'}`}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono rounded-[5px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>برقراری تماس مستقیم</span>
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="glow-border-card trionn-tilt-card p-6 border border-amber-500/20 rounded-[5px] flex flex-col justify-between bg-[#121017]" data-cursor-text="ایمیل">
            <div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px] w-fit mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 uppercase">{details.emailTitle || 'ارسال ایمیل مستقیم'}</h3>
              <p className="text-xs text-amber-200/50 mb-4 font-mono">{details.emailSubtitle || 'پاسخگویی سریع برای درخواست‌های رسمی'}</p>
              <div className="text-sm font-bold font-mono text-amber-300 ltr text-right mb-4 truncate">
                {details.emailAddress || 'hello@signalux.ir'}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(details.emailAddress || 'hello@signalux.ir', 'email')}
                className="w-full py-2.5 bg-[#070609] border border-amber-500/20 hover:border-amber-400/50 text-white text-xs font-mono rounded-[5px] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedEmail ? 'ایمیل کپی شد' : (details.emailCopyButtonText || 'کپی آدرس ایمیل')}</span>
              </button>
              <a
                href={`mailto:${details.emailAddress || 'hello@signalux.ir'}`}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono rounded-[5px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>ارسال مستقیم در نرم‌افزار ایمیل</span>
              </a>
            </div>
          </div>

          {/* Direct Messengers Card */}
          <div className="glow-border-card trionn-tilt-card p-6 border border-amber-500/20 rounded-[5px] flex flex-col justify-between bg-[#121017]" data-cursor-text="پیام‌رسان">
            <div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px] w-fit mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 uppercase">{details.messengersTitle || 'پیام‌رسان‌های تلگرام و واتس‌اپ'}</h3>
              <p className="text-xs text-amber-200/50 mb-4 font-mono">{details.messengersSubtitle || 'مشاوره آنلاین فوری و ارسال فایل پروژه‌ها'}</p>
              <div className="text-xs font-mono text-amber-300 mb-4">
                ID: {details.telegramId || '@Signalux_Studio'}
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={details.telegramLink || 'https://t.me/Signalux_Studio'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#070609] border border-amber-500/20 hover:border-amber-400/50 text-white text-xs font-mono rounded-[5px] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{details.telegramButtonText || 'ارسال پیام در تلگرام'}</span>
              </a>
              {details.whatsappLink && (
                <a
                  href={details.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono rounded-[5px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{details.whatsappButtonText || 'ارسال پیام در واتس‌اپ'}</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Form Box */}
          <div className="lg:col-span-8 glow-border-card p-8 sm:p-10 border border-amber-500/20 rounded-[5px] bg-[#121017]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-xl font-bold text-white uppercase">{details.formTitle || 'فرم ثبت درخواست مشاوره و پیام مستقیم'}</h2>
                <p className="text-xs text-amber-200/50 font-light">{details.formSubtitle || 'اطلاعات خود را وارد کنید تا کارشناسان ما در سریع‌ترین زمان تماس بگیرند.'}</p>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">{details.formSuccessTitle || 'پیام شما با موفقیت ثبت شد!'}</h3>
                <p className="text-xs text-amber-100/60 max-w-md mx-auto font-light">
                  {details.formSuccessDescription || 'از ارتباط شما متشکریم. تیم فنی و استراتژی سیگنالوکس تا حداکثر ۲ ساعت آینده با شما تماس خواهند گرفت.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#070609] border border-amber-500/20 text-xs text-white rounded-[5px] font-mono hover:border-amber-400 transition-all cursor-pointer"
                >
                  ارسال پیام جدید
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-amber-100/70 block mb-2">نام و نام خانوادگی / نام مجموعه *</label>
                    <input
                      type="text"
                      required
                      placeholder={details.formNamePlaceholder || "مثال: علی محمدی / شرکت آریا"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 focus:border-amber-400/80 text-white text-xs rounded-[5px] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-amber-100/70 block mb-2">شماره تماس (جهت بازخورد سریع) *</label>
                    <input
                      type="tel"
                      required
                      placeholder={details.formPhonePlaceholder || "۰9۱۲۰۰۰۰۰۰۰"}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 focus:border-amber-400/80 text-white text-xs rounded-[5px] outline-none transition-all ltr text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-amber-100/70 block mb-2">آدرس ایمیل کاری</label>
                    <input
                      type="email"
                      placeholder={details.formEmailPlaceholder || "name@company.com"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 focus:border-amber-400/80 text-white text-xs rounded-[5px] outline-none transition-all ltr text-right"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-amber-100/70 block mb-2">{details.formServiceLabel || 'دسته‌بندی خدمت مورد نظر'}</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 focus:border-amber-400/80 text-white text-xs rounded-[5px] outline-none transition-all cursor-pointer"
                    >
                      {details.formServicesList && details.formServicesList.length > 0 ? (
                        details.formServicesList.map((srv, idx) => (
                          <option key={srv.id || idx} value={srv.id}>{srv.label}</option>
                        ))
                      ) : (
                        <>
                          <option value="web">توسعه پلتفرم و وب‌سایت اختصاصی</option>
                          <option value="seo">سئو و بهینه‌سازی دیتامحور موتورهای جستجو</option>
                          <option value="marketing">دیجیتال مارکتینگ و کمپین‌های رشد</option>
                          <option value="full">پکیج کامل ۳۶۰ درجه دیجیتال</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-amber-100/70 block mb-2">شرح کوتاه پروژه، سوال یا درخواست شما *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder={details.formMessagePlaceholder || "توضیحات مختصر در مورد نیازمندی‌های پروژه، اهداف یا سوالات خود بنویسید..."}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 focus:border-amber-400/80 text-white text-xs rounded-[5px] outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-widest rounded-[5px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">در حال ارسال پیام...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>{details.formSubmitButtonText || 'ثبت و ارسال پیام به تیم پشتیبانی'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Location & Hours Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glow-border-card p-6 border border-amber-500/20 rounded-[5px] bg-[#121017]">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase">{details.officeTitle || 'دفتر مرکزی سیگنالوکس'}</h3>
              </div>

              <p className="text-xs text-amber-100/70 font-light leading-relaxed mb-6">
                {details.officeAddress || 'کرج / محمدشهر'}
              </p>

              {/* Styled Mock Map Frame / Link */}
              <a
                href={details.officeMapLink || 'https://maps.google.com/?q=Karaj+Mohammadshahr'}
                target="_blank"
                rel="noopener noreferrer"
                className="h-44 rounded-[5px] overflow-hidden border border-amber-500/20 hover:border-amber-400/50 bg-[#070609] relative flex items-center justify-center text-center p-4 transition-all block group"
              >
                <div className="space-y-2">
                  <Globe className="w-8 h-8 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-mono text-amber-100/70 block">{details.officeMapLabel || 'نقشه موقعیت جغرافیایی دفتر'}</span>
                  <span className="text-[10px] font-mono text-amber-300 flex items-center justify-center gap-1">
                    <span>{details.officeAppointmentNote || 'ملاقات حضوری با هماهنگی قبلی'}</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </span>
                </div>
              </a>
            </div>

            <div className="glow-border-card p-6 border border-amber-500/20 rounded-[5px] bg-[#121017]">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase">{details.workingHoursTitle || 'ساعات کاری و پاسخگویی'}</h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-amber-500/15 text-amber-100/80">
                  <span>شنبه تا چهارشنبه:</span>
                  <span className="text-amber-400 font-bold">{details.hoursWeekdays || '۰۹:۰۰ الی ۱۸:۰۰'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-amber-500/15 text-amber-100/80">
                  <span>پنج‌شنبه‌ها:</span>
                  <span className="text-amber-300 font-bold">{details.hoursThursday || '۰۹:۰۰ الی ۱۳:۰۰'}</span>
                </div>
                <div className="flex justify-between text-amber-100/80">
                  <span>جمعه‌ها و ایام تعطیل:</span>
                  <span className="text-amber-200/60">{details.hoursFriday || 'پشتیبانی اضطراری ایمیل'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

