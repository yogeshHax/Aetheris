export default function ApprovalPanel({ analysis, onApprove, loading }) {
    return (
        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "1.5rem", borderLeft: "4px solid #8b5cf6" }}>
            <h2 style={{ color: "#f1f5f9", marginTop: 0, marginBottom: "1rem" }}>🧠 AI Evaluator Output</h2>
            <div style={{ background: "#0f172a", borderRadius: "8px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <p style={{ color: "#cbd5e1", lineHeight: "1.6", marginTop: 0 }}>{analysis.analysis_summary}</p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                    <span style={{ background: "#ca8a04", color: "white", padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
                        🏆 High Priority: {analysis.top_performing_segment}
                    </span>
                    {analysis.underperforming_segments?.map(u => (
                        <span key={u} style={{ background: "#be123c", color: "white", padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
                            🔻 Underperforming: {u}
                        </span>
                    ))}
                </div>
            </div>

            <h3 style={{ color: "#f1f5f9", borderBottom: "1px solid #334155", paddingBottom: "0.5rem" }}>Course Adjustments:</h3>
            {analysis.optimization_actions?.map((a, i) => (
                <div key={i} style={{
                    background: "#0f172a", borderRadius: "8px", padding: "1rem",
                    marginBottom: "1rem", border: "1px solid #475569"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong style={{ color: "#8b5cf6", fontSize: "1.1rem" }}>{a.segment_name}</strong>
                        <span style={{ color: "#94a3b8", fontSize: "0.8rem", background: "#1e293b", padding: "0.2rem 0.6rem", borderRadius: "12px" }}>{a.action}</span>
                    </div>
                    <p style={{ color: "#cbd5e1", fontSize: "0.95rem", margin: "0.75rem 0", fontStyle: "italic" }}>{a.reason}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem", background: "#1e293b", padding: "0.75rem", borderRadius: "6px" }}>
                        <span style={{ color: "#f8fafc" }}>🕐 Scheduled (IST): {a.suggested_send_time}</span>
                        <span style={{ color: "#f8fafc" }}>🎨 Tone Shift: {a.suggested_tone}</span>
                        <span style={{ color: "#f8fafc", gridColumn: "1/3", marginTop: "0.25rem" }}>
                            📝 Changes applied: {a.content_changes}
                        </span>
                    </div>
                </div>
            ))}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button onClick={() => onApprove(false)}
                    style={{
                        flex: 1, padding: "0.75rem", background: "#dc2626", color: "white",
                        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600
                    }}>❌ Discard Strategy</button>
                <button onClick={() => onApprove(true)} disabled={loading}
                    style={{
                        flex: 2, padding: "0.75rem", background: "#16a34a", color: "white",
                        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600
                    }}>
                    {loading ? "⏳ Encoding..." : "✅ Approve Adjusted Vectors"}
                </button>
            </div>
        </div>
    )
}
