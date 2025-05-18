"use client"

import { useAchievement } from "@/contexts/achievement-context"
import AchievementPopup from "@/components/achievement-popup"

export default function AchievementPopupWrapper() {
  const { lastAchievement } = useAchievement()
  
  // Conquista padrão para sempre mostrar algo
  const defaultAchievement = {
    badgeName: "NerdRats",
    nerdTaunt: "Bem-vindo ao mundo dos ratos nerds!",
    badgeIcon: "🐀"
  }
  
  // Use a conquista do contexto ou a padrão
  const achievementToShow = lastAchievement || defaultAchievement

  return (
    <AchievementPopup
      badgeName={achievementToShow.badgeName}
      nerdTaunt={achievementToShow.nerdTaunt}
      badgeIcon={achievementToShow.badgeIcon}
    />
  )
}