import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../components/auth.form.scss"
import { useAuth } from "../hooks/useAuth"

/**
 * Layer 4 — Login Page
 * Pure UI: collects credentials, delegates to useAuth hook.
 */
const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch {
            setError("Invalid email or password. Please try again.")
        }
    }

    if (loading) {
        return (
            <main>
                <div className="form-container">
                    <div className="loading-spinner" />
                    <p>Signing you in…</p>
                </div>
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Welcome Back</h1>
                <p className="form-subtitle">Sign in to your account</p>

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button type="submit" className="button primary-button">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login