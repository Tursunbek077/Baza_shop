import React, { useState, useEffect, useRef } from 'react';
import { Crown, Sparkles, X, Volume2, VolumeX } from 'lucide-react';

/**
 * Netflix-style Cinematic Intro Splash for Baza_Shop
 * Features cinematic forward camera zoom, anamorphic light beam sweep,
 * ambient glow, and optional Web Audio API synthesized cinematic chord.
 */
export default function CinematicIntro({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let audioInstance = null;

    // Helper: Delicate Celesta & Harp Web Audio fallback
    const playSynthesizedHarpShimmer = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        // Delicate, ethereal luxury chord: C#5, E5, G#5, C#6 (Major 7th / Add 9th warmth)
        const notes = [554.37, 659.25, 830.61, 1108.73];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const delay = idx * 0.08; // Staggered gentle harp arpeggio
          gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + delay + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 2.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 2.3);
        });
      } catch {}
    };

    // 1. Play "Chocolate" by Lukrembo (warm, stylish, feminine vlog beats)
    try {
      audioInstance = new Audio('/intro-chocolate.mp3');
      audioInstance.volume = 0.6;
      audioRef.current = audioInstance;

      const playPromise = audioInstance.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts initial autoplay, synthesize soft chime chord
          playSynthesizedHarpShimmer();
        });
      }
    } catch {
      playSynthesizedHarpShimmer();
    }

    // 2. Schedule cinematic fade-out and unmount
    // Allows enough time for the sweet beat to drop nicely
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      // Soft audio fade out
      if (audioRef.current) {
        const fadeStep = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.08) {
            audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.12);
          } else {
            clearInterval(fadeStep);
            if (audioRef.current) audioRef.current.pause();
          }
        }, 80);
      }
    }, 5500);

    const endTimer = setTimeout(() => {
      setIsVisible(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (onComplete) onComplete();
    }, 6200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.src = '';
      }
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 200);
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] bg-[#050507] flex items-center justify-center overflow-hidden cursor-pointer select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Cinematic Anamorphic Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Deep ambient red/crimson flare like Netflix */}
        <div className="w-[500px] sm:w-[750px] h-[350px] sm:h-[450px] rounded-full bg-gradient-to-r from-rose-600/30 via-red-600/20 to-amber-500/10 blur-[100px] sm:blur-[130px] animate-ambient-glow"></div>
        {/* Horizontal cinematic anamorphic light beam */}
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent blur-xs opacity-75"></div>
      </div>

      {/* 2. Controls: Audio toggle & Skip */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-rose-300 hover:text-white backdrop-blur-md border border-white/10 transition active:scale-95 cursor-pointer"
          title={isMuted ? "Ovozni yoqish" : "Ovozni o‘chirish"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md border border-white/10 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <span>O‘tkazish</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Main Cinematic Centerpiece */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Crown & Monogram Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-400 p-[1.5px] shadow-2xl shadow-rose-600/40 mb-4 sm:mb-6 animate-pulse">
          <div className="w-full h-full bg-[#070709] rounded-2xl flex items-center justify-center">
            <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
          </div>
        </div>

        {/* Netflix-style Cinematic Logo Title */}
        <div className="relative py-2 px-2 sm:px-8 max-w-full">
          <h1
            className="font-serif-luxury font-black text-3xl min-[400px]:text-4xl sm:text-7xl md:text-8xl tracking-wider sm:tracking-widest uppercase text-white animate-netflix-title select-none whitespace-nowrap"
            style={{
              color: '#FFFFFF',
              letterSpacing: '0.14em',
              textShadow:
                '0 0 20px rgba(225, 29, 72, 1), 0 0 45px rgba(244, 63, 94, 0.85), 0 0 75px rgba(225, 29, 72, 0.55), 0 4px 12px rgba(0, 0, 0, 0.9)',
            }}
          >
            BAZA_SHOP
          </h1>

          {/* Anamorphic light reflection sweep across letters */}
          <div className="absolute top-0 bottom-0 w-36 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none animate-light-sweep"></div>
        </div>

        {/* Subtitle with expanding letter tracking */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.4em] uppercase font-bold text-rose-200 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)] text-center">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
          <span>Eksklyuziv Ayollar Butigi</span>
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
        </div>

        {/* Cinematic bar divider */}
        <div className="w-28 sm:w-44 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent mt-4 opacity-90 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
      </div>
    </div>
  );
}
