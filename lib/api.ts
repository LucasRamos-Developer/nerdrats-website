import type { RankingEntry } from "./types"
import { API_CONFIG } from "./config"

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const baseUrl = API_CONFIG.baseUrl.endsWith('/')
    ? API_CONFIG.baseUrl.slice(0, -1)
    : API_CONFIG.baseUrl
  
  const formattedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`

  const url = `${baseUrl}${formattedEndpoint}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error)
    throw error
  }
}

export async function fetchRankingData(type: "distancia" | "teclas"): Promise<RankingEntry[]> {
  const endpoint = type === "distancia" 
    ? API_CONFIG.endpoints.rankings.distance 
    : API_CONFIG.endpoints.rankings.keydowns

  try {
    const data = await fetchFromApi<RankingEntry[]>(endpoint)
    return data
  } catch (error) {
    console.error(`Erro ao buscar ranking de ${type}:`, error)
    return []
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    return response.ok
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return false
  }
}
