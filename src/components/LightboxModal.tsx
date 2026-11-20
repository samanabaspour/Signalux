import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioProject, CertificateItem } from '../types';
import { X, ExternalLink, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: PortfolioProject | null;
  certificate?: CertificateItem | null;
  onOpenConsultation: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  project,
  certificate,
  onOpenConsultation,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card p-6 sm:p-8 max-w-2xl w-full border border-amber-500/30 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto rounded-[5px] bg-[#0c0a10]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-2.5 bg-[#0B0B0F] border border-amber-500/20 text-white hover:border-amber-400 hover:text-amber-400 transition-all cursor-pointer z-20 rounded-[5px]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Project View */}
          {project && (
            <div>
              <span className="px-3 py-1 bg-[#0B0B0F] border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest inline-block mb-3 font-semibold rounded-[5px]">
                {project.categoryLabel} // {project.year}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 uppercase">
                {project.title}
              </h2>
              <p className="text-xs text-white/50 mb-6 font-mono uppercase">کارفرما: {project.client}</p>

              <div className="relative h-64 sm:h-80 overflow-hidden mb-6 border border-white/10 rounded-[5px]">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-[#0B0B0F] border border-white/10 mb-6 rounded-[5px]">
                {project.impactMetrics.map((m, idx) => (
                  <div key={idx} className="text-center">
                    <span className="text-xs text-white/50 uppercase tracking-wider block">{m.label}</span>
                    <span className="text-lg font-bold font-mono text-amber-400">{m.value}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">توضیحات و فرآیند اجرا:</h3>
              <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
                {project.fullDescription}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-3 py-1 bg-[#0B0B0F] border border-white/10 text-xs text-white/50 font-mono uppercase rounded-[5px]">
                    {tag.replace(/^#+/, '')}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg rounded-[5px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>درخواست پروژه مشابه برای برند شما</span>
              </button>
            </div>
          )}

          {/* Certificate View */}
          {certificate && (
            <div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#0B0B0F] border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest inline-flex mb-3 font-semibold rounded-[5px]">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>گواهی‌نامه رسمی تاییدشده</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1 uppercase">
                {certificate.title}
              </h2>
              <p className="text-xs text-amber-200/50 font-mono mb-6 uppercase">{certificate.issuer} - {certificate.issueDate}</p>

              <div className="relative h-64 sm:h-80 overflow-hidden mb-6 border border-amber-500/20 rounded-[5px]">
                <img src={certificate.image} alt={certificate.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-4 bg-[#0B0B0F] border border-amber-500/20 text-xs font-mono text-amber-400 mb-6 flex items-center justify-between uppercase rounded-[5px]">
                <span className="text-white/50">شناسه اعتبارنامه:</span>
                <span className="font-bold">{certificate.credentialId}</span>
              </div>

              <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
                {certificate.description}
              </p>

              <div className="space-y-2 mb-6">
                <span className="text-xs font-bold text-white block mb-2 uppercase tracking-wider">مهارت‌های تاییدشده:</span>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#0B0B0F] border border-amber-500/20 text-xs text-white/80 font-mono flex items-center gap-1.5 uppercase rounded-[5px]">
                      <CheckCircle2 className="w-3 h-3 text-amber-400" />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#0B0B0F] border border-amber-500/30 text-amber-200 hover:text-white font-bold text-xs uppercase tracking-widest cursor-pointer hover:border-amber-400 rounded-[5px] transition-colors"
              >
                بستن پنجره
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

