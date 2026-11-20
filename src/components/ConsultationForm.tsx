import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ConsultationFormData } from '../types';
import { submitToWeb3Forms } from '../services/web3forms';
import { submitConsultation } from '../services/apiClient';
import { SITE_CONTACT } from '../utils/siteContact';
import { Send, PhoneCall, MessageCircle, Send as TelegramIcon, CheckCircle2, Sparkles, Clock, ShieldCheck, Copy, Check } from 'lucide-react';

export const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    phoneNumber: '',
    businessName: '',
    serviceType: 'توسعه وب و اپلیکیشن',
    budgetRange: 'بین ۵۰ تا ۱۰۰ میلیون تومان',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber) {
      alert('لطفاً نام و شماره تماس خود را وارد نمایید.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const [saved, delivered] = await Promise.allSettled([
        submitConsultation({
          name: formData.fullName,
          phone: formData.phoneNumber,
          businessName: formData.businessName,
          service: formData.serviceType,
          budget: formData.budgetRange,
          message: formData.message
        }),
        submitToWeb3Forms({
          subject: `درخواست مشاوره جدید از ${formData.fullName}`,
          name: formData.fullName,
          phone: formData.phoneNumber,
          business: formData.businessName || 'ثبت نشده',
          service: formData.serviceType,
          budget: formData.budgetRange,
          message: formData.message || 'بدون توضیحات اضافی',
        })
      ]);
      const accepted = (saved.status === 'fulfilled' && saved.value)
        || (delivered.status === 'fulfilled' && delivered.value.success);
      if (!accepted) { setSubmitError('پیام ثبت نشد. لطفاً دوباره تلاش کنید.'); return; }
      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setSubmitError('خطا در ثبت پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(SITE_CONTACT.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="consultation" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070609] border-b border-amber-500/15 overflow-hidden">
      {/* Background Lighting Globs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Info & Direct Messengers */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-white text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>شروع همکاری و مشاوره تخصصی</span>
              </div>

              <h2 className="text-[24px] font-black text-white tracking-tight leading-tight mb-6 uppercase">
                آماده‌اید پروژه شما به <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سطح بعدی</span> صعود کند؟
              </h2>

              {/* Guarantees List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3.5 bg-[#121017] border border-amber-500/20 rounded-[5px]">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">پاسخگویی سریع کمتر از ۴ ساعت</div>
                    <div className="text-[11px] text-amber-200/50">بررسی کامل وضعیت وب‌سایت و حوزه فعالیت</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#121017] border border-amber-500/20 rounded-[5px]">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">قرارداد رسمی و عدم افشای اطلاعات (NDA)</div>
                    <div className="text-[11px] text-amber-200/50">حفظ کامل محرمانه بودن ایده و داده‌ها</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Instant Contact Box */}
            <div className="bg-[#121017] p-6 border border-amber-500/20 space-y-4 rounded-[5px]">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">راه‌های ارتباط مستقیم و فوری:</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={SITE_CONTACT.whatsappUrl + '?text=' + encodeURIComponent('سلام، درخواست مشاوره پروژه دارم')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#070609] border border-amber-500/20 text-white hover:border-amber-400 hover:text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-[5px]"
                >
                  <MessageCircle className="w-4 h-4 text-amber-400" />
                  <span>پیام در واتس‌اپ</span>
                </a>

                <a
                  href={SITE_CONTACT.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#070609] border border-amber-500/20 text-white hover:border-amber-400 hover:text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-[5px]"
                >
                  <TelegramIcon className="w-4 h-4 text-amber-400" />
                  <span>کانال/پیام تلگرام</span>
                </a>
              </div>

              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-100/80">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <a href={'tel:' + SITE_CONTACT.phone} className="font-mono hover:text-amber-300 transition-colors">{SITE_CONTACT.phone}</a>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="p-1.5 bg-white/5 border border-amber-500/20 hover:border-amber-400 text-white/70 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] uppercase font-mono rounded-[5px]"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'کپی شد' : 'کپی شماره'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column Consultation Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 sm:p-10 border border-amber-500/30 relative shadow-2xl rounded-[5px] bg-[#121017]">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 border border-amber-500 rounded-[5px]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase">درخواست شما با موفقیت ثبت شد</h3>
                  <p className="text-amber-100/70 text-sm font-light max-w-md mb-8">
                    از اعتماد شما سپاسگزاریم. کارشناس مربوطه در آژانس سیگنالوکس طی ساعات آینده با شماره {formData.phoneNumber} تماس خواهد گرفت.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: '',
                        phoneNumber: '',
                        businessName: '',
                        serviceType: 'توسعه وب و اپلیکیشن',
                        budgetRange: 'بین ۵۰ تا ۱۰۰ میلیون تومان',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-[#070609] border border-amber-500/20 text-xs font-bold uppercase tracking-widest text-white hover:border-amber-400 rounded-[5px]"
                  >
                    ارسال درخواست جدید
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && <p role="alert" className="text-sm text-red-300">{submitError}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-amber-100/80 mb-2 uppercase tracking-wider">
                        نام و نام خانوادگی <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="مثال: علی رضایی"
                        className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all text-sm rounded-[5px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-amber-100/80 mb-2 uppercase tracking-wider">
                        شماره تماس / واتس‌اپ <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="09121234567"
                        className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all text-sm font-mono dir-ltr text-right rounded-[5px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-amber-100/80 mb-2 uppercase tracking-wider">
                        نام برند یا عنوان کسب‌وکار
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="مثال: شرکت نکسوس"
                        className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all text-sm rounded-[5px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-amber-100/80 mb-2 uppercase tracking-wider">
                        نوع خدمت مورد نیاز
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 text-white focus:outline-none focus:border-amber-400 transition-all text-sm rounded-[5px]"
                      >
                        <option value="توسعه وب و اپلیکیشن">طراحی و توسعه وب‌سایت اختصاصی</option>
                        <option value="دیجیتال مارکتینگ">دیجیتال مارکتینگ و پرفورمنس</option>
                        <option value="سئو و بهینه‌سازی">سئو و بهینه‌سازی ارگانیک</option>
                        <option value="پروپوزال جامع ۳۶۰ درجه">پروپوزال جامع ۳۶۰ درجه</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-100/80 mb-2 uppercase tracking-wider">
                      بودجه تقریبی مد نظر
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 text-white focus:outline-none focus:border-amber-400 transition-all text-sm rounded-[5px]"
                    >
                      <option value="کمتر از ۵۰ میلیون تومان">کمتر از ۵۰ میلیون تومان</option>
                      <option value="بین ۵۰ تا ۱۰۰ میلیون تومان">بین ۵۰ تا ۱۰۰ میلیون تومان</option>
                      <option value="بین ۱۰۰ تا ۲۵۰ میلیون تومان">بین ۱۰۰ تا ۲۵۰ میلیون تومان</option>
                      <option value="بالای ۲۵۰ میلیون تومان (سازمانی)">بالای ۲۵۰ میلیون تومان (سازمانی)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-100/80 mb-2 uppercase tracking-wider">
                      توضیحات کوتاه یا هدف اصلی پروژه
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="خلاصه‌ای از ایده، مخاطبان هدف یا چالش فعلی خود را بنویسید..."
                      className="w-full px-4 py-3 bg-[#070609] border border-amber-500/20 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all text-sm rounded-[5px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-[5px] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">در حال ثبت سیگنال...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>ثبت و ارسال درخواست مشاوره رایگان</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

