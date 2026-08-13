import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout, loading } = useAuth()

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="site-title">
          Blog
        </Link>
        <nav className="site-nav">
          <Link to="/">Posts</Link>
          {loading ? null : user ? (
            <>
              <span className="nav-user">Hi, {user.username}</span>
              <button type="button" className="btn btn-ghost" onClick={() => void logout()}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
    </div>
  )
}
