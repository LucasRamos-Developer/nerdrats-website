export interface RankingEntry {
  id: string
  username: string
  initials: string
  distance?: number
  words?: number
  status: "subiu" | "desceu" | "manteve"
}

export interface LoginCredentials {
  username: string
  password: string
}
