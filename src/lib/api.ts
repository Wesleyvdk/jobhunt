import { getSession } from 'next-auth/react'

const API_BASE_URL = '/api'

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

  async exportJobs(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/jobs/export`, {
      method: 'GET',
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Export failed' }))
      throw new Error(errorData.error || `Export failed! status: ${response.status}`)
    }
    
    return response.blob()
  }
}

export const api = new ApiClient() 