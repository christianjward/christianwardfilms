"use client";
import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { Trash2, PenTool, Image as ImageIcon, Youtube, Check, RefreshCw, Upload } from "lucide-react";

export default function BlogManager() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // Simple text area for now
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Fetch Posts
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Create Slug Helper
    const createSlug = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    };

    const handleUpload = async () => {
        if (!title || !content) {
            alert("Title and Content are required.");
            return;
        }

        setUploading(true);
        try {
            let coverUrl = null;

            // 1. Upload Cover Image if exists
            if (coverFile) {
                const storageRef = ref(storage, `uploads/blog/${Date.now()}_${coverFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, coverFile);

                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
                        (err) => reject(err),
                        () => resolve()
                    );
                });
                coverUrl = await getDownloadURL(uploadTask.snapshot.ref);
            }

            // 2. Save to Firestore
            await addDoc(collection(db, "posts"), {
                title,
                slug: createSlug(title),
                content,
                youtubeUrl,
                coverUrl,
                createdAt: serverTimestamp(),
            });

            // Reset
            setTitle("");
            setContent("");
            setYoutubeUrl("");
            setCoverFile(null);
            setProgress(0);
            alert("Post published!");

        } catch (error) {
            console.error("Error publishing post:", error);
            alert("Error: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (post) => {
        if (!confirm("Are you sure?")) return;
        try {
            if (post.coverUrl) {
                const fileRef = ref(storage, post.coverUrl);
                await deleteObject(fileRef).catch(console.warn);
            }
            await deleteDoc(doc(db, "posts", post.id));
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="space-y-12">
            {/* Editor */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500"><PenTool size={24} /></div>
                    <h2 className="text-xl font-bold text-white">Write New Post</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Success Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black border border-white/10 p-3 rounded-lg focus:border-pink-500 outline-none transition-colors"
                                placeholder="Enter post title..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">YouTube URL (Optional)</label>
                            <div className="relative">
                                <Youtube className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    className="w-full bg-black border border-white/10 p-3 pl-10 rounded-lg focus:border-red-500 outline-none transition-colors"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Cover Image (Optional)</label>
                            <div className="border border-white/10 border-dashed rounded-lg p-4 flex items-center justify-center bg-black/50 hover:bg-white/5 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCoverFile(e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {coverFile ? (
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Check size={18} />
                                        <span className="text-sm truncate">{coverFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <ImageIcon size={18} />
                                        <span className="text-sm">Upload Cover Image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-full">
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-64 md:h-full bg-black border border-white/10 p-3 rounded-lg focus:border-pink-500 outline-none transition-colors resize-none font-mono text-sm"
                            placeholder="Write your story here..."
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <RefreshCw className="animate-spin" size={20} />
                                Publishing... {Math.round(progress)}%
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Publish Post
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Post List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold pl-4 border-l-4 border-pink-500">Recent Posts</h3>
                <div className="grid gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-gray-900/30 border border-white/5 p-4 rounded-xl flex items-center gap-4 group">
                            {post.coverUrl ? (
                                <img src={post.coverUrl} className="w-16 h-16 object-cover rounded-lg bg-gray-800" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
                                    <PenTool size={20} />
                                </div>
                            )}

                            <div className="flex-1">
                                <h4 className="font-bold text-lg">{post.title}</h4>
                                <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                    <span>{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                    <span>/{post.slug}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(post)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {posts.length === 0 && <div className="text-gray-500 text-center py-8">No posts yet. Start writing!</div>}
                </div>
            </div>
        </div>
    );
}
