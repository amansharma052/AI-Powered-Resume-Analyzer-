import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe } from "../services/auth.service"

/**
 * Layer 3 — useAuth Hook
 * Consumes AuthContext and calls the service layer.
 * Pages use this hook — they never touch the API or service directly.
 */
export const useAuth = () => {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const user = await login({ email, password })
            setUser(user)
        } catch (err) {
            console.error("Login failed:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const user = await register({ username, email, password })
            setUser(user)
        } catch (err) {
            console.error("Register failed:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout failed:", err)
        } finally {
            setLoading(false)
        }
    }

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            setLoading(true)
            try {
                const user = await getMe()
                setUser(user)
            } finally {
                setLoading(false)
            }
        }
        restoreSession()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}