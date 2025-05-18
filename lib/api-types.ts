export interface User {
  id: string
  email: string
  name: string
  initials: string
  avatar?: string
  memberSince: string
  lastActivity: string
  distance: {
    current: number
    position: number
    bestPosition: number
    change: "subiu" | "desceu" | "manteve"
  }
  keydowns: {
    total: number
    position: number 
    wpm: number
    change: "subiu" | "desceu" | "manteve"
  }
}

export interface RankingEntry {
  id: string
  username: string
  initials: string
  distance?: number
  words?: number
  status: "subiu" | "desceu" | "manteve"
}

export interface Badge {
  name: string
  distance?: number
  keydowns?: number
  badge: string
  icon: string
  description: string
  kcal?: number
  wpm?: number
  item?: string
  funFact: string
  motivation: string
  nerdTaunt: string
}

export interface LoginResponse {
  user: User
  token: string
}