import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../api/posts'
import type { Post } from '../types'

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchPosts(page)
        setPosts(data.results)
        setTotalPages(Math.max(1, Math.ceil(data.count / 3)))
      } catch {
        setError('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }
    void loadPosts()
  }, [page])

  if (loading) {
    return <p className="status-message">Loading posts…</p>
  }

  if (error) {
    return <p className="form-error">{error}</p>
  }

  return (
    <section className="post-list">
      <h1>Posts</h1>
      {posts.length === 0 ? (
        <p className="status-message">No published posts yet.</p>
      ) : (
        <ul className="post-list-items">
          {posts.map((post) => (
            <li key={post.id} className="post-list-item">
              <Link to={`/posts/${post.id}`} className="post-list-link">
                <h2>{post.title}</h2>
                <p className="post-meta">
                  By {post.author} · {formatDate(post.publish)}
                </p>
                {post.tags.length > 0 ? (
                  <ul className="tag-list">
                    {post.tags.map((tag) => (
                      <li key={tag} className="tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 ? (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  )
}
