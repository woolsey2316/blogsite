import { apiRequest, clearTokens, setTokens } from './client'
import type { AuthTokens, User } from '../types'

interface LoginResponse extends AuthTokens {
  user: User
}

interface RegisterData {
  username: string
  email: string
  password1: string
  password2: string
}

export async function login(
  username: string,
  password: string,
): Promise<User> {
  const data = await apiRequest<LoginResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setTokens(data.access, data.refresh)
  return data.user
}

export async function register(form: RegisterData): Promise<User> {
  const data = await apiRequest<LoginResponse>('/api/auth/registration/', {
    method: 'POST',
    body: JSON.stringify(form),
  })
  setTokens(data.access, data.refresh)
  return data.user
}

export async function logout(): Promise<void> {
  const refresh = localStorage.getItem('refreshToken')
  try {
    if (refresh) {
      await apiRequest('/api/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      })
    }
  } finally {
    clearTokens()
  }
}

export async function fetchCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/auth/user/')
}
