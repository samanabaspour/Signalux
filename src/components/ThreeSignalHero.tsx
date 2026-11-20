import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, Sparkles, Radio, ShieldCheck, Zap, PlayCircle } from 'lucide-react';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const ThreeSignalHero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for subtle mouse tracking
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Inner Glowing Ambient Lights
    const cyanLight = new THREE.PointLight(0xd4af37, 3.5, 25);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xc5a059, 3.5, 25);
    purpleLight.position.set(-5, -5, 5);
    scene.add(purpleLight);

    // Create custom soft glowing texture for luminous particles
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(255, 225, 140, 0.9)');
        gradient.addColorStop(0.6, 'rgba(212, 175, 55, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createGlowTexture();

    const colorsList = [
      new THREE.Color('#D4AF37'),
      new THREE.Color('#F5E0B3'),
      new THREE.Color('#C5A059'),
      new THREE.Color('#FFE8A3'),
      new THREE.Color('#FFFFFF')
    ];

    // 1. Far Luminous Particles (ذرات دور - کوچکتر)
    const farCount = window.innerWidth < 768 ? 150 : 300;
    const farGeo = new THREE.BufferGeometry();
    const farPos = new Float32Array(farCount * 3);
    const farCols = new Float32Array(farCount * 3);

    for (let i = 0; i < farCount; i++) {
      farPos[i * 3] = (Math.random() - 0.5) * 40;
      farPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      farPos[i * 3 + 2] = (Math.random() - 0.5) * 25 - 10; // Z deep in background

      const col = colorsList[Math.floor(Math.random() * colorsList.length)];
      farCols[i * 3] = col.r;
      farCols[i * 3 + 1] = col.g;
      farCols[i * 3 + 2] = col.b;
    }

    farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
    farGeo.setAttribute('color', new THREE.BufferAttribute(farCols, 3));

    const farMat = new THREE.PointsMaterial({
      size: 0.32,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const farParticles = new THREE.Points(farGeo, farMat);
    scene.add(farParticles);

    // 2. Near Luminous Particles (ذرات نزدیک - بزرگتر، درخشان‌تر و شناور در جلوی صحنه)
    const nearCount = window.innerWidth < 768 ? 25 : 60;
    const nearGeo = new THREE.BufferGeometry();
    const nearPos = new Float32Array(nearCount * 3);
    const nearCols = new Float32Array(nearCount * 3);
    const nearInitialZ = new Float32Array(nearCount);

    for (let i = 0; i < nearCount; i++) {
      nearPos[i * 3] = (Math.random() - 0.5) * 28;
      nearPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      const initialZ = (Math.random() - 0.5) * 12 + 4; // Z close to camera
      nearPos[i * 3 + 2] = initialZ;
      nearInitialZ[i] = initialZ;

      const col = colorsList[Math.floor(Math.random() * colorsList.length)];
      nearCols[i * 3] = col.r;
      nearCols[i * 3 + 1] = col.g;
      nearCols[i * 3 + 2] = col.b;
    }

    nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3));
    nearGeo.setAttribute('color', new THREE.BufferAttribute(nearCols, 3));

    const nearMat = new THREE.PointsMaterial({
      size: 0.75,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const nearParticles = new THREE.Points(nearGeo, nearMat);
    scene.add(nearParticles);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mouseX = (e.clientX - halfX) * 0.001;
      mouseY = (e.clientY - halfY) * 0.001;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Far Particles slow subtle drift
      farParticles.rotation.y = elapsedTime * 0.02 + targetX * 0.5;
      farParticles.rotation.x = elapsedTime * 0.01 + targetY * 0.5;

      // Near Particles floating bobbing & depth float
      nearParticles.rotation.y = -elapsedTime * 0.04 + targetX * 1.2;
      nearParticles.rotation.x = elapsedTime * 0.03 + targetY * 1.2;

      // Animate near particle positions gently in Z and Y for realistic drifting embers
      const positions = nearGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < nearCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.003;
        positions[i * 3 + 2] = nearInitialZ[i] + Math.cos(elapsedTime * 0.8 + i) * 0.8;
      }
      nearGeo.attributes.position.needsUpdate = true;

      mainGroup.rotation.y = targetX * 2;
      mainGroup.rotation.x = targetY * 2;

      // Floating bobbing motion
      mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      farGeo.dispose();
      farMat.dispose();
      nearGeo.dispose();
      nearMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#070609]">
      {/* Three.js 3D Interactive Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-90"
        style={{ filter: 'drop-shadow(0 0 45px rgba(212, 175, 55, 0.25))' }}
      />

      {/* Atmospheric Ambient Light Globs */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[450px] h-[450px] bg-[#F5E0B3]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Content Box with Scroll Transformation */}
      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
      >
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-10 max-w-5xl uppercase"
        >
          آژانس دیجیتال مارکتینگ <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500">
            SIGNALUX
          </span>
        </motion.h1>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 rounded-[5px] bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group shadow-[0_0_35px_rgba(212,175,55,0.4)]"
          >
            <Sparkles className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>شروع مشاوره و سفارش پروژه</span>
            <ArrowLeft className="w-4 h-4 text-slate-950 group-hover:-translate-x-1 transition-transform" />
          </button>

          <a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-[5px] bg-[#121017]/80 hover:bg-[#1A1722] border border-amber-500/25 hover:border-amber-400/60 text-amber-100 font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <span>مشاهده نمونه‌کارها</span>
          </a>
        </motion.div>

        {/* Floating Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl"
        >
          <div className="glass-card p-4 rounded-[5px] flex items-center gap-3 text-right border border-amber-500/20 hover:border-amber-400/50 transition-colors">
            <div className="w-10 h-10 rounded-[5px] bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">سرعت فوق‌العاده بالا</div>
              <div className="text-[11px] text-amber-100/60 mt-0.5">معماری فرانت‌اند بدون نویز</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-[5px] flex items-center gap-3 text-right border border-amber-500/20 hover:border-amber-400/50 transition-colors">
            <div className="w-10 h-10 rounded-[5px] bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">گارانتی و تضمین کیفیت</div>
              <div className="text-[11px] text-amber-100/60 mt-0.5">پشتیبانی ۱۲ ماهه کتبی رسمی</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-[5px] flex items-center gap-3 text-right border border-amber-500/20 hover:border-amber-400/50 transition-colors">
            <div className="w-10 h-10 rounded-[5px] bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Radio className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">تحلیل داده‌محور سئو</div>
              <div className="text-[11px] text-amber-100/60 mt-0.5">افزایش نرخ تبدیل ارگانیک</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

