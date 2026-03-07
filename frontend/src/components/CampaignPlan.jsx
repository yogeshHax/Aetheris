export default function CampaignPlan({ plan, onApprove, loading }) {
    return (
        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ color: "#f1f5f9", marginTop: 0, marginBottom: "0.5rem" }}>📊 AI Generated Strategy</h2>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontStyle: "italic" }}>{plan.campaign_goal}</p>

            {plan.segments && plan.segments.map((seg, i) => (
                <div key={i} style={{ background: "#0f172a", borderRadius: "8px", padding: "1.25rem", marginBottom: "1rem", border: "1px solid #334155" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ color: "#38bdf8", margin: 0 }}>A/B Splinter {seg.segment_id}: {seg.name}</h3>
                        <span style={{ background: "#1e40af", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.8rem", color: "white" }}>
                            {seg.customer_ids?.length || 0} customers matched
                        </span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.4", margin: "1rem 0" }}>{seg.description}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.85rem", background: "#1e293b", padding: "1rem", borderRadius: "6px" }}>
                        <span style={{ color: "#cbd5e1" }}>🕐 Send IST: <strong style={{ color: "white" }}>{seg.send_time}</strong></span>
                        <span style={{ color: "#cbd5e1" }}>🎨 Tone: <strong style={{ color: "white" }}>{seg.tone}</strong></span>
                        <span style={{ color: "#cbd5e1" }}>😊 Emoji: <strong style={{ color: "white" }}>{seg.use_emoji ? "Enabled" : "Disabled"}</strong></span>
                    </div>

                    <div style={{ marginTop: "1rem", background: "#020617", borderRadius: "6px", padding: "1rem", borderLeft: "3px solid #0ea5e9" }}>
                        <div style={{ color: "#e2e8f0", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Generated Email Preview</div>
                        <strong style={{ color: "#f8fafc", fontSize: "1.05rem", display: "block", marginBottom: "0.5rem" }}>Subject: {seg.email_subject}</strong>
                        <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: "0", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>{seg.email_body}</p>
                    </div>
                </div>
            ))}

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button onClick={() => onApprove(false)}
                    style={{
                        flex: 1, padding: "0.75rem", background: "#ef4444", color: "white",
                        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600
                    }}>
                    ❌ Reject Strategy
                </button>
                <button onClick={() => onApprove(true)} disabled={loading}
                    style={{
                        flex: 2, padding: "0.75rem", background: "#10b981", color: "white",
                        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600,
                        opacity: loading ? 0.6 : 1
                    }}>
                    {loading ? "⏳ Scheduling..." : "✅ Approve & Initiate Sequence"}
                </button>
            </div>
        </div>
    )
}
