import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Headphones,
  Video,
  Play,
  Pause,
  Star,
  Quote,
  Home,
  RefreshCw
} from 'lucide-react';
import {
  PodcastEpisode,
  VideoTestimonial
} from '../types';
import {
  fetchPodcasts,
  fetchVideoTestimonials
} from '../services/apiClient';

interface TestimonialsMediaPageProps {
  onBackToHome: () => void;
  onOpenConsultation: () => void;
}

export const TestimonialsMediaPage: React.FC<TestimonialsMediaPageProps> = ({
  onBackToHome,
  onOpenConsultation
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [videos, setVideos] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadMediaData();
  }, []);

  const loadMediaData = async () => {
    setLoading(true);
    try {
      const [podData, vidData] = await Promise.all([
        fetchPodcasts(),
        fetchVideoTestimonials()
      ]);
      setPodcasts(podData.filter(p => p.isPublished !== false));
      setVideos(vidData.filter(v => v.isPublished !== false));
    } catch (e) {
      console.error('Error loading media testimonials', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAudio = (pod: PodcastEpisode) => {
    if (playingAudioId === pod.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(pod.id);
      if (audioRef.current) {
        audioRef.current.src = pod.audioUrl;
        audioRef.current.play().catch(e => console.warn('Audio play prevented', e));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070609] text-gray-100 pt-24 pb-20 relative overflow-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} onEnded={() => setPlayingAudioId(null)} />

      {/* Glow Background */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/15">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>صفحه اصلی</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">نظرات، پادکست‌ها و ویدئوها</span>
          </div>

        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>صدای مشتریان واقعی و مدیران موفق</span>
          </span>

          <h1 className="text-[24px] font-black text-white tracking-tight leading-tight uppercase">
            تجربه همکاری با{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              آژانس دیجیتال سیگنالوکس
            </span>
          </h1>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm font-mono text-amber-300">در حال بارگزاری پادکست‌ها و ویدئوهای رضایت کارفرمایان...</p>
          </div>
        ) : (
          <>
            {/* Audio Podcasts Section */}
            {podcasts.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <Headphones className="w-6 h-6 text-amber-400" />
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">پادکست‌های اختصاصی رضایت مشتریان</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {podcasts.map((pod) => {
                    const isPlaying = playingAudioId === pod.id;
                    return (
                      <div
                        key={pod.id}
                        className="glow-border-card p-6 sm:p-8 border border-amber-500/20 rounded-[5px] bg-[#121017] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-amber-400/40 transition-all"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <img
                            src={pod.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                            alt={pod.clientName}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-[5px] object-cover border border-amber-500/30 shrink-0"
                          />
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-white">{pod.clientName}</span>
                              <span className="text-xs font-mono text-amber-400">• {pod.clientRole}</span>
                              {pod.company && (
                                <span className="text-xs font-mono text-gray-400">({pod.company})</span>
                              )}
                              {pod.rating && (
                                <div className="flex items-center gap-0.5 text-amber-400 mr-2">
                                  {Array.from({ length: pod.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                                  ))}
                                </div>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-amber-200 uppercase">{pod.title}</h3>
                          </div>
                        </div>

                        {/* Audio Controls */}
                        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-amber-500/15 pt-4 md:pt-0">
                          <span className="text-xs font-mono text-amber-300/80">{pod.duration}</span>
                          <button
                            onClick={() => handleToggleAudio(pod)}
                            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all flex items-center gap-2 cursor-pointer ${
                              isPlaying
                                ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                            <span>{isPlaying ? 'توقف پخش' : 'پخش پادکست'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Video Testimonials Section */}
            {videos.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6 text-amber-400" />
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">ویدئوهای بازخورد و مصاحبه تصویری</h2>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {videos.map((vid) => (
                    <div key={vid.id} className="glow-border-card border border-amber-500/20 rounded-[5px] bg-[#121017] overflow-hidden flex flex-col justify-between hover:border-amber-400/40 transition-all">
                      <div className="relative h-60 bg-[#070609] overflow-hidden">
                        {playingVideoId === vid.id ? (
                          <video
                            src={vid.videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <img
                              src={vid.thumbnail || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'}
                              alt={vid.title}
                              className="w-full h-full object-cover opacity-70 hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121017] via-transparent to-transparent" />
                            <button
                              onClick={() => setPlayingVideoId(vid.id)}
                              className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                            >
                              <div className="w-16 h-16 rounded-full bg-amber-500/90 group-hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all shadow-[0_0_30px_rgba(212,175,55,0.5)] group-hover:scale-110">
                                <Play className="w-7 h-7 fill-slate-950 translate-x-0.5" />
                              </div>
                            </button>
                            <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#070609]/90 border border-amber-500/20 text-[10px] font-mono text-amber-300 rounded-[5px]">
                              مدت ویدئو: {vid.duration}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white">{vid.clientName}</span>
                            <span className="text-[11px] font-mono text-amber-400/80 mr-2">• {vid.clientRole}</span>
                          </div>
                          <span className="text-[11px] font-mono text-amber-400">{vid.company}</span>
                        </div>
                        <h3 className="text-sm font-bold text-amber-200 uppercase">{vid.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA Banner */}
        <div className="glow-border-card p-8 sm:p-12 border border-amber-500/40 rounded-[5px] bg-gradient-to-r from-[#121017] via-[#1A1622] to-[#121017] text-center max-w-4xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.25)]">
          <Quote className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mb-8">شما هم داستان موفقیت بعدی سیگنالوکس باشید</h2>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.4)] inline-flex items-center gap-2"
          >
            <span>شروع مشاوره رایگان و ثبت سفارش</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};
