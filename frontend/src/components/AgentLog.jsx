import { useEffect, useRef } from "react"

export default function AgentLog({ logs }) {
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    return (
        <div style={{
            width: "300px", background: "#020617", borderLeft: "1px solid #1e293b",
            padding: "1.5rem 1rem", display: "flex", flexDirection: "column",
            position: "sticky", top: "0", height: "100vh", boxSizing: "border-box"
        }}>
            <h3 style={{ color: "#10b981", margin: 0, marginBottom: "1rem", fontSize: "1rem", display: "flex", alignItems: "center" }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", marginRight: "8px", boxShadow: "0 0 5px #10b981" }}></span>
                Agent Output Stream
            </h3>
            <div
                ref={scrollRef}
                style={{
                    flex: 1, overflowY: "auto", fontSize: "0.8rem", color: "#94a3b8",
                    fontFamily: "monospace", paddingRight: "0.5rem"
                }}>
                {logs.length === 0
                    ? <p style={{ opacity: 0.5 }}>Awaiting node initialization...</p>
                    : logs.map((l, i) => (
                        <div key={i} style={{
                            padding: "0.5rem 0", borderBottom: "1px solid #0f172a",
                            wordBreak: "break-word", lineHeight: "1.4"
                        }}>
                            <span style={{ color: "#64748b" }}>&gt; </span>{l}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
