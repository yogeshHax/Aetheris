import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    auth, googleProvider,
    signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "../firebase"

export default function AuthPage() {
    const [mode, setMode] = useState("signin") // "signin" | "signup"
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleGoogle = async () => {
        setErr(""); setLoading(true)
        try {
            await signInWithPopup(auth, googleProvider)
            navigate("/dashboard")
        } catch (e) { setErr(e.message) }
        setLoading(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); setErr(""); setLoading(true)
        try {
            if (mode === "signup") {
                await createUserWithEmailAndPassword(auth, email, password)
            } else {
                await signInWithEmailAndPassword(auth, email, password)
            }
            navigate("/dashboard")
        } catch (e) {
            const msg = e.code === "auth/invalid-credential" ? "Invalid email or password."
                : e.code === "auth/email-already-in-use" ? "Email already registered. Sign in instead."
                    : e.code === "auth/weak-password" ? "Password must be at least 6 characters."
                        : e.message
            setErr(msg)
        }
        setLoading(false)
    }

    return (
        <div className="auth-root">
            {/* Left panel */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img src="/logo.png" alt="Aetheris" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "1.2rem" }}>Aetheris Platform</span>
                    </div>
                    <div className="auth-left-title">
                        AI-Powered<br />
                        <span style={{ background: "linear-gradient(135deg, #38bdf8, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Campaign<br />Intelligence
                        </span>
                    </div>
                    <p className="auth-left-sub">
                        Plan, launch, monitor, and optimize email campaigns autonomously—with you always in control.
                    </p>
                </div>
                <div className="auth-testimonials">
                    <div className="auth-testimonial">
                        <div className="auth-testimonial-text">
                            "Aetheris took our product launch from a generic blast to a hyper-targeted, AI-optimized campaign in minutes. The results were phenomenal."
                        </div>
                        <div className="auth-testimonial-author">
                            <div className="auth-testimonial-avatar">A</div>
                            <div>
                                <div className="auth-testimonial-name">Aryan Sharma</div>
                                <div className="auth-testimonial-role">Head of Digital Marketing · SuperBFSI</div>
                            </div>
                        </div>
                    </div>
                    <div className="auth-testimonial" style={{ marginTop: "1rem" }}>
                        <div style={{ display: "flex", gap: "1.5rem", padding: "0.5rem 0" }}>
                            {[["⚡", "Agentic"], ["🎯", "Precise"], ["🔐", "Secure"]].map(([ic, lb]) => (
                                <div key={lb} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "1.4rem" }}>{ic}</div>
                                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{lb}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="auth-right">
                <div className="auth-card animate-fadeIn">
                    <div className="auth-header">
                        <img src="/logo.png" alt="Aetheris" style={{ margin: "0 auto 1rem", width: 48, height: 48, objectFit: 'contain' }} />
                        <div className="auth-title">
                            {mode === "signin" ? "Welcome back" : "Create account"}
                        </div>
                        <div className="auth-subtitle">
                            {mode === "signin"
                                ? "Sign in to access your campaign dashboard"
                                : "Join Aetheris and start your first AI campaign"}
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button className="auth-google-btn" onClick={handleGoogle} disabled={loading}>
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
                            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
                            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
                            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <div className="auth-divider-text">or</div>
                        <div className="auth-divider-line" />
                    </div>

                    {err && <div className="auth-error">{err}</div>}

                    <form onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Aryan Sharma"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                className="form-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Please wait..." : (mode === "signin" ? "Sign In →" : "Create Account →")}
                        </button>
                    </form>

                    <div className="auth-footer-text">
                        {mode === "signin" ? (
                            <>Don't have an account? <button className="auth-switch-link" onClick={() => { setMode("signup"); setErr("") }}>Sign up free</button></>
                        ) : (
                            <>Already have an account? <button className="auth-switch-link" onClick={() => { setMode("signin"); setErr("") }}>Sign in</button></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
