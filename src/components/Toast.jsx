import { useState, useEffect } from 'react'

function Toast({ message, onDone }) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const t = setTimeout(() => {
            setVisible(false)
            setTimeout(onDone, 300)
        }, 2500)
        return () => clearTimeout(t)
    }, [onDone])

    return (
        <div className={`toast ${visible ? 'toast--visible' : 'toast--hidden'}`} role="status" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{message}</span>
        </div>
    )
}

export default Toast
