"use client";
import React, { useState, useRef } from "react";
import { Play } from "lucide-react";
import { SiSoundcloud, SiLastdotfm } from "react-icons/si";

export default function Home() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  return (
    <main className="min-h-screen font-sans">
      {/* Header */}
      <header className="w-full px-6 py-8 flex justify-between items-center z-10 relative">
        <h1 className="text-xl md:text-2xl font-bold tracking-[0.2em] font-sans">
          CHRISTIAN WARD FILMS
        </h1>
        <nav>
          <a
            href="mailto:contact@christianward.net"
            className="text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
          >
            LET'S TALK
          </a>
        </nav>
      </header>

      {/* Hero Video Section */}
      <section className={`w-full max-w-[90%] mx-auto mt-4 md:mt-12 relative aspect-video flex justify-center items-center overflow-hidden rounded-sm group shadow-2xl transition-colors duration-700 ${isPlaying ? 'bg-black' : ''}`}>
        <video
          ref={videoRef}
          controls={isPlaying}
          playsInline
          preload="metadata"
          poster="/video-poster.jpg"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${!isPlaying ? "mix-blend-overlay opacity-80" : "opacity-100"}`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/Aprilpromofinal.mp4" type="video/mp4" />
        </video>

        {/* Play Icon Overlay */}
        {!isPlaying && (
          <>
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
            <button
              onClick={handlePlayClick}
              className="z-20 bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none"
              aria-label="Play Video"
            >
              <Play className="w-8 h-8 text-white fill-white ml-2" />
            </button>
          </>
        )}
      </section>

      {/* Value Proposition & CTA */}
      <section className="flex flex-col items-center justify-center mt-16 md:mt-24 px-6 text-center max-w-4xl mx-auto space-y-12">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-medium leading-relaxed md:leading-snug">
          <span className="font-sans font-light text-xl md:text-3xl block mb-4 uppercase tracking-wider text-white/80">
            Director / Strategist
          </span>
          I combine 12 years of B2B trend strategy with cinematic production to
          turn your expertise into a high-signal narrative that owns the
          conversation.
        </h2>

        <a
          href="mailto:contact@christianward.net"
          className="inline-block mt-8 px-8 py-4 border border-white text-sm tracking-widest uppercase hover:bg-white hover:text-[#5F7691] transition-colors duration-300"
        >
          Let's Talk
        </a>
      </section>

      {/* Social Proof Section */}
      <section className="mt-32 w-full flex flex-col items-center opacity-80">
        <h3 className="text-xs tracking-[0.3em] font-sans uppercase mb-12 text-white/60">
          Brands I've Worked With
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          <span className="font-sans font-bold text-2xl md:text-3xl tracking-tighter">
            BBC
          </span>
          <SiSoundcloud className="w-16 md:w-24 h-auto" />
          <span className="font-sans font-bold text-2xl md:text-3xl tracking-tighter">
            STYLUS
          </span>
          <SiLastdotfm className="w-12 md:w-16 h-auto" />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 pb-12 w-full flex flex-col items-center">
        <div className="flex space-x-8 mb-8 text-sm tracking-widest font-sans uppercase">
          <a
            href="https://www.linkedin.com/in/cjward"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            LinkedIn
          </a>
          <a
            href="https://www.tiktok.com/@christianwardfilms"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            TikTok
          </a>
          <a
            href="https://www.youtube.com/@ChristianWard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            YouTube
          </a>
        </div>
        <p className="text-xs font-sans tracking-widest text-white/40">
          © 2026 CHRISTIAN WARD. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
