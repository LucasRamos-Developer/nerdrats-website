"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Badge } from "@/lib/types"

type LastAchievement = {
  badgeName: string
  nerdTaunt: string
  badgeIcon: string
}

interface AchievementContextType {
  lastAchievement: LastAchievement | null
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined)

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [lastAchievement, setLastAchievement] = useState<LastAchievement | null>(null)

  useEffect(() => {
    // Verificar se o usuário está logado
    const storedUser = sessionStorage.getItem("nerdrats_user")
    if (!storedUser) {
      return;
    }

    const loadBadges = async () => {
      try {
        // Importar o arquivo de badges
        const badgeModule = await import("@/lib/badge.json")
        const badgeData = badgeModule.default || { distance: [], keydowns: [] }
        
        const userData = JSON.parse(storedUser)
        const userDistance = userData.quant_dist || 0
        const userKeydowns = userData.quant_keys || 0
        
        // Obter todos os badges
        const distanceBadges = badgeData.distance || []
        const keydownsBadges = badgeData.keydowns || []
        
        // Filtrar badges conquistados
        const earnedDistanceBadges = distanceBadges.filter(
          (badge: Badge) => userDistance >= (badge.distance || 0)
        )
        const earnedKeydownsBadges = keydownsBadges.filter(
          (badge: Badge) => userKeydowns >= (badge.keydowns || 0)
        )
        
        // Encontrar o último badge conquistado (o mais difícil)
        let lastBadge: Badge | null = null
        
        if (earnedDistanceBadges.length > 0) {
          const lastDistanceBadge = [...earnedDistanceBadges].sort(
            (a, b) => (b.distance || 0) - (a.distance || 0)
          )[0]
          lastBadge = lastDistanceBadge
        }
        
        if (earnedKeydownsBadges.length > 0) {
          const lastKeydownsBadge = [...earnedKeydownsBadges].sort(
            (a, b) => (b.keydowns || 0) - (a.keydowns || 0)
          )[0]
          
          // Se não houver badge de distância ou o de teclas for "mais difícil" (maior percentual concluído)
          if (!lastBadge || 
              (lastKeydownsBadge.keydowns && userKeydowns / lastKeydownsBadge.keydowns > 
               (lastBadge.distance && userDistance / lastBadge.distance || 0))) {
            lastBadge = lastKeydownsBadge
          }
        }
        
        // Definir a última conquista para exibir no popup
        if (lastBadge) {
          setLastAchievement({
            badgeName: lastBadge.name,
            nerdTaunt: lastBadge.nerdTaunt,
            badgeIcon: lastBadge.badge
          })
        }
      } catch (error) {
        console.error("Erro ao carregar conquistas:", error)
      }
    }
    
    loadBadges()
  }, [])
  
  return (
    <AchievementContext.Provider value={{ lastAchievement }}>
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievement() {
  const context = useContext(AchievementContext)
  if (context === undefined) {
    throw new Error("useAchievement must be used within an AchievementProvider")
  }
  return context
}