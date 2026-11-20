import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Headphones,
  Video,
  Plus,
  Trash2,
  Edit,
  Save,
  Play,
  Pause,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  UploadCloud,
  Search,
  RefreshCw,
  Copy,
  ExternalLink,
  Volume2,
  Film,
  Tag,
  AlertCircle
} from 'lucide-react';
import { PodcastEpisode, VideoTestimonial } from '../../types';
import {
  fetchPodcasts,
  savePodcasts,
  fetchVideoTestimonials,
  saveVideoTestimonials
} from '../../services/apiClient';

export const MediaTestimonialsManager: React.FC = () => {
  const [mediaTab, setMediaTab] = useState<'podcasts' | 'videos'>('podcasts');
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [videos, setVideos] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio preview state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Video preview modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Modal edit states
  const [editingPodcast, setEditingPodcast] = useState<Partial<PodcastEpisode> | null>(null);
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);

  const [editingVideo, setEditingVideo] = useState<Partial<VideoTestimonial> | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    loadData();
    const audio = new Audio();
    audio.onended = () => setPlayingAudioId(null);
    setAudioElement(audio);

    return () => {
      audio.pause();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [podData, vidData] = await Promise.all([
        fetchPodcasts(),
        fetchVideoTestimonials()
      ]);
      setPodcasts(podData);
      setVideos(vidData);
    } catch (e) {
      console.error('Error fetching media testimonials', e);
      showFeedback('خطا در دریافت لیست پادکست‌ها و ویدئوها', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  const handleToggleAudio = (pod: PodcastEpisode) => {
    if (!audioElement) return;

    if (playingAudioId === pod.id) {
      audioElement.pause();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(pod.id);
      audioElement.src = pod.audioUrl;
      audioElement.play().catch(e => {
        console.warn('Audio play failed', e);
        showFeedback('پخش فایل صوتی ناموفق بود. آدرس فایل را بررسی کنید.', 'error');
        setPlayingAudioId(null);
      });
    }
  };

  // --- PODCAST ACTIONS ---
  const handleOpenNewPodcast = () => {
    setEditingPodcast({
      id: 'pod-' + Date.now(),
      clientName: '',
      clientRole: '',
      company: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      title: '',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      duration: '۰۳:۳۰',
      quote: '',
      tags: ['توسعه وب', 'سئو'],
      rating: 5,
      isPublished: true,
      sortOrder: podcasts.length
    });
    setIsPodcastModalOpen(true);
  };

  const handleEditPodcast = (pod: PodcastEpisode) => {
    setEditingPodcast({ ...pod });
    setIsPodcastModalOpen(true);
  };

  const handleSavePodcastModal = async () => {
    if (!editingPodcast || !editingPodcast.clientName || !editingPodcast.title || !editingPodcast.audioUrl) {
      showFeedback('لطفاً نام مشتری، عنوان و لینک فایل صوتی را تکمیل نمایید.', 'error');
      return;
    }

    let updated: PodcastEpisode[];
    const exists = podcasts.some(p => p.id === editingPodcast.id);
    if (exists) {
      updated = podcasts.map(p => (p.id === editingPodcast.id ? (editingPodcast as PodcastEpisode) : p));
    } else {
      updated = [editingPodcast as PodcastEpisode, ...podcasts];
    }

    setPodcasts(updated);
    setIsPodcastModalOpen(false);
    setEditingPodcast(null);

    // Auto-save to backend
    setSaving(true);
    try {
      await savePodcasts(updated);
      showFeedback('پادکست صوتی با موفقیت در دیتابیس ذخیره شد.', 'success');
    } catch (e) {
      showFeedback('خطا در ذخیره خودکار پادکست‌ها', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePodcast = async (id: string) => {
    if (window.confirm('آیا از حذف این پادکست رضایت مشتری اطمینان دارید؟')) {
      const updated = podcasts.filter(p => p.id !== id);
      setPodcasts(updated);
      if (playingAudioId === id && audioElement) {
        audioElement.pause();
        setPlayingAudioId(null);
      }

      setSaving(true);
      try {
        await savePodcasts(updated);
        showFeedback('پادکست حذف گردید.', 'success');
      } catch (e) {
        showFeedback('خطا در همگام‌سازی دیتابیس', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleTogglePodcastPublish = async (pod: PodcastEpisode) => {
    const updated = podcasts.map(p => (p.id === pod.id ? { ...p, isPublished: !p.isPublished } : p));
    setPodcasts(updated);
    try {
      await savePodcasts(updated);
      showFeedback(`وضعیت انتشار پادکست به ${!pod.isPublished ? 'منتشر شده' : 'پیش‌نویس'} تغییر یافت.`, 'success');
    } catch (e) {
      showFeedback('خطا در تغییر وضعیت انتشار', 'error');
    }
  };

  // --- VIDEO ACTIONS ---
  const handleOpenNewVideo = () => {
    setEditingVideo({
      id: 'vid-' + Date.now(),
      clientName: '',
      clientRole: '',
      company: '',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      title: '',
      duration: '۰۲:۱۵',
      quote: '',
      projectCategory: 'طراحی وب و سئو',
      rating: 5,
      isPublished: true,
      sortOrder: videos.length
    });
    setIsVideoModalOpen(true);
  };

  const handleEditVideo = (vid: VideoTestimonial) => {
    setEditingVideo({ ...vid });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideoModal = async () => {
    if (!editingVideo || !editingVideo.clientName || !editingVideo.title || !editingVideo.videoUrl) {
      showFeedback('لطفاً نام مشتری، عنوان و لینک فایل ویدیو را تکمیل نمایید.', 'error');
      return;
    }

    let updated: VideoTestimonial[];
    const exists = videos.some(v => v.id === editingVideo.id);
    if (exists) {
      updated = videos.map(v => (v.id === editingVideo.id ? (editingVideo as VideoTestimonial) : v));
    } else {
      updated = [editingVideo as VideoTestimonial, ...videos];
    }

    setVideos(updated);
    setIsVideoModalOpen(false);
    setEditingVideo(null);

    // Auto-save to backend
    setSaving(true);
    try {
      await saveVideoTestimonials(updated);
      showFeedback('ویدئوی رضایت مشتری با موفقیت ذخیره شد.', 'success');
    } catch (e) {
      showFeedback('خطا در ذخیره خودکار ویدیوها', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm('آیا از حذف این ویدئو رضایت مشتری اطمینان دارید؟')) {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);

      setSaving(true);
      try {
        await saveVideoTestimonials(updated);
        showFeedback('ویدئو حذف گردید.', 'success');
      } catch (e) {
        showFeedback('خطا در همگام‌سازی دیتابیس', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleToggleVideoPublish = async (vid: VideoTestimonial) => {
    const updated = videos.map(v => (v.id === vid.id ? { ...v, isPublished: !v.isPublished } : v));
    setVideos(updated);
    try {
      await saveVideoTestimonials(updated);
      showFeedback(`وضعیت انتشار ویدیو به ${!vid.isPublished ? 'منتشر شده' : 'پیش‌نویس'} تغییر یافت.`, 'success');
    } catch (e) {
      showFeedback('خطا در تغییر وضعیت انتشار', 'error');
    }
  };

  // Filtered lists
  const filteredPodcasts = podcasts.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.company?.toLowerCase().includes(q) ||
      p.quote.toLowerCase().includes(q)
    );
  });

  const filteredVideos = videos.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.title.toLowerCase().includes(q) ||
      v.clientName.toLowerCase().includes(q) ||
      v.company?.toLowerCase().includes(q) ||
      v.quote.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-[5px] shadow-2xl border text-sm font-bold flex items-center gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
            }`}
          >
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{feedbackMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#121017] p-5 border border-amber-500/20 rounded-[5px]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white uppercase">مدیریت پادکست‌ها و ویدئوهای رضایت مشتریان</h2>
          </div>
          <p className="text-xs text-amber-200/60 font-light">
            در این بخش می‌توانید اپیزودهای صوتی پادکست و مصاحبه‌های تصویری کارفرمایان را اضافه، ویرایش و مستقیماً در دیتابیس مدیریت کنید.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 bg-[#070609] border border-amber-500/20 text-amber-300 hover:text-white rounded-[5px] cursor-pointer transition-all"
            title="بروزرسانی داده‌ها"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {mediaTab === 'podcasts' ? (
            <button
              onClick={handleOpenNewPodcast}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs rounded-[5px] flex items-center gap-2 hover:from-amber-400 hover:to-yellow-400 shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن پادکست صوتی جدید</span>
            </button>
          ) : (
            <button
              onClick={handleOpenNewVideo}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs rounded-[5px] flex items-center gap-2 hover:from-amber-400 hover:to-yellow-400 shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مصاحبه ویدئویی جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tab Navigation & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-[#121017] border border-amber-500/20 rounded-[5px] w-full sm:w-auto">
          <button
            onClick={() => setMediaTab('podcasts')}
            className={`px-5 py-2 text-xs font-bold uppercase rounded-[5px] flex items-center gap-2 transition-all cursor-pointer ${
              mediaTab === 'podcasts'
                ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>پادکست‌های صوتی ({podcasts.length})</span>
          </button>
          <button
            onClick={() => setMediaTab('videos')}
            className={`px-5 py-2 text-xs font-bold uppercase rounded-[5px] flex items-center gap-2 transition-all cursor-pointer ${
              mediaTab === 'videos'
                ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>ویدئوهای رضایت ({videos.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در محتواها..."
            className="w-full bg-[#121017] border border-amber-500/30 rounded-[5px] px-3.5 py-2 text-xs text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-400 pr-9"
          />
          <Search className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-[#121017] border border-amber-500/20 rounded-[5px]">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-amber-300">در حال بارگزاری رسانه‌ها از سرور...</p>
        </div>
      ) : mediaTab === 'podcasts' ? (
        /* PODCASTS LIST */
        <div className="space-y-4">
          {filteredPodcasts.length === 0 ? (
            <div className="p-12 text-center bg-[#121017] border border-amber-500/20 rounded-[5px] space-y-4">
              <Headphones className="w-12 h-12 text-amber-400/40 mx-auto" />
              <p className="text-sm text-amber-200/60">هیچ پادکست صوتی ثبت نشده است.</p>
              <button
                onClick={handleOpenNewPodcast}
                className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-[5px] hover:bg-amber-500/30 cursor-pointer"
              >
                اولین پادکست را اضافه کنید
              </button>
            </div>
          ) : (
            filteredPodcasts.map((pod) => {
              const isPlaying = playingAudioId === pod.id;
              return (
                <div
                  key={pod.id}
                  className="p-5 bg-[#121017] border border-amber-500/20 rounded-[5px] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-amber-400/40 transition-all"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={pod.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={pod.clientName}
                      className="w-14 h-14 rounded-[5px] object-cover border border-amber-500/30 shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{pod.clientName}</span>
                        <span className="text-xs font-mono text-amber-400">• {pod.clientRole}</span>
                        {pod.company && <span className="text-xs font-mono text-gray-400">({pod.company})</span>}
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono rounded-[3px] border ${
                            pod.isPublished !== false
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          {pod.isPublished !== false ? 'منتشر شده' : 'پیش‌نویس'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-amber-200">{pod.title}</h4>
                      <p className="text-xs text-amber-100/70 line-clamp-2 max-w-2xl font-light">"{pod.quote}"</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-mono text-amber-300/80 bg-[#070609] px-2 py-0.5 border border-amber-500/15 rounded-[3px]">
                          مدت زمان: {pod.duration}
                        </span>
                        {pod.tags?.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-amber-200/50 bg-[#070609] px-1.5 py-0.5 border border-amber-500/10 rounded-[3px]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Player */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-amber-500/10 pt-3 md:pt-0">
                    <button
                      onClick={() => handleToggleAudio(pod)}
                      className={`px-3 py-2 text-xs font-bold rounded-[5px] flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                          : 'bg-[#070609] border border-amber-500/30 text-amber-300 hover:border-amber-400'
                      }`}
                      title={isPlaying ? 'توقف پخش' : 'تست پخش زنده'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-amber-300" />}
                      <span>{isPlaying ? 'در حال پخش' : 'پخش'}</span>
                    </button>

                    <button
                      onClick={() => handleTogglePodcastPublish(pod)}
                      className="p-2 bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-200 rounded-[5px] cursor-pointer"
                      title={pod.isPublished !== false ? 'تغییر به پیش‌نویس' : 'انتشار پادکست'}
                    >
                      {pod.isPublished !== false ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    </button>

                    <button
                      onClick={() => handleEditPodcast(pod)}
                      className="p-2 bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-300 rounded-[5px] cursor-pointer"
                      title="ویرایش پادکست"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeletePodcast(pod.id)}
                      className="p-2 bg-[#070609] border border-rose-500/20 hover:border-rose-400 text-rose-400 rounded-[5px] cursor-pointer"
                      title="حذف پادکست"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIDEOS LIST */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVideos.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#121017] border border-amber-500/20 rounded-[5px] space-y-4">
              <Video className="w-12 h-12 text-amber-400/40 mx-auto" />
              <p className="text-sm text-amber-200/60">هیچ مصاحبه ویدئویی ثبت نشده است.</p>
              <button
                onClick={handleOpenNewVideo}
                className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-[5px] hover:bg-amber-500/30 cursor-pointer"
              >
                اولین ویدئوی رضایت را اضافه کنید
              </button>
            </div>
          ) : (
            filteredVideos.map((vid) => (
              <div
                key={vid.id}
                className="p-5 bg-[#121017] border border-amber-500/20 rounded-[5px] flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative h-48 bg-[#070609] rounded-[5px] overflow-hidden group">
                    <img
                      src={vid.thumbnail || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121017] via-transparent to-transparent" />
                    <button
                      onClick={() => setPreviewVideoUrl(vid.videoUrl)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                        <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#070609]/90 border border-amber-500/30 text-[10px] font-mono text-amber-300 rounded-[3px]">
                      مدت: {vid.duration}
                    </span>
                    {vid.projectCategory && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-[10px] font-mono text-amber-200 rounded-[3px] backdrop-blur-sm">
                        {vid.projectCategory}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{vid.clientName}</span>
                      <span className="text-[11px] font-mono text-amber-400/80 mr-2">• {vid.clientRole}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono rounded-[3px] border ${
                        vid.isPublished !== false
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {vid.isPublished !== false ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-amber-200">{vid.title}</h4>
                  <p className="text-xs text-amber-100/70 font-light line-clamp-2">"{vid.quote}"</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-amber-500/15">
                  <span className="text-[11px] font-mono text-gray-400">{vid.company}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewVideoUrl(vid.videoUrl)}
                      className="p-1.5 bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-300 rounded-[4px] cursor-pointer"
                      title="پیش‌نمایش ویدئو"
                    >
                      <Film className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleVideoPublish(vid)}
                      className="p-1.5 bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-200 rounded-[4px] cursor-pointer"
                      title={vid.isPublished !== false ? 'تغییر به پیش‌نویس' : 'انتشار ویدئو'}
                    >
                      {vid.isPublished !== false ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                    </button>
                    <button
                      onClick={() => handleEditVideo(vid)}
                      className="p-1.5 bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-300 rounded-[4px] cursor-pointer"
                      title="ویرایش ویدئو"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(vid.id)}
                      className="p-1.5 bg-[#070609] border border-rose-500/20 hover:border-rose-400 text-rose-400 rounded-[4px] cursor-pointer"
                      title="حذف ویدئو"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121017] border border-amber-500/40 rounded-[5px] max-w-3xl w-full p-4 overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">پیش‌نمایش ویدئوی رضایت مشتری</span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video bg-black rounded-[5px] overflow-hidden">
              <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* PODCAST EDIT / ADD MODAL */}
      {isPodcastModalOpen && editingPodcast && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121017] border border-amber-500/40 rounded-[5px] max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {podcasts.some(p => p.id === editingPodcast.id) ? 'ویرایش پادکست صوتی' : 'افزودن پادکست صوتی جدید'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPodcastModalOpen(false);
                  setEditingPodcast(null);
                }}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-amber-200/80 mb-1">نام کارفرما / مصاحبه‌شونده *</label>
                <input
                  type="text"
                  value={editingPodcast.clientName || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, clientName: e.target.value })}
                  placeholder="دکتر علیرضا کاظمی"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">سمت یا نقش *</label>
                <input
                  type="text"
                  value={editingPodcast.clientRole || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, clientRole: e.target.value })}
                  placeholder="مدیرعامل پلتفرم پزشکی مدتک"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">نام شرکت یا برند</label>
                <input
                  type="text"
                  value={editingPodcast.company || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, company: e.target.value })}
                  placeholder="مجموعه تخصصی مدتک"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">مدت زمان اپیزود</label>
                <input
                  type="text"
                  value={editingPodcast.duration || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, duration: e.target.value })}
                  placeholder="۰۴:۲۵"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">عنوان اپیزود پادکست *</label>
                <input
                  type="text"
                  value={editingPodcast.title || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, title: e.target.value })}
                  placeholder="پادکست رشد ۱۰ برابری نوبت‌دهی آنلاین با معماری اختصاصی سیگنالوکس"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">آدرس مستقیم فایل صوتی (Audio URL / MP3) *</label>
                <input
                  type="text"
                  value={editingPodcast.audioUrl || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, audioUrl: e.target.value })}
                  placeholder="https://yourdomain.com/uploads/podcasts/episode-1.mp3"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">تصویر آواتار یا عکس مصاحبه‌شونده (Avatar URL)</label>
                <input
                  type="text"
                  value={editingPodcast.avatar || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">متن یا چکیده صحبت کارفرما (نقل قول)</label>
                <textarea
                  rows={3}
                  value={editingPodcast.quote || ''}
                  onChange={(e) => setEditingPodcast({ ...editingPodcast, quote: e.target.value })}
                  placeholder="همکاری با سیگنالوکس نقطه عطف کسب‌وکار ما بود..."
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">تگ‌ها و کلیدواژه‌ها (جدا شده با کاما)</label>
                <input
                  type="text"
                  value={editingPodcast.tags ? editingPodcast.tags.join(', ') : ''}
                  onChange={(e) =>
                    setEditingPodcast({
                      ...editingPodcast,
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })
                  }
                  placeholder="سئو, طراحی سایت, React"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 text-xs text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPodcast.isPublished !== false}
                    onChange={(e) => setEditingPodcast({ ...editingPodcast, isPublished: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <span>انتشار عمومی در وب‌سایت</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-500/20">
              <button
                onClick={() => {
                  setIsPodcastModalOpen(false);
                  setEditingPodcast(null);
                }}
                className="px-4 py-2 bg-[#070609] border border-amber-500/20 text-gray-300 text-xs font-bold rounded-[5px] hover:text-white cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={handleSavePodcastModal}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs rounded-[5px] flex items-center gap-2 hover:from-amber-400 hover:to-yellow-400 shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'در حال ذخیره...' : 'ذخیره پادکست'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO EDIT / ADD MODAL */}
      {isVideoModalOpen && editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121017] border border-amber-500/40 rounded-[5px] max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {videos.some(v => v.id === editingVideo.id) ? 'ویرایش مصاحبه ویدئویی' : 'افزودن مصاحبه ویدئویی جدید'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setEditingVideo(null);
                }}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-amber-200/80 mb-1">نام کارفرما / نماینده برند *</label>
                <input
                  type="text"
                  value={editingVideo.clientName || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, clientName: e.target.value })}
                  placeholder="امیرحسین رضایی"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">سمت یا نقش *</label>
                <input
                  type="text"
                  value={editingVideo.clientRole || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, clientRole: e.target.value })}
                  placeholder="مدیر ارشد محصول"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">نام شرکت یا برند</label>
                <input
                  type="text"
                  value={editingVideo.company || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, company: e.target.value })}
                  placeholder="هولدینگ لجستیک پارس"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">دسته‌بندی پروژه</label>
                <input
                  type="text"
                  value={editingVideo.projectCategory || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, projectCategory: e.target.value })}
                  placeholder="طراحی وب و پنل اختصاصی"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">عنوان ویدئوی مصاحبه *</label>
                <input
                  type="text"
                  value={editingVideo.title || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="مصاحبه ویدئویی: ساخت پنل مدیریت و Dashboards قدرتمند"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">آدرس مستقیم فایل ویدئو (MP4 URL / CDN) *</label>
                <input
                  type="text"
                  value={editingVideo.videoUrl || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                  placeholder="https://yourdomain.com/uploads/videos/testimonial-1.mp4"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">تصویر بندانگشتی پوستر (Thumbnail URL)</label>
                <input
                  type="text"
                  value={editingVideo.thumbnail || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-200/80 mb-1">مدت زمان ویدئو</label>
                <input
                  type="text"
                  value={editingVideo.duration || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                  placeholder="۰۲:۴۵"
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 text-xs text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVideo.isPublished !== false}
                    onChange={(e) => setEditingVideo({ ...editingVideo, isPublished: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <span>انتشار عمومی در وب‌سایت</span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-200/80 mb-1">نقل قول کوتاه برجسته</label>
                <textarea
                  rows={2}
                  value={editingVideo.quote || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, quote: e.target.value })}
                  placeholder="طراحی رابط کاربری و عملکرد فوق‌العاده نرم‌افزار، رضایت ۱۰۰ درصدی ما را جلب کرد."
                  className="w-full bg-[#070609] border border-amber-500/30 rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-500/20">
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setEditingVideo(null);
                }}
                className="px-4 py-2 bg-[#070609] border border-amber-500/20 text-gray-300 text-xs font-bold rounded-[5px] hover:text-white cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveVideoModal}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs rounded-[5px] flex items-center gap-2 hover:from-amber-400 hover:to-yellow-400 shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'در حال ذخیره...' : 'ذخیره ویدئو'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
