"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { videoObjectUrls, subscribeToVideosReady, videosReady } from "@/lib/video-cache";

interface VideoPlayerProps {
  slug: string;
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VideoPlayer({ slug }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [cacheReady, setCacheReady] = useState(videosReady);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // ── Sync cached ObjectURL when available ──────────────────────────────
  useEffect(() => {
    return subscribeToVideosReady(() => setCacheReady(true));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!cacheReady || !video) return;
    const cached = videoObjectUrls.get(`/videos/${slug}.webm`);
    if (cached) {
      const source = video.querySelector("source");
      if (source && source.src !== cached) {
        source.src = cached;
        const wasPlaying = !video.paused;
        const time = video.currentTime;
        video.load();
        video.currentTime = time;
        if (wasPlaying) video.play();
      }
    }
  }, [cacheReady, slug]);

  // ── Auto-hide controls ────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setControlsVisible(true);
    hideTimerRef.current = setTimeout(() => {
      if (!isDraggingRef.current) setControlsVisible(false);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, []);

  // ── Playback controls ─────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
    resetHideTimer();
  }, [resetHideTimer]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    resetHideTimer();
  }, [resetHideTimer]);

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
    resetHideTimer();
  }, [resetHideTimer]);

  // ── Progress scrubbing ────────────────────────────────────────────────
  const seekTo = useCallback((clientX: number) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setCurrentTime(v.currentTime);
  }, []);

  const handleProgressPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      seekTo(e.clientX);
    },
    [seekTo]
  );

  const handleProgressPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      seekTo(e.clientX);
    },
    [seekTo]
  );

  const handleProgressPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    resetHideTimer();
  }, [resetHideTimer]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    /*
     * Outer div: transparent, provides the safe-zone padding so the video
     * frame floats between Lines (top) and Header nav (bottom).
     * pt clears Lines tick marks; pb clears the fixed Header nav.
     */
    <div
      className="w-full h-full flex flex-col pt-5 pb-16 md:pt-6 md:pb-12"
      onMouseMove={resetHideTimer}
      onPointerDown={resetHideTimer}
    >
      {/* ── Video frame: black bg only inside the floating frame ── */}
      <div className="relative flex-1 overflow-hidden bg-black">

        {/* ── Video element ── */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (!v) return;
            setCurrentTime(v.currentTime);
            if (v.duration && !isNaN(v.duration)) setDuration(v.duration);
          }}
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (!v) return;
            setDuration(v.duration);
          }}
          onPlay={() => { setPlaying(true); resetHideTimer(); }}
          onPause={() => { setPlaying(false); setControlsVisible(true); }}
        >
          <source src={`/videos/${slug}.webm`} type="video/webm" />
        </video>

        {/* ── Click area (play/pause) — excludes the controls bar ── */}
        <div
          className="absolute inset-0 cursor-pointer"
          style={{ bottom: "48px" }}
          onClick={togglePlay}
        />

        {/* ── Controls bar ── */}
        <div
          className={[
            "absolute bottom-0 left-0 right-0",
            "px-3 py-3 md:px-4",
            "flex items-center gap-3 md:gap-4",
            "bg-linear-to-t from-black/70 via-black/30 to-transparent",
            "transition-opacity duration-300 ease-out",
            controlsVisible || !playing ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {/* play / pause */}
          <button
            onClick={togglePlay}
            className="font-mono text-[10px] uppercase text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            {playing ? "pause" : "play"}
          </button>

          {/* progress bar */}
          <div
            ref={progressRef}
            className="flex-1 h-px bg-white/25 relative cursor-col-resize touch-none"
            onPointerDown={handleProgressPointerDown}
            onPointerMove={handleProgressPointerMove}
            onPointerUp={handleProgressPointerUp}
            onPointerCancel={handleProgressPointerUp}
          >
            <div
              className="absolute left-0 top-0 h-full bg-white"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-white rounded-full -translate-x-1/2"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* time */}
          <span className="font-mono text-[10px] text-white/60 shrink-0 tabular-nums">
            {formatTime(currentTime)}&nbsp;/&nbsp;{formatTime(duration)}
          </span>

          {/* mute / unmute */}
          <button
            onClick={toggleMute}
            className="font-mono text-[10px] uppercase text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            {muted ? "unmute" : "mute"}
          </button>

          {/* fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="font-mono text-[10px] uppercase text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer hidden md:block"
          >
            full
          </button>
        </div>

      </div>
    </div>
  );
}
