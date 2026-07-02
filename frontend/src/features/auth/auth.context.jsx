import { createContext, useState } from "react"

/**
 * Layer 3 — Auth Context
 * Provides global auth state (user + loading) to the whole app.
 * AuthProvider wraps the app in main.jsx.
 */

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
