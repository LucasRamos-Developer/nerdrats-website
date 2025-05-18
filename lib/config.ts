export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://nerds-rats-hackathon.onrender.com/',
  endpoints: {
    rankings: {
      distance: '/rank-dist',
      keydowns: '/rank-keys'
    },
    auth: {
      login: '/auth/login',
      profile: '/auth/profile'
    },
    badges: '/badges'
  }
}