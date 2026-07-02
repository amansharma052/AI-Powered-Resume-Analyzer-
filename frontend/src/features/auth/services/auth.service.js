import { register as apiRegister, login as apiLogin, logout as apiLogout, getMe as apiGetMe } from "../auth.api.js"

/**
 * @description Service layer for auth — calls API and normalises the data.
 * This layer sits between the raw API calls and the React hooks.
 */

export async function register({ username, email, password }) {
    const data = await apiRegister({ username, email, password })
    return data.user
}

export async function login({ email, password }) {
    const data = await apiLogin({ email, password })
    return data.user
}

export async function logout() {
    await apiLogout()
}

export async function getMe() {
    try {
        const data = await apiGetMe()
        return data.user
    } catch {
        // Not authenticated — return null silently
        return null
    }
}
