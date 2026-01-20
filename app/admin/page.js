"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLogin() {
    console.log("AdminLogin rendering...");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.message || "Login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 border border-white/10 shadow-[0_0_50px_rgba(0,243,255,0.1)]">
                <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-linear-to-r from-neon-cyan to-electric-purple">
                    Admin Access
                </h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-hidden transition-colors"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-hidden transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neon-cyan transition-colors"
                    >
                        Enter Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
