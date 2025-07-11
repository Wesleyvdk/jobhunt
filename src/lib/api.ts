import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

class ApiClient {
  private async getAuthHeaders() {
    const session = await getSession()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Handle NextAuth session token
    if (session?.user) {
      // For now, we'll use the session itself as auth proof
      // In production, you'd get a proper JWT from NextAuth
      headers.Authorization = `Bearer ${(session as any).accessToken || 'session-token'}`
    }
    
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data || data
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })
    return this.handleResponse<T>(response)
  }
}

export const api = new ApiClient() 