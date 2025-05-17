import type { RankingEntry } from "./types"

// Dados de exemplo
const users = [
  { id: "1", name: "Carlos Silva", initials: "CA", distance: 42.5, status: "subiu" },
  { id: "2", name: "Ana Oliveira", initials: "AN", distance: 38.7, status: "desceu" },
  { id: "3", name: "Pedro Santos", initials: "PE", distance: 35.2, status: "subiu" },
  { id: "4", name: "Mariana Costa", initials: "MA", distance: 33.8, status: "manteve" },
  { id: "5", name: "João Pereira", initials: "JO", distance: 31.5, status: "subiu" },
  { id: "6", name: "Luisa Fernandes", initials: "LU", distance: 29.3, status: "desceu" },
  { id: "7", name: "Ricardo Almeida", initials: "RI", distance: 27.8, status: "subiu" },
  { id: "8", name: "Beatriz Lima", initials: "BE", distance: 25.4, status: "manteve" },
  { id: "9", name: "Gabriel Martins", initials: "GA", distance: 23.9, status: "desceu" },
  { id: "10", name: "Sofia Rodrigues", initials: "SO", distance: 22.1, status: "subiu" },
]

// Esta função seria substituída por chamadas reais à API em uma aplicação real
export async function fetchRankingData(type: "distancia" | "teclas"): Promise<RankingEntry[]> {
  // Simula um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Converte os dados de exemplo para o formato RankingEntry
  const data: RankingEntry[] = users.map((user) => {
    if (type === "distancia") {
      return {
        id: user.id,
        username: user.name,
        initials: user.initials,
        distance: user.distance,
        status: user.status as "subiu" | "desceu" | "manteve",
      }
    } else {
      // Para as teclas, geramos números aleatórios
      return {
        id: user.id,
        username: user.name,
        initials: user.initials,
        words: Math.floor(Math.random() * 10000) + 1000,
        status: user.status as "subiu" | "desceu" | "manteve",
      }
    }
  })

  return data
}

export async function login(username: string, password: string): Promise<boolean> {
  // Simula um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Em uma aplicação real, isto validaria as credenciais em um banco de dados
  return username.length > 0 && password.length > 0
}
