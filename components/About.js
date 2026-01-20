"use client";
import { motion } from "framer-motion";

export default function About() {
    return (
        <section className="py-24 px-6 md:px-12 bg-dark-surface/50 border-y border-white/5 backdrop-blur-sm relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
                {/* Profile Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full md:w-auto flex-shrink-0"
                >
                    <div className="relative w-48 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,243,255,0.15)] border border-white/10 group">
                        <img
                            src="/profile.png"
                            alt="Christian Ward"
                            className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full md:w-2/3 border-l-2 border-neon-cyan pl-6 md:pl-8"
                >
                    <h2 className="text-3xl font-bold mb-6 text-white tracking-tight font-montserrat">
                        Christian Ward Films
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                        I am a <span className="text-neon-cyan">full-stack video creative</span> capable of executing every stage of production: Visuals (4K Cinematography, Grading, Motion Graphics), Audio (Original Music, Sound Design), and Innovation (AI Content Production & VFX). <br /><br />
                        <span className="italic text-white">Why hire a crew when you can hire a creator?</span>
                    </p>
                </motion.div>
            </div>

            {/* Background Accent */}
            <div className="absolute right-0 top-0 w-1/3 h-full bg-linear-to-l from-electric-purple/5 to-transparent pointer-events-none" />
        </section>
    );
}
