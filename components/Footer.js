"use client";
import { FaLinkedin, FaTiktok, FaSoundcloud } from "react-icons/fa";

export default function Footer() {
    const links = [
        { name: "LinkedIn", href: "https://www.linkedin.com/in/cjward/", icon: <FaLinkedin size={24} /> },
        { name: "TikTok", href: "https://www.tiktok.com/@christianwardfilms", icon: <FaTiktok size={24} /> },
        { name: "SoundCloud", href: "https://soundcloud.com/theechodept", icon: <FaSoundcloud size={24} /> },
    ];

    return (
        <footer className="w-full bg-black border-t border-white/10 py-12 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-electric-purple/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold text-white font-montserrat">Christian Ward Films</h3>
                    <p className="text-sm text-gray-500">Complete Content Solutions</p>
                </div>

                <div className="flex items-center gap-6">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-neon-cyan transition-colors transform hover:scale-110 duration-200"
                            aria-label={link.name}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>

                <div className="text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} CWF. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
