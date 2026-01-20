"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Music, Video, Loader2, X } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Portfolio() {
    const [filter, setFilter] = useState("all");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedAudio, setSelectedAudio] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Videos & Audios
                const vQuery = query(collection(db, "videos"), orderBy("createdAt", "desc"));
                const aQuery = query(collection(db, "audios"), orderBy("createdAt", "desc"));

                const [vSnap, aSnap] = await Promise.all([getDocs(vQuery), getDocs(aQuery)]);

                const videos = vSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "video" }));
                const audios = aSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "audio" }));

                // Combine and sort by createdAt (newest first)
                const allProjects = [...videos, ...audios].sort((a, b) =>
                    (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
                );

                setProjects(allProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProjects = projects.filter((p) => filter === "all" || p.type === filter);

    return (
        <section className="py-24 px-6 md:px-12 bg-background min-h-screen relative">
            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12 animate-in fade-in duration-200"
                    onClick={() => setSelectedVideo(null)}
                >
                    <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={48} />
                    </button>

                    <div
                        className="w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.2)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={selectedVideo.url}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                        <div className="p-4 bg-gray-900 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
                            <div className="flex gap-2 mt-2">
                                {selectedVideo.tags?.map(tag => (
                                    <span key={tag} className="text-xs text-neon-cyan border border-neon-cyan/30 px-2 py-0.5 rounded-sm">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Modal */}
            {selectedAudio && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedAudio(null)}
                >
                    <button
                        onClick={() => setSelectedAudio(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={48} />
                    </button>

                    <div
                        className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(189,0,255,0.2)] flex flex-col items-center gap-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-48 h-48 rounded-2xl bg-gray-800 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                            {selectedAudio.coverUrl ? (
                                <img src={selectedAudio.coverUrl} alt={selectedAudio.title} className="w-full h-full object-cover z-20" />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-electric-purple/20 animate-pulse" />
                                    <Music className="w-24 h-24 text-white z-10" />
                                </>
                            )}
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{selectedAudio.title}</h3>
                            <p className="text-electric-purple font-medium">{selectedAudio.tags?.join(", ")}</p>
                        </div>

                        {/* Visualizer Animation */}
                        <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-electric-purple rounded-full animate-pulse"
                                    style={{
                                        height: `${Math.max(20, (Math.sin(i * 0.5) * 50 + 50))}%`,
                                        animationDuration: '0.8s',
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                />
                            ))}
                        </div>

                        <audio
                            src={selectedAudio.url}
                            controls
                            autoPlay
                            className="w-full"
                        />
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <h2 className="text-4xl font-bold tracking-tighter text-white">Selected Works</h2>

                    <div className="flex gap-4 mt-6 md:mt-0">
                        {["all", "video", "audio"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">No projects found. Upload something in Admin!</div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={project.id}
                                className="break-inside-avoid"
                            >
                                {project.type === "video" ? (
                                    <div
                                        onClick={() => setSelectedVideo(project)}
                                        className="group relative rounded-xl overflow-hidden bg-gray-900 border border-white/5 hover:border-neon-cyan/50 transition-colors cursor-pointer"
                                    >
                                        {/* Use a placeholder if thumbnail logic isn't built yet, or maybe just a video tag or a generic image for now since we don't have auto-thumb yet */}
                                        <div className="aspect-video bg-gray-800 flex items-center justify-center overflow-hidden">
                                            <video
                                                src={project.url}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                onMouseOver={async (e) => {
                                                    try {
                                                        await e.target.play();
                                                    } catch (err) {
                                                        // AbortError is expected if mouse out happens quickly
                                                        if (err.name !== 'AbortError') console.error(err);
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    // Only pause if not already paused to avoid redundant calls
                                                    if (!e.target.paused) e.target.pause();
                                                }}
                                            />
                                        </div>

                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                                            <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                            <div className="flex gap-2 flex-wrap">
                                                {project.tags?.map(tag => (
                                                    <span key={tag} className="text-xs text-neon-cyan border border-neon-cyan/30 px-2 py-0.5 rounded-sm">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setSelectedAudio(project)}
                                        className="relative rounded-xl overflow-hidden bg-gray-900/50 border border-white/5 p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <div className="w-16 h-16 rounded bg-gray-800 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                                            {project.coverUrl ? (
                                                <img src={project.coverUrl} alt={project.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Music className="w-6 h-6 text-electric-purple" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-white truncate group-hover:text-neon-cyan transition-colors">{project.title}</h3>
                                            <p className="text-sm text-gray-500">{project.tags?.join(", ") || "Audio"}</p>
                                        </div>
                                        <div className="w-24 h-8 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                            {/* Fake Waveform */}
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className="w-1 bg-electric-purple rounded-full animate-pulse" style={{ height: `${Math.max(20, (Math.sin(i * 123 + (project.title.length)) * 50 + 50))}%`, animationDelay: `${i * 0.1}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
