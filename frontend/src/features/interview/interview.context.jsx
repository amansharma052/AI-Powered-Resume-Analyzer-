import { createContext, useState } from "react"

/**
 * Layer 3 — Interview Context
 * Provides global interview state (report, reports, loading) to the app.
 * InterviewProvider wraps the routes that need interview data.
 */

export const InterviewContext = createContext(null)

export function InterviewProvider({ children }) {
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(false)

    return (
        <InterviewContext.Provider value={{ report, setReport, reports, setReports, loading, setLoading }}>
            {children}
        </InterviewContext.Provider>
    )
}
