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
    bestPosition?: number
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
  id: string;
  username: string;
  user_github: string;
  email: string;
  initials: string;
  avatar?: string;
  distance?: number;
  words?: number;
  quant_clicks: number;
  quant_dist: number;
  quant_scrow: number;
  quant_keys: number;
  status: "subiu" | "desceu" | "manteve";
}

export interface LoginCredentials {
  username: string
  password: string
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
