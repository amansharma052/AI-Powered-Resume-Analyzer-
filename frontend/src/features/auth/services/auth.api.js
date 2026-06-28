const BASE_URL = "http://localhost:5000/api/auth";

const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const login = ({ email, password }) =>
    fetchJSON(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

export const register = ({ username, email, password }) =>
    fetchJSON(`${BASE_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });

export const logout = () =>
    fetchJSON(`${BASE_URL}/logout`, { method: "POST" });

export const getMe = () =>
    fetchJSON(`${BASE_URL}/me`);
