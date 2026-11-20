import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchFaqs } from '../services/apiClient';
import { ChevronDown, HelpCircle, Sparkles, Lightbulb } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    question: 'مدت زمان برنامه‌ریزی و تحویل یک پروژه طراحی سایت اختصاصی چقدر است؟',
    answer: 'زمان‌بندی پروژه‌ها بر اساس سطح پیچیدگی و نیازهای سفارشی تعیین می‌شود. به‌طور معمول وب‌سایت‌های شرکتی بین ۲ تا ۴ هفته و پلتفرم‌های پیچیده تحت وب یا فروشگاهی بین ۴ تا ۸ هفته کاری زمان می‌برند.',
    category: 'طراحی وب',
  },
  {
    id: '2',
    question: 'روند اجرای سئو (SEO) و مارکتینگ چقدر زمان می‌برد تا به رتبه‌های برتر گوگل برسد؟',
    answer: 'سئو یک فرآیند مستمر و استراتژیک است. اولین نتایج مثبت بهبود ساختار فنی معمولاً ظرف ۱ تا ۲ ماه نمایان شده و رتبه‌های اصلی در کلمات کلیدی رقابتی طی ۳ تا ۶ ماه تثبیت می‌گردند.',
    category: 'سئو',
  },
  {
    id: '3',
    question: 'آیا خدمات هوش مصنوعی و RAG قابلیت اتصال به سایت‌های موجود را دارند؟',
    answer: 'بله، تمامی سیستم‌های چت‌بات هوشمند، RAG و ایجنت‌های اتوماسیون ما به‌صورت RESTful API یا ویجت‌های تعاملی سبک طراحی شده و بدون نیاز به تغییر در سایت فعلی شما قابل یکپارچه‌سازی هستند.',
    category: 'دیجیتال مارکتینگ',
  }
];

export const FaqSection: React.FC = () => {
  const [faqsList, setFaqsList] = useState<FaqItem[]>(FAQ_DATA);
  const [openId, setOpenId] = useState<string | null>('1');

  useEffect(() => {
    fetchFaqs().then(data => {
      if (data && data.length > 0) {
        setFaqsList(data as any);
        if (!data.some(f => f.id === openId)) {
          setOpenId(data[0].id);
        }
      }
    });
  }, []);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative overflow-hidden bg-[#070609]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-300 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-[24px] font-black text-white mb-4 uppercase">
            سوالات متداول <span className="text-amber-400">مشتریان و کارفرمایان</span>
          </h2>
        </div>

        {/* Accordion List using glass-card styling */}
        <div className="space-y-4">
          {faqsList.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-[12px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-amber-400/60 shadow-[0_0_25px_rgba(212,175,55,0.15)] bg-[#120e1a]/90'
                    : 'border-amber-500/20 hover:border-amber-500/40 bg-[#0d0a12]/70'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-white transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-amber-300' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-amber-100/80 font-light leading-relaxed border-t border-amber-500/10 mr-11">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FaqSection;
