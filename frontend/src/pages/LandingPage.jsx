import { useNavigate } from "react-router-dom"

const features = [
    {
        icon: "🧠", title: "AI-Powered Strategy",
        desc: "Gemini 2.5 Flash intelligently parses your campaign brief and segments customers for maximum impact with A/B testing.",
        color: "#38bdf8"
    },
    {
        icon: "🎯", title: "Dynamic Targeting",
        desc: "LangGraph agents autonomously discover and call Aetheris APIs, creating hyper-targeted micro-segments from your customer cohort.",
        color: "#8b5cf6"
    },
    {
        icon: "✅", title: "Human-in-the-Loop",
        desc: "Full control at every stage. Review AI-generated strategies, email content, and approve before any campaign goes live.",
        color: "#10b981"
    },
    {
        icon: "📈", title: "Live Telemetry",
        desc: "Real-time open rate and click rate tracking across all campaign waves with instant performance dashboards.",
        color: "#f59e0b"
    },
    {
        icon: "🔄", title: "Auto-Optimization",
        desc: "AI analyzer identifies underperforming segments, adjusts tone, timing, and content automatically for the next wave.",
        color: "#f43f5e"
    },
    {
        icon: "🔐", title: "Secure & Compliant",
        desc: "Firebase-backed authentication, BFSI-grade data handling, and encrypted session management for enterprise peace of mind.",
        color: "#06b6d4"
    }
]

const steps = [
    { n: "01", title: "Write Your Brief", desc: "Describe your campaign in plain English. The AI extracts goals, constraints, CTAs, and product details automatically." },
    { n: "02", title: "AI Generates Strategy", desc: "LangGraph agents fetch your customer cohort, segment intelligently, and generate tailored email content for A/B testing." },
    { n: "03", title: "You Approve", desc: "Review the plan, customer segments, email previews, and send times. One click to launch or reject and rethink." },
    { n: "04", title: "AI Optimizes", desc: "Post-launch, the AI analyzer studies open/click metrics and autonomously creates an optimized Wave 2 for approval." }
]

export default function LandingPage({ user }) {
    const navigate = useNavigate()

    return (
        <div className="landing-root">
            {/* Background blobs */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            {/* Navbar */}
            <nav className="landing-nav">
                <div className="nav-logo">
                    <img src="/logo.png" alt="Aetheris" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                    Aetheris
                </div>
                <div className="nav-links">
                    <a href="#features" className="nav-link" style={{ textDecoration: 'none' }}>Features</a>
                    <a href="#how-it-works" className="nav-link" style={{ textDecoration: 'none' }}>How it Works</a>
                </div>
                <div className="nav-cta">
                    {user ? (
                        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                            Go to Dashboard →
                        </button>
                    ) : (
                        <>
                            <button className="btn-ghost" onClick={() => navigate("/auth")}>Sign In</button>
                            <button className="btn-primary" onClick={() => navigate("/auth")}>Get Started Free</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="hero-badge">
                    <div className="hero-dot" />
                    Powering BFSI Marketing Automation with AI
                </div>
                <h1 className="hero-title">
                    Turn Campaign Briefs<br />
                    into <span className="hero-title-gradient">AI-Driven Results</span>
                </h1>
                <p className="hero-sub">
                    Aetheris is an autonomous marketing engine that plans, launches, monitors, and self-optimizes email campaigns—with you always in control.
                </p>
                <div className="hero-actions">
                    <button className="btn-hero-primary" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
                        {user ? "Open Dashboard" : "Start Free Campaign"} →
                    </button>
                    <button className="btn-hero-ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                        Explore Features ↓
                    </button>
                </div>

                <div className="stats-bar">
                    <div className="stat-item">
                        <div className="stat-value">50+</div>
                        <div className="stat-label">Customers Targeted</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">3x</div>
                        <div className="stat-label">Avg. Click Rate Lift</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">100%</div>
                        <div className="stat-label">Agentic Execution</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">&lt;30s</div>
                        <div className="stat-label">Plan Generation</div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="section">
                <div className="section-label">⚡ Capabilities</div>
                <h2 className="section-title">Everything You Need to<br />Run Smarter Campaigns</h2>
                <p className="section-sub">Built for BFSI marketers who want to move fast without sacrificing precision or control.</p>
                <div className="features-grid">
                    {features.map(f => (
                        <div key={f.title} className="feature-card">
                            <div className="feature-icon" style={{ background: `${f.color}18` }}>
                                {f.icon}
                            </div>
                            <div className="feature-title">{f.title}</div>
                            <div className="feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="section" style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                <div className="section-label">🔄 Workflow</div>
                <h2 className="section-title">From Brief to Optimized<br />Campaign in 4 Steps</h2>
                <p className="section-sub">Our AI-agent pipeline handles the heavy lifting while you stay firmly in command.</p>
                <div className="steps-container">
                    {steps.map(s => (
                        <div key={s.n} className="step-card">
                            <div className="step-number">{s.n}</div>
                            <div className="step-title">{s.title}</div>
                            <div className="step-desc">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2 className="cta-title">
                        Ready to Supercharge<br />Your Campaigns?
                    </h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.7" }}>
                        Join the FrostHack 2026 campaign—built for marketing teams that want intelligence, not just automation.
                    </p>
                    <button className="btn-hero-primary" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
                        {user ? "Go to Dashboard →" : "Get Started for Free →"}
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img src="/logo.png" alt="Aetheris" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                    <span style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>Aetheris Platform</span>
                </div>
                <div>© 2026 Aetheris AI Labs</div>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <a href="#" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Privacy Policy</a>
                    <a href="#" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Terms of Service</a>
                </div>
            </footer>
        </div>
    )
}
