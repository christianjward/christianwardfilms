"use client";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center bg-black">
            {/* Background Video Placeholder */}
            {/* Background Video */}
            <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://firebasestorage.googleapis.com/v0/b/christian-ward-films.firebasestorage.app/o/uploads%2Fvideo%2F1768863906951_showreel2026.mov?alt=media&token=22127528-5306-4837-a017-1cb6a682529b" type="video/mp4" />
                </video>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute inset-0 z-0 bg-linear-to-t from-background via-transparent to-transparent" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-electric-purple/20 blur-[100px] rounded-full animate-pulse delay-1000" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-montserrat font-extrabold tracking-tighter mb-6 text-white"
                >
                    Christian Ward Films <br />
                    <span className="text-3xl md:text-5xl">Complete Content Solutions</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-xl md:text-2xl text-gray-300 font-light tracking-wide"
                >
                    Visuals. Audio. Innovation.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-8"
                >
                    <a
                        href="mailto:contact@christianward.net"
                        className="inline-block px-8 py-3 text-lg font-bold border-2 border-neon-cyan text-neon-cyan rounded-full hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300"
                    >
                        Let's Talk
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
