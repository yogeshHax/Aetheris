import { useState } from "react"

const EXAMPLE = `Run email campaign for launching XDeposit, a flagship term deposit product from SuperBFSI, that gives 1 percentage point higher returns than its competitors. Announce an additional 0.25 percentage point higher returns for female senior citizens. Optimise for open rate and click rate. Don't skip emails to customers marked 'inactive'. Include the call to action: https://superbfsi.com/xdeposit/explore/`

export default function BriefInput({ onSubmit, loading }) {
    const [brief, setBrief] = useState("")

    return (
        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h2 style={{ marginTop: 0, marginBottom: "1rem", color: "#f8fafc" }}>📋 Campaign Brief</h2>
            <textarea
                value={brief}
                onChange={e => setBrief(e.target.value)}
                placeholder="Describe your campaign in natural language..."
                style={{
                    width: "100%", minHeight: "160px", background: "#0f172a", color: "#e2e8f0",
                    border: "1px solid #334155", borderRadius: "8px", padding: "1rem",
                    fontSize: "0.95rem", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit"
                }}
            />
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button onClick={() => setBrief(EXAMPLE)}
                    style={{
                        padding: "0.75rem 1rem", background: "#334155", color: "#cbd5e1",
                        border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500",
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.background = "#475569"}
                    onMouseOut={(e) => e.target.style.background = "#334155"}
                >
                    Inject Example Data
                </button>
                <button onClick={() => onSubmit(brief)} disabled={loading || !brief.trim()}
                    style={{
                        padding: "0.75rem 1.5rem", background: "#0ea5e9", color: "white",
                        border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600,
                        opacity: loading ? 0.6 : 1, transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => !loading && (e.target.style.background = "#0284c7")}
                    onMouseOut={(e) => !loading && (e.target.style.background = "#0ea5e9")}
                >
                    {loading ? "⏳ AI Synthesizing Plan..." : "🚀 Let AI Analyze & Plan"}
                </button>
            </div>
        </div>
    )
}
