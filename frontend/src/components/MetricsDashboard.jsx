export default function MetricsDashboard({ campaigns, onOptimize, loading, final }) {
    const getTotals = () => {
        let opens = 0, clicks = 0;
        campaigns.forEach(c => {
            // Depending on the api response, might be a list of user interactions
            if (c.report?.data) {
                c.report.data.forEach(r => {
                    if (r.EO) opens++;
                    if (r.EC) clicks++;
                })
            }
        })
        return { opens, clicks }
    }

    const { opens, clicks } = getTotals()
    const totalSent = campaigns.reduce((s, c) => s + (c.customer_count || 1000), 0)

    const avgOpen = totalSent ? ((opens / totalSent) * 100).toFixed(1) : "0.0"
    const avgClick = totalSent ? ((clicks / totalSent) * 100).toFixed(1) : "0.0"

    return (
        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ color: "#f1f5f9", marginTop: 0, marginBottom: "1.5rem" }}>📈 Live Radar & Telemetry</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {[["Aggregate Open Rate", avgOpen + "%", "#0ea5e9"], ["Aggregate Click Rate", avgClick + "%", "#10b981"]].map(([label, val, color]) => (
                    <div key={label} style={{ background: "#0f172a", borderRadius: "8px", padding: "1.5rem", textAlign: "center", border: "1px solid #334155" }}>
                        <div style={{ fontSize: "2.5rem", fontWeight: 700, color }}>{val}</div>
                        <div style={{ color: "#94a3b8", marginTop: "0.5rem", letterSpacing: "1px", fontSize: "0.8rem", textTransform: "uppercase" }}>{label}</div>
                    </div>
                ))}
            </div>

            <h3 style={{ color: "#cbd5e1", fontSize: "1rem", borderBottom: "1px solid #334155", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Individual Wave Performance</h3>
            {campaigns.map((c, i) => (
                <div key={i} style={{
                    background: "#0f172a", borderRadius: "6px", padding: "1rem",
                    marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: "600" }}>{c.segment_name || c.segment}</span>
                        <span style={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "monospace" }}>ID: {c.campaign_id}</span>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.9rem", background: "#1e293b", padding: "0.5rem 1rem", borderRadius: "20px" }}>
                        <span style={{ color: "#0ea5e9" }}>Opens: --%</span>
                        <span style={{ color: "#10b981" }}>Clicks: --%</span>
                    </div>
                </div>
            ))}

            {!final ? (
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                    <button onClick={onOptimize} disabled={loading}
                        style={{
                            flex: 2, padding: "0.85rem", background: "#8b5cf6",
                            color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600,
                            fontSize: "1rem", transition: "all 0.2s", opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? "⏳ Autonomous Agent Formulating Next Iteration..." : "🔄 AI Analyze & Optimize"}
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        disabled={loading}
                        style={{
                            flex: 1, padding: "0.85rem", background: "transparent",
                            color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", cursor: "pointer", fontWeight: 600,
                            fontSize: "1rem", transition: "all 0.2s", opacity: loading ? 0.6 : 1
                        }}
                    >
                        🛑 Rethink
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        width: "100%", marginTop: "1.5rem", padding: "0.85rem", background: "#3b82f6",
                        color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600,
                        fontSize: "1rem"
                    }}
                >
                    🏁 Reset Campaign Manager
                </button>
            )}
        </div>
    )
}
