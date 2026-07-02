import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../components/auth.form.scss"

/**
 * Layer 4 — Register Page
 * Pure UI: collects registration data, delegates to useAuth hook.
 */
const Register = () => {

    const { loading, handleRegister } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate('/')
        } catch {
            setError("Registration failed. That username or email may already be in use.")
        }
    }

    if (loading) {
        return (
            <main>
                <div className="form-container">
                    <div className="loading-spinner" />
                    <p>Creating your account…</p>
                </div>
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Create Account</h1>
                <p className="form-subtitle">Join and get your AI interview plan</p>

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            required
                        />
                    </div>
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
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <button type="submit" className="button primary-button">Register</button>
                </form>

                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Register