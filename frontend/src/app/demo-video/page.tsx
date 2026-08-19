"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  X,
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Globe,
  Tv,
} from "lucide-react";

export default function DemoVideoPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total > 0) {
        setProgress((current / total) * 100);
        setDuration(total);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && duration > 0) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-slate-950 flex flex-col text-white font-sans overflow-hidden select-none"
    >
      {/* Clean Browser-Style Top Header Bar (Duplicate buttons removed) */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-50 shrink-0">
        
        {/* Left: Window Controls & Tab Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => router.push("/")}
              className="h-3 w-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center group"
              title="Close Page"
            >
              <X className="h-2 w-2 text-rose-950 opacity-0 group-hover:opacity-100" />
            </button>
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Browser Tab Title */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-t-lg border-t border-x border-slate-800 text-xs font-bold text-emerald-400">
            <Tv className="h-3.5 w-3.5 text-emerald-400" />
            <span>BhoomiVerify — Official Demonstration Video</span>
          </div>
        </div>

        {/* Center/Right: Address Bar */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-4 py-1 text-[11px] text-slate-400 font-mono">
          <Globe className="h-3 w-3 text-emerald-400" />
          <span>http://localhost:3000/demo-video</span>
        </div>

      </div>

      {/* Main Video Theater Canvas */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        >
          <source src="/demo_video.mp4" type="video/mp4" />
          <source src="/demo_video.webm" type="video/webm" />
          Your browser does not support HTML5 video playback.
        </video>

        {/* Big Center Play Overlay Button when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute h-20 w-20 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 animate-in zoom-in-95"
          >
            <Play className="h-10 w-10 fill-slate-950 ml-1" />
          </button>
        )}

        {/* Bottom Floating Theater Controls */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 sm:p-6 space-y-3 z-30 opacity-95 transition-opacity hover:opacity-100">
          
          {/* Seek Progress Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 accent-amber-400 rounded-lg cursor-pointer transition-all"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Play/Pause & Restart Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="h-10 w-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg transition-all font-bold"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-slate-950" /> : <Play className="h-5 w-5 fill-slate-950 ml-0.5" />}
              </button>

              <button
                onClick={restartVideo}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Restart Video"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={toggleMute}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
              </button>
            </div>

            {/* Middle Title Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>BhoomiVerify — Spatial Cadastral & Record Intelligence System</span>
            </div>

            {/* Right Fullscreen & Exit Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span>{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
              </button>

              <button
                onClick={() => router.push("/")}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
              >
                <X className="h-4 w-4" />
                <span>Exit Video</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
