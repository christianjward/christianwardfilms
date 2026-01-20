"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, storage, db } from "@/lib/firebase"; // Added storage, db
import { Trash2, LogOut, Video, Music, Upload, Check } from "lucide-react"; // Import used icons
import { collection, addDoc, serverTimestamp, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"; // Added deletion/query methods
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"; // Added deleteObject

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState([]); // State for content list
    const router = useRouter();

    // Protect Route & Fetch Content
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            if (!authUser) {
                router.push("/admin");
            } else {
                setUser(authUser);
                setLoading(false);
            }
        });

        // Real-time Content Listener
        const vQuery = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const aQuery = query(collection(db, "audios"), orderBy("createdAt", "desc"));

        const unsubscribeVideos = onSnapshot(vQuery, (vSnap) => {
            const vData = vSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "video" }));

            // Nested listener handling is tricky, simpler to just listen to both and merge
            onSnapshot(aQuery, (aSnap) => {
                const aData = aSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "audio" }));
                const allContent = [...vData, ...aData].sort((a, b) =>
                    (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
                );
                setContent(allContent);
            });
        });

        return () => {
            unsubscribeAuth();
            unsubscribeVideos();
        };
    }, [router]);

    const handleDelete = async (item) => {
        if (!confirm(`Are you sure you want to delete "${item.title}"? This cannot be undone.`)) return;

        try {
            // 1. Delete main file from Storage
            const fileRef = ref(storage, item.url);
            await deleteObject(fileRef).catch(err => console.warn("File delete error (might not exist):", err));

            // 2. Delete cover art if exists
            if (item.coverUrl) {
                const coverRef = ref(storage, item.coverUrl);
                await deleteObject(coverRef).catch(err => console.warn("Cover delete error:", err));
            }

            // 3. Delete from Firestore
            await deleteDoc(doc(db, item.type === "video" ? "videos" : "audios", item.id));

        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed: " + error.message);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-neon-cyan animate-pulse">Initializing Secure Uplink...</div>;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/10 p-6 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-50">
                <h1 className="text-xl font-bold tracking-tight text-white">Full-Spectrum CMS</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <button
                        onClick={() => signOut(auth)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 space-y-12">
                {/* Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Video Upload Section */}
                    <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-neon-cyan/10 rounded-lg text-neon-cyan"><Video size={24} /></div>
                            <h2 className="text-xl font-bold">Upload Video</h2>
                        </div>

                        <FormSection type="video" />
                    </div>

                    {/* Audio Upload Section */}
                    <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-electric-purple/10 rounded-lg text-electric-purple"><Music size={24} /></div>
                            <h2 className="text-xl font-bold">Upload Audio</h2>
                        </div>

                        <FormSection type="audio" />
                    </div>
                </div>

                {/* Content Management Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 border-l-4 border-white pl-4">Manage Content</h2>
                    <div className="bg-gray-900/30 border border-white/5 rounded-xl overflow-hidden">
                        {content.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No content uploaded yet.</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {content.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${item.type === 'video' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-electric-purple/10 text-electric-purple'}`}>
                                                {item.type === 'video' ? <Video size={20} /> : <Music size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{item.title}</h3>
                                                <div className="flex gap-2 text-xs text-gray-500">
                                                    <span>{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="uppercase">{item.type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function FormSection({ type }) {
    const [dragging, setDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [coverFile, setCoverFile] = useState(null); // New state for cover art
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) setFiles([droppedFiles[0]]); // Only logic for single file for now
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles([e.target.files[0]]);
        }
    };

    const handleCoverSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCoverFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0 || !title) {
            alert("Please select a file and enter a title.");
            return;
        }

        setUploading(true);
        setSuccess(false);
        setProgress(0);

        try {
            const file = files[0];
            // 1. Upload Main File
            const storageRef = ref(storage, `uploads/${type}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Wrap main upload in a promise to track it
            const mainUploadPromise = new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(p);
                    },
                    (error) => reject(error),
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(url);
                    }
                );
            });

            const mainDownloadURL = await mainUploadPromise;
            let coverDownloadURL = null;

            // 2. Upload Cover Art (if selected and type is audio)
            if (type === 'audio' && coverFile) {
                const coverRef = ref(storage, `uploads/covers/${Date.now()}_${coverFile.name}`);
                const coverSnapshot = await uploadBytesResumable(coverRef, coverFile); // Simple upload for cover
                coverDownloadURL = await getDownloadURL(coverSnapshot.ref);
            }

            // 3. Save to Firestore
            await addDoc(collection(db, type === "video" ? "videos" : "audios"), {
                title: title,
                tags: tags.split(",").map(t => t.trim()),
                url: mainDownloadURL,
                coverUrl: coverDownloadURL, // Save cover URL
                type: type,
                createdAt: serverTimestamp(),
            });

            setUploading(false);
            setSuccess(true);
            setFiles([]);
            setCoverFile(null);
            setTitle("");
            setTags("");
            setProgress(0);
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error("Upload error:", error);
            setUploading(false);
            alert("Upload failed: " + error.message);
        }
    };

    return (
        <div className="space-y-4">
            {/* Main File Drag & Drop */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById(`file-upload-${type}`).click()}
                className={`
                    border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden
                    ${dragging
                        ? (type === 'video' ? 'border-neon-cyan bg-neon-cyan/5' : 'border-electric-purple bg-electric-purple/5')
                        : 'border-white/10 hover:border-white/20 bg-black/50'}
                `}
            >
                {/* Hidden Input */}
                <input
                    id={`file-upload-${type}`}
                    type="file"
                    className="hidden"
                    accept={type === 'video' ? "video/*" : "audio/*"}
                    onChange={handleFileSelect}
                />

                {uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 flex-col">
                        <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
                        <span className="font-mono text-sm">{Math.round(progress)}%</span>
                    </div>
                ) : null}

                {success ? (
                    <div className="flex flex-col items-center text-green-400 animate-in fade-in zoom-in duration-300">
                        <Check size={48} className="mb-2" />
                        <span className="font-bold">Uploaded!</span>
                    </div>
                ) : (
                    <>
                        <Upload className={`mb-3 ${dragging ? 'text-white' : 'text-gray-500'}`} />
                        <p className="text-sm text-center text-gray-400 px-4">
                            {files.length > 0
                                ? <span className="text-white font-medium block truncate max-w-[200px]">{files[0].name}</span>
                                : `Drag ${type} here or click to browse`
                            }
                        </p>
                    </>
                )}
            </div>

            {/* Cover Art Upload (Audio Only) */}
            {type === 'audio' && (
                <div className="flex items-center gap-4 bg-black border border-white/10 rounded-lg p-3">
                    <div className="p-2 bg-gray-800 rounded text-gray-400">
                        {coverFile ? <Check size={20} className="text-green-400" /> : <Upload size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <label htmlFor="cover-upload" className="block text-xs uppercase font-bold text-gray-500 tracking-wider mb-0.5 cursor-pointer hover:text-white transition-colors">
                            Upload Cover Art (Optional)
                        </label>
                        <p className="text-sm text-white truncate">{coverFile ? coverFile.name : "Select an image..."}</p>
                    </div>
                    <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverSelect}
                    />
                    <button onClick={() => document.getElementById('cover-upload').click()} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-white transition-colors">
                        Browse
                    </button>
                </div>
            )}

            {/* Inputs */}
            <div>
                <label className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1 block">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-white/30 focus:outline-hidden transition-colors"
                />
            </div>

            <div>
                <label className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1 block">
                    {type === 'video' ? 'Tags (comma separated)' : 'Genre'}
                </label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-white/30 focus:outline-hidden transition-colors"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className={`
                    w-full py-3 rounded-lg font-bold text-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                    ${type === 'video'
                        ? 'bg-neon-cyan hover:bg-[#33f6ff] disabled:bg-gray-800 disabled:text-gray-500'
                        : 'bg-electric-purple hover:bg-[#c933ff] text-white disabled:bg-gray-800 disabled:text-gray-500'}
                `}
            >
                {uploading ? "Uploading..." : "Connect & Upload"}
            </button>
        </div>
    );
}
