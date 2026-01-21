"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

export default function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-background py-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-montserrat font-extrabold tracking-tighter text-white">
                        Insights & <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500">Stories</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Behind the scenes, technical deep dives, and creative musings.
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">No posts yet. Stay tuned.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-colors flex flex-col"
                            >
                                <Link href={`/blog/${post.slug}`} className="block flex-1">
                                    {/* Cover Image */}
                                    <div className="aspect-video bg-gray-800 overflow-hidden relative">
                                        {post.coverUrl ? (
                                            <img
                                                src={post.coverUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-700 font-montserrat font-bold text-4xl">
                                                CWF
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div className="text-xs font-bold text-pink-500 uppercase tracking-widest">
                                            {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed">
                                            {post.content}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm text-white font-medium group-hover:gap-3 transition-all">
                                            Read Article <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <div className="fixed bottom-12 right-12 z-50">
                <Link href="/" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold transition-all border border-white/10 hover:border-white/30">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
