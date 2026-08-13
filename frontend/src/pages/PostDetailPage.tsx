import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPost } from '../api/posts'
import type { Post } from '../types'

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PostDetailPage() {
  const { id } = useParams()
  const postId = Number(id)
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!postId) {
      setError('Invalid post')
      setLoading(false)
      return
    }

    async function loadPost() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchPost(postId)
        setPost(data)
      } catch {
        setError('Post not found')
      } finally {
        setLoading(false)
      }
    }
    void loadPost()
  }, [postId])

  if (loading) {
    return <p className="status-message">Loading post…</p>
  }

  if (error || !post) {
    return (
      <section className="post-detail">
        <p className="form-error">{error || 'Post not found'}</p>
        <Link to="/" className="back-link">
          ← Back to posts
        </Link>
      </section>
    )
  }

  return (
    <article className="post-detail">
      <Link to="/" className="back-link">
        ← Back to posts
      </Link>
      <header className="post-header">
        <h1>{post.title}</h1>
        <p className="post-meta">
          By {post.author} · Published {formatDate(post.publish)}
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
      </header>
      <div className="post-body">{post.body}</div>
      <section className="comments-section">
        <h2>
          {post.comments.length} comment{post.comments.length === 1 ? '' : 's'}
        </h2>
        {post.comments.length === 0 ? (
          <p className="status-message">No comments yet.</p>
        ) : (
          <ul className="comment-list">
            {post.comments.map((comment) => (
              <li key={comment.id} className="comment">
                <p className="comment-meta">
                  <strong>{comment.name}</strong> · {formatDate(comment.created)}
                </p>
                <p className="comment-body">{comment.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}
