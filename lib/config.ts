export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://api.exemplo.com',
  endpoints: {
    rankings: {
      distance: '/rankings/distance',
      keydowns: '/rankings/keydowns'
    },
    auth: {
      login: '/auth/login',
      profile: '/auth/profile'
    },
    badges: '/badges'
  }
}