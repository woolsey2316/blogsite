const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  const response = await fetch('/api/auth/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    clearTokens()
    return null
  }

  const data = (await response.json()) as { access: string }
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
  return data.access
}

export class ApiError extends Error {
  status: number
  data?: Record<string, unknown>

  constructor(
    message: string,
    status: number,
    data?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const accessToken = getAccessToken()
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(path, { ...options, headers })

  if (response.status === 401 && retry && getRefreshToken()) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      return apiRequest<T>(path, options, false)
    }
  }

  if (!response.ok) {
    let data: Record<string, unknown> | undefined
    try {
      data = (await response.json()) as Record<string, unknown>
    } catch {
      data = undefined
    }
    const message =
      typeof data?.detail === 'string'
        ? data.detail
        : `Request failed with status ${response.status}`
    throw new ApiError(message, response.status, data)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
