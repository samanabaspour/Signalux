import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Building2,
  Sparkles,
  Code2,
  BrainCircuit,
  Layers,
  Search,
  Terminal,
  Cpu,
  CheckCircle2,
  ArrowLeft,
  X,
  Lightbulb,
} from 'lucide-react';

export interface TeamMemberRoom {
  id: string;
  roomNumber: string;
  floor: string;
  name: string;
  role: string;
  department: string;
  specialty: string;
  exp: string;
  status: string;
  statusColor: string;
  bio: string;
  skills: string[];
  avatarInitial: string;
  icon: React.ElementType;
  positionGrid: {
    col: number;
    row: number;
  };
}

const TEAM_ROOMS: TeamMemberRoom[] = [
  {
    id: 'samani',
    roomNumber: 'اتاق ۴۰۱',
    floor: 'طبقه ۴ - پنت‌هاوس فناوری',
    name: 'مهندس سامان عباس‌پور',
    role: 'بنیان‌گذار و مدیر ارشد فناوری (CTO)',
    department: 'مدیریت و معماری سیستم',
    specialty: 'معماری React / Next.js، سه‌بعدی Three.js و سیستم‌های AI',
    exp: '۱۰+ سال سابقه',
    status: 'در حال طراحی معماری سامانه',
    statusColor: 'text-amber-400',
    bio: 'راهبری فنی پروژه‌های کلان سازمانی، پیاده‌سازی زیرساخت‌های فوق‌سریع و توسعه پلتفرم‌های پیچیده تحت وب.',
    skills: ['React / Next.js', 'TypeScript', 'Three.js / WebGL', 'AI Architecture'],
    avatarInitial: 'س',
    icon: Code2,
    positionGrid: { col: 1, row: 1 },
  },
  {
    id: 'mohammadi',
    roomNumber: 'اتاق ۴۰۲',
    floor: 'طبقه ۴ - آزمایشگاه AI',
    name: 'مهندس علی محمدی',
    role: 'مهندس ارشد هوش مصنوعی و RAG',
    department: 'واحد هوش مصنوعی',
    specialty: 'توسعه سیستم‌های RAG، پرامپت‌نویسی و ایجنت‌های خودکار',
    exp: '۶ سال سابقه',
    status: 'در حال آموزش و Fine-Tune مدل LLM',
    statusColor: 'text-emerald-400',
    bio: 'متخصص یادگیری ماشین و پردازش زبان طبیعی، پیاده‌کننده چت‌بات‌های هوشمند سازمانی و اتصال دیتابیس‌های برداری.',
    skills: ['Python', 'LangChain', 'Vector DB', 'PyTorch'],
    avatarInitial: 'ع',
    icon: BrainCircuit,
    positionGrid: { col: 2, row: 1 },
  },
  {
    id: 'kazemi',
    roomNumber: 'اتاق ۳۰۱',
    floor: 'طبقه ۳ - آتلیه دیزاین',
    name: 'مهندس رضا کاظمی',
    role: 'مدیر ارشد دیزاین (Head of UI/UX)',
    department: 'واحد طراحی تجربه کاربری',
    specialty: 'طراحی سیستم‌های دیزاین (Design System) و پروتوتایپ‌های تعاملی',
    exp: '۸ سال سابقه',
    status: 'در حال تست کاربرپذیری فیگما',
    statusColor: 'text-yellow-400',
    bio: 'خلاق سیستم‌های تعاملی مدرن با تمرکز ویژه بر رفتار کاربر ایرانی، روان‌شناسی رنگ و استانداردهای accessibility.',
    skills: ['Figma Design System', 'User Research', 'Prototyping', 'Micro-interactions'],
    avatarInitial: 'ر',
    icon: Layers,
    positionGrid: { col: 1, row: 2 },
  },
  {
    id: 'rezaii',
    roomNumber: 'اتاق ۳۰۲',
    floor: 'طبقه ۳ - دپارتمان رشد',
    name: 'مهندس سارا رضایی',
    role: 'استراتژیست ارشد سئو و مارکتینگ',
    department: 'واحد سئو و بهینه‌سازی',
    specialty: 'سئوی فنی (Technical SEO)، Core Web Vitals و آنالیز رقبا',
    exp: '۷ سال سابقه',
    status: 'آنالیز رتبه‌بندی کلمات کلیدی گوگل',
    statusColor: 'text-amber-300',
    bio: 'متخصص ارتقای رتبه وب‌سایت‌ها در موتورهای جستجو، تحلیل داده‌های ترافیک ارگانیک و تدوین استراتژی محتوای هدفمند.',
    skills: ['Search Console', 'Technical SEO', 'Core Web Vitals', 'Ahrefs'],
    avatarInitial: 'س',
    icon: Search,
    positionGrid: { col: 2, row: 2 },
  },
  {
    id: 'bagheri',
    roomNumber: 'اتاق ۲۰۰',
    floor: 'طبقه ۲ - استودیو فرانت‌اند',
    name: 'مهندس نیما باقری',
    role: 'توسعه‌دهنده ارشد فرانت‌اند',
    department: 'واحد توسعه وب',
    specialty: 'توسعه وب‌اپلیکیشن‌های PWA و انیمیشن‌های تعاملی',
    exp: '۵ سال سابقه',
    status: 'دیباگ انیمیشن‌های Framer Motion',
    statusColor: 'text-amber-400',
    bio: 'پیاده‌سازی رابط‌های کاربری مدرن، بهینه‌سازی سرعت رندرینگ و خلق انیمیشن‌های رویدادمحور روان.',
    skills: ['Tailwind CSS', 'React.js', 'Framer Motion', 'PWA'],
    avatarInitial: 'ن',
    icon: Terminal,
    positionGrid: { col: 1, row: 3 },
  },
  {
    id: 'sharifi',
    roomNumber: 'اتاق ۲۰۱',
    floor: 'طبقه ۲ - اتاق سرور و Cloud',
    name: 'مهندس آرش شریفی',
    role: 'مهندس ارشد DevOps و بک‌اند',
    department: 'واحد زیرساخت و کلود',
    specialty: 'مدیریت سرورهای Docker، امنیت شبکه و API Gateway',
    exp: '۷ سال سابقه',
    status: 'مانیتورینگ سرورها و لودبالنسر',
    statusColor: 'text-cyan-400',
    bio: 'طراحی زیرساخت‌های مقیاس‌پذیر، مدیریت پایگاه‌های داده سنگین و پیاده‌سازی پروتکل‌های امنیت شبکه.',
    skills: ['Node.js', 'Docker', 'PostgreSQL', 'CI/CD Pipelines'],
    avatarInitial: 'آ',
    icon: Cpu,
    positionGrid: { col: 2, row: 3 },
  },
];

export const InteractiveBuildingTeam: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState<string>('samani');

  const activeMember = TEAM_ROOMS.find((r) => r.id === activeRoomId) || TEAM_ROOMS[0];

  return (
    <div className="w-full my-12">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-300 mb-3">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>HEADQUARTERS & INTERACTIVE TEAM MAP</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 uppercase">
          برج فناوری و اعضای تیم <span className="text-amber-400">سیگنالوکس</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-100/70 font-light leading-relaxed">
          روی پنجره هر یک از اتاق‌های برج حرکت کنید (Hover) تا چراغ اتاق روشن شده و مشخصات متخصص مربوطه نمایش داده شود.
        </p>
      </div>

      {/* Main Interactive Building Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left/Center: Skyscraper Building Visual */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[380px] bg-[#07050b] border-2 border-amber-500/40 rounded-t-[32px] rounded-b-[12px] p-5 shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden">
            
            {/* Antenna & Roof Decoration */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-1 h-8 bg-gradient-to-t from-amber-500 to-amber-200 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)]" />
            </div>

            {/* Building Top Signboard */}
            <div className="mt-6 mb-6 text-center border-b border-amber-500/20 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#120e1a] border border-amber-500/30 rounded-full text-[10px] font-mono tracking-widest text-amber-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>SIGNALUX TOWER • HQ</span>
              </div>
            </div>

            {/* Building Windows Grid (3 Floors x 2 Columns) */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {TEAM_ROOMS.map((room) => {
                const isActive = room.id === activeRoomId;
                const IconComp = room.icon;

                return (
                  <motion.div
                    key={room.id}
                    onMouseEnter={() => setActiveRoomId(room.id)}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`relative h-36 rounded-[12px] border transition-all duration-300 cursor-pointer overflow-hidden p-3 flex flex-col justify-between group ${
                      isActive
                        ? 'bg-gradient-to-b from-amber-400/30 via-yellow-400/20 to-amber-500/40 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] scale-[1.02]'
                        : 'bg-[#0f0d16]/80 border-amber-500/20 hover:border-amber-400/60 hover:bg-amber-500/10'
                    }`}
                  >
                    {/* Window Reflection Light Mesh */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                        isActive
                          ? 'opacity-100 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.35)_0%,transparent_70%)]'
                          : 'opacity-0 group-hover:opacity-40 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)]'
                      }`}
                    />

                    {/* Window Frame Lines */}
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-500/20 pointer-events-none" />
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-500/20 pointer-events-none" />

                    {/* Room Header Info */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-[#07050b]/80 px-2 py-0.5 rounded border border-amber-500/30">
                        {room.roomNumber}
                      </span>
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          isActive
                            ? 'bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,1)] animate-pulse'
                            : 'bg-amber-900/60 border border-amber-500/30'
                        }`}
                      />
                    </div>

                    {/* Room Interior Light Silhouette & Icon */}
                    <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(251,191,36,0.8)] scale-110'
                            : 'bg-amber-500/10 text-amber-400/80 group-hover:text-amber-300'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-white mt-1.5 line-clamp-1 group-hover:text-amber-200 transition-colors">
                        {room.name.split(' ')[1] || room.name}
                      </span>
                    </div>

                    {/* Light On Badge Status */}
                    <div className="relative z-10 flex items-center justify-between text-[9px] font-mono">
                      <span
                        className={
                          isActive ? 'text-amber-200 font-bold' : 'text-amber-100/40'
                        }
                      >
                        {isActive ? 'چراغ روشن 💡' : 'خاموش'}
                      </span>
                      <span className="text-amber-300/60">{room.avatarInitial}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Building Ground Entrance */}
            <div className="mt-6 pt-4 border-t border-amber-500/20 text-center">
              <div className="w-20 h-10 mx-auto bg-gradient-to-t from-amber-500/20 to-transparent border-t border-x border-amber-500/30 rounded-t-lg flex items-center justify-center text-[10px] font-mono text-amber-300/80">
                ورودی برج
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Active Team Member Info Card */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMember.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8 bg-gradient-to-b from-[#130f1d] via-[#0d0a12] to-[#0a080d] border border-amber-500/40 rounded-[16px] shadow-[0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden"
            >
              {/* Decorative Ambient Radial Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Room Badge Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/15">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-full">
                    {activeMember.roomNumber}
                  </span>
                  <span className="text-xs font-mono text-amber-200/60">
                    {activeMember.floor}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeMember.status}</span>
                </div>
              </div>

              {/* Member Profile Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <div className="w-full h-full bg-[#0d0a12] rounded-[10px] flex items-center justify-center font-black text-amber-300 font-mono text-2xl">
                    {activeMember.avatarInitial}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
                    {activeMember.name}
                  </h3>
                  <div className="text-xs font-bold text-amber-400 font-mono mb-1">
                    {activeMember.role}
                  </div>
                  <div className="text-[11px] text-amber-100/60 font-light">
                    دپارتمان: <span className="text-amber-200">{activeMember.department}</span> • {activeMember.exp}
                  </div>
                </div>
              </div>

              {/* Bio & Specialty */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#0a080d] border border-amber-500/15 rounded-[10px]">
                  <div className="text-[11px] font-mono text-amber-400/80 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>تخصص اصلی:</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {activeMember.specialty}
                  </p>
                </div>

                <p className="text-xs text-amber-100/80 font-light leading-relaxed">
                  {activeMember.bio}
                </p>
              </div>

              {/* Skills Tech Badges */}
              <div>
                <div className="text-xs font-mono text-amber-400/80 mb-2.5">
                  مهارت‌ها و فناوری‌های کلیدی:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeMember.skills.map((skill, skId) => (
                    <span
                      key={skId}
                      className="px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-xs rounded-[5px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default InteractiveBuildingTeam;
