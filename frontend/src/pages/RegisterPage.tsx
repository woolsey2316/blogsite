import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

function formatFieldErrors(data?: Record<string, unknown>): string {
  if (!data) return 'Registration failed'
  const messages: string[] = []
  for (const [field, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      messages.push(`${field}: ${value.join(' ')}`)
    } else if (typeof value === 'string') {
      messages.push(value)
    }
  }
  return messages.join(' ') || 'Registration failed'
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(username, email, password1, password2)
      navigate('/')
    } catch (err) {
      setError(
        err instanceof ApiError ? formatFieldErrors(err.data) : 'Registration failed',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Register</h1>
      <p className="auth-subtitle">Create a new account</p>
      <form onSubmit={(event) => void handleSubmit(event)} className="auth-form">
        {error ? <p className="form-error">{error}</p> : null}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password1}
            onChange={(event) => setPassword1(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={password2}
            onChange={(event) => setPassword2(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
