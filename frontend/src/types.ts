export interface User {
  pk: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface Comment {
  id: number
  name: string
  email: string
  body: string
  created: string
}

export interface Post {
  id: number
  title: string
  slug: string
  author: string
  body: string
  publish: string
  created: string
  updated: string
  status: string
  tags: string[]
  comments: Comment[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
