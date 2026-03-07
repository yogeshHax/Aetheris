import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import AuthPage from "./pages/AuthPage"
import "./index.css"

function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u)
            setLoading(false)
        })
        return unsub
    }, [])

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#020817',
                color: '#f1f5f9'
            }}>
                <div className="loader-ring"></div>
                <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#94a3b8' }}>Syncing Neural Links...</p>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage user={user} />} />
                <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
