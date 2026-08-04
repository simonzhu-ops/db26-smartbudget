import { useEffect } from 'react'
import { link } from "react-router-dom"

/** PROVIDED – reusable UI feedback components */

export function Spinner() {
  return <div className="spinner-wrapper"><div className="spinner" /></div>
}

export function ErrorMessage({ message }) {
  return <p style={{ color: 'var(--danger)', padding: '1rem', textAlign: 'center' }}>[Warning] {message}</p>
}

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [onClose])
  return <div className={`toast toast--${type}`}>{message}</div>
}

/** Yellow banner shown on pages still using mock data */
export function TodoBanner({ ticket, task }) {
  return (
    <div className="todo-banner">
      [TODO] <strong>{ticket}:</strong> {task}
    </div>
  )
}

export default function EmptyState({ title, body, ctaLabel, ctaTo, onCtaClick }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{body}</p>
      {ctaLabel && (
        ctaTo && ctaTo !== "#" ? (
          <Link to={ctaTo} className="btn-primary">{ctaLabel}</Link>
        ) : (
          <button onClick={onCtaClick} className="btn-primary">{ctaLabel}</button>
        )
      )}
    </div>
  );
}
