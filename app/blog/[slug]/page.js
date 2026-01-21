"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Correct hook for App Router slugs
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function BlogPost() {
    const { slug } = useParams(); // Get dynamic slug
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            try {
                // Determine 'slug' value from URL
                const q = query(
                    collection(db, "posts"),
                    where("slug", "==", slug),
                    limit(1)
                );
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    // Simple Youtube Embed Helper
    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        </div>
    );

    if (!post) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-gray-400">Post not found in the archives.</p>
            <Link href="/blog" className="text-pink-500 hover:underline">Return to Blog</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-pink-500/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center">
                <Link href="/blog" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> BACK TO BLOG
                </Link>
                <Link href="/" className="font-montserrat font-bold text-white">CWF</Link>
            </nav>

            {/* Hero / Header */}
            <header className="pt-32 pb-12 px-6 max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider">
                    <Calendar size={12} />
                    {new Date(post.createdAt?.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold text-white leading-tight">
                    {post.title}
                </h1>
            </header>

            {/* Main Content */}
            <main className="px-6 max-w-3xl mx-auto pb-24 space-y-12">

                {/* Featured Media */}
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900">
                    {post.youtubeUrl ? (
                        <div className="relative pb-[56.25%] h-0">
                            <iframe
                                src={`https://www.youtube.com/embed/${getYoutubeId(post.youtubeUrl)}`}
                                className="absolute top-0 left-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : post.coverUrl ? (
                        <img src={post.coverUrl} alt={post.title} className="w-full h-auto" />
                    ) : null}
                </div>

                {/* Text Content */}
                <article className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-montserrat prose-headings:text-white prose-p:text-gray-300 prose-a:text-pink-500 hover:prose-a:text-pink-400">
                    {/* Render paragraphs simply for now */}
                    {post.content.split('\n').map((paragraph, idx) => (
                        paragraph.trim() && <p key={idx}>{paragraph}</p>
                    ))}
                </article>

                <hr className="border-white/10" />

                {/* Share / Footer in-post */}
                <div className="flex justify-between items-center">
                    <div className="font-montserrat font-bold text-white">Christian Ward Films</div>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <Share2 size={16} /> Share Article
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
