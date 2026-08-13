import { apiRequest } from './client'
import type { PaginatedResponse, Post } from '../types'

export async function fetchPosts(page = 1): Promise<PaginatedResponse<Post>> {
  return apiRequest<PaginatedResponse<Post>>(`/api/posts/?page=${page}`)
}

export async function fetchPost(id: number): Promise<Post> {
  return apiRequest<Post>(`/api/posts/${id}/`)
}
