"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface UserBadgesProps {
  userDistance?: number
  userKeydowns?: number
  showAll?: boolean
  reverseOrder?: boolean
  showOnlyLast?: boolean
  type?: "distance" | "keydowns" | "all"
}

interface BadgeData {
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

export default function UserBadges({
  userDistance = 0,
  userKeydowns = 0,
  showAll = false,
  reverseOrder = true,
  showOnlyLast = true,
  type = "all",
}: UserBadgesProps) {
  const [earnedDistanceBadges, setEarnedDistanceBadges] = useState<BadgeData[]>([])
  const [earnedKeydownsBadges, setEarnedKeydownsBadges] = useState<BadgeData[]>([])
  const [allDistanceBadges, setAllDistanceBadges] = useState<BadgeData[]>([])
  const [allKeydownsBadges, setAllKeydownsBadges] = useState<BadgeData[]>([])
  const [lastDistanceBadge, setLastDistanceBadge] = useState<BadgeData | null>(null)
  const [lastKeydownsBadge, setLastKeydownsBadge] = useState<BadgeData | null>(null)

  useEffect(() => {
    // Função para carregar os badges do arquivo JSON
    const loadBadges = async () => {
      try {
        // Importar o arquivo de badges dinamicamente
        const badgeModule = await import("@/lib/badge.json")
        const badgeData = badgeModule.default || { distance: [], keydowns: [] }

        // Processar badges de distância
        const distanceBadges = badgeData.distance || []
        setAllDistanceBadges(distanceBadges)

        // Filtrar badges de distância que o usuário ganhou
        const earnedDistance = distanceBadges.filter((badge: BadgeData) => userDistance >= (badge.distance || 0))
        setEarnedDistanceBadges(earnedDistance)

        // Encontrar o último badge de distância conquistado (o de maior distância)
        if (earnedDistance.length > 0) {
          const sortedBadges = [...earnedDistance].sort((a, b) => (b.distance || 0) - (a.distance || 0))
          setLastDistanceBadge(sortedBadges[0])
        } else {
          setLastDistanceBadge(null)
        }

        // Processar badges de teclas digitadas
        const keydownsBadges = badgeData.keydowns || []
        setAllKeydownsBadges(keydownsBadges)

        // Filtrar badges de teclas que o usuário ganhou
        const earnedKeydowns = keydownsBadges.filter((badge: BadgeData) => userKeydowns >= (badge.keydowns || 0))
        setEarnedKeydownsBadges(earnedKeydowns)

        // Encontrar o último badge de teclas conquistado (o de maior quantidade)
        if (earnedKeydowns.length > 0) {
          const sortedBadges = [...earnedKeydowns].sort((a, b) => (b.keydowns || 0) - (a.keydowns || 0))
          setLastKeydownsBadge(sortedBadges[0])
        } else {
          setLastKeydownsBadge(null)
        }
      } catch (error) {
        console.error("Erro ao carregar badges:", error)
        setEarnedDistanceBadges([])
        setAllDistanceBadges([])
        setLastDistanceBadge(null)
        setEarnedKeydownsBadges([])
        setAllKeydownsBadges([])
        setLastKeydownsBadge(null)
      }
    }

    loadBadges()
  }, [userDistance, userKeydowns])

  // Se não for para mostrar todos e não houver badges conquistados, não exibe nada
  const hasEarnedDistanceBadges = earnedDistanceBadges.length > 0
  const hasEarnedKeydownsBadges = earnedKeydownsBadges.length > 0

  if (!showAll && !hasEarnedDistanceBadges && !hasEarnedKeydownsBadges) {
    return null
  }

  // Se for para mostrar todos os badges (página de perfil)
  if (showAll) {
    return (
      <div className="space-y-8">
        {(type === "all" || type === "distance") && (
          <Card>
            <CardHeader>
              <CardTitle>Badges de Distância</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allDistanceBadges
                  .sort((a, b) => reverseOrder 
                    ? (b.distance || 0) - (a.distance || 0) // Ordenar do maior para o menor se reverseOrder for true
                    : (a.distance || 0) - (b.distance || 0)) // Mostrar todos os badges (incluindo não conquistados)
                  .map((badge) => {
                    const isEarned = userDistance >= (badge.distance || 0);
                    const isLastEarned = isEarned && lastDistanceBadge && badge.distance === lastDistanceBadge.distance;

                    return (
                      <TooltipProvider key={`distance-${badge.name}-${badge.distance}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`flex flex-col items-center p-3 rounded-lg border ${
                              isLastEarned
                                ? "bg-primary/20 border-primary shadow-md"
                                : isEarned
                                  ? "bg-primary/10 border-primary/30"
                                  : "bg-gray-100 border-gray-200 opacity-50"
                            }`}>
                              <div className={`mb-2 text-4xl ${!isEarned ? "grayscale" : ""}`}>
                                {badge.badge}
                              </div>
                              <div className="text-sm font-medium text-center">{badge.name}</div>
                              <div className="text-xs text-muted-foreground text-center mt-1">{badge.distance} km</div>
                              {isLastEarned && (
                                <Badge className="mt-2 text-xs bg-primary text-primary-foreground">Último</Badge>
                              )}
                              {!isEarned && (
                                <Badge className="mt-2 text-xs bg-gray-200 text-gray-500">Bloqueado</Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-bold">{badge.name}</p>
                              <p className="text-xs">{badge.description}</p>
                              {isEarned ? (
                                <>
                                  <p className="text-xs mt-2 text-primary font-medium">Fato divertido:</p>
                                  <p className="text-xs italic">{badge.funFact}</p>
                                  <p className="text-xs mt-1 text-primary font-medium">Provocação nerd:</p>
                                  <p className="text-xs italic">{badge.nerdTaunt}</p>
                                </>
                              ) : (
                                <p className="text-xs mt-2 text-gray-500 italic">
                                  Percorra mais {((badge.distance || 0) - userDistance).toFixed(1)} km para desbloquear este badge!
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {(type === "all" || type === "keydowns") && (
          <Card>
            <CardHeader>
              <CardTitle>Badges de Teclas Digitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allKeydownsBadges
                  .sort((a, b) => (b.keydowns || 0) - (a.keydowns || 0)) // Ordenar do maior para o menor
                  // Mostrar todos os badges (incluindo não conquistados)
                  .map((badge) => {
                    const isEarned = userKeydowns >= (badge.keydowns || 0);
                    const isLastEarned = isEarned && lastKeydownsBadge && badge.keydowns === lastKeydownsBadge.keydowns;

                    return (
                      <TooltipProvider key={`keydowns-${badge.name}-${badge.keydowns}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`flex flex-col items-center p-3 rounded-lg border ${
                              isLastEarned
                                ? "bg-primary/20 border-primary shadow-md"
                                : isEarned
                                  ? "bg-primary/10 border-primary/30"
                                  : "bg-gray-100 border-gray-200 opacity-50"
                            }`}>
                              <div className={`mb-2 text-4xl ${!isEarned ? "grayscale" : ""}`}>
                                {badge.badge}
                              </div>
                              <div className="text-sm font-medium text-center">{badge.name}</div>
                              <div className="text-xs text-muted-foreground text-center mt-1">
                                {(badge.keydowns || 0).toLocaleString()} teclas
                              </div>
                              {isLastEarned && (
                                <Badge className="mt-2 text-xs bg-primary text-primary-foreground">Último</Badge>
                              )}
                              {!isEarned && (
                                <Badge className="mt-2 text-xs bg-gray-200 text-gray-500">Bloqueado</Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-bold">{badge.name}</p>
                              <p className="text-xs">{badge.description}</p>
                              {isEarned ? (
                                <>
                                  <p className="text-xs mt-2 text-primary font-medium">Fato divertido:</p>
                                  <p className="text-xs italic">{badge.funFact}</p>
                                  <p className="text-xs mt-1 text-primary font-medium">Provocação nerd:</p>
                                  <p className="text-xs italic">{badge.nerdTaunt}</p>
                                </>
                              ) : (
                                <p className="text-xs mt-2 text-gray-500 italic">
                                  Digite mais {((badge.keydowns || 0) - userKeydowns).toLocaleString()} teclas para desbloquear este badge!
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Se for para mostrar apenas o último badge conquistado
  if (showOnlyLast) {
    // Determinar quais badges mostrar com base no tipo
    let badgesToShow: BadgeData[] = []

    if (type === "distance") {
      badgesToShow = [...earnedDistanceBadges].sort((a, b) => (b.distance || 0) - (a.distance || 0)).slice(0, 3)
    } else if (type === "keydowns") {
      badgesToShow = [...earnedKeydownsBadges].sort((a, b) => (b.keydowns || 0) - (a.keydowns || 0)).slice(0, 3)
    } else {
      // Se for "all", combinar os dois tipos e pegar os 3 mais recentes
      const combinedBadges = [...earnedDistanceBadges, ...earnedKeydownsBadges]
      
      // Ordenar por "recência" (maior valor relativo)
      badgesToShow = combinedBadges
        .sort((a, b) => {
          const aValue = a.distance ? userDistance / a.distance : a.keydowns ? userKeydowns / a.keydowns : 0
          const bValue = b.distance ? userDistance / b.distance : b.keydowns ? userKeydowns / b.keydowns : 0
          return bValue - aValue
        })
        .slice(0, 3)
    }

    if (badgesToShow.length > 0) {
      return (
        <div className="flex gap-1">
          {badgesToShow.map((badge, index) => (
            <TooltipProvider key={`${badge.name}-${badge.distance || badge.keydowns || index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-base" key={`badge-emoji-${badge.name}-${badge.distance || badge.keydowns || index}`}>
                    {badge.badge}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-xs">{badge.description}</p>
                    <p className="text-xs mt-1 italic">{badge.nerdTaunt}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )
    }

    return null
  }

  // Exibição padrão para cards de ranking (mostra apenas badges conquistados)
  // Determinar quais badges mostrar com base no tipo
  let badgesToShow: BadgeData[] = []

  if (type === "distance") {
    // Quando reverseOrder é false, queremos os 3 primeiros badges (os últimos conquistados)
    // pois eles estarão ordenados do menor para o maior (os mais fáceis de conquistar, ou seja, os primeiros conquistados)
    badgesToShow = reverseOrder
      ? [...earnedDistanceBadges].sort((a, b) => (b.distance || 0) - (a.distance || 0)).slice(0, 3)
      : [...earnedDistanceBadges].sort((a, b) => (a.distance || 0) - (b.distance || 0)).slice(0, 3)
  } else if (type === "keydowns") {
    badgesToShow = reverseOrder
      ? [...earnedKeydownsBadges].sort((a, b) => (b.keydowns || 0) - (a.keydowns || 0)).slice(0, 3)
      : [...earnedKeydownsBadges].sort((a, b) => (a.keydowns || 0) - (b.keydowns || 0)).slice(0, 3)
  } else {
    // Se for "all", combinar os dois tipos e pegar os 3 mais recentes
    const combinedBadges = [...earnedDistanceBadges, ...earnedKeydownsBadges]

    // Ordenar por "recência" (maior valor relativo)
    // Isso é uma simplificação, você pode querer uma lógica mais sofisticada
    badgesToShow = reverseOrder
      ? combinedBadges
          .sort((a, b) => {
            const aValue = a.distance ? a.distance : a.keydowns ? a.keydowns : 0
            const bValue = b.distance ? b.distance : b.keydowns ? b.keydowns : 0
            return bValue - aValue
          })
          .slice(0, 3)
      : combinedBadges
          .sort((a, b) => {
            const aValue = a.distance ? a.distance : a.keydowns ? a.keydowns : 0
            const bValue = b.distance ? b.distance : b.keydowns ? b.keydowns : 0
            return aValue - bValue
          })
          .slice(0, 3)
  }

  return (
    <div className="flex gap-1">
      {badgesToShow.map((badge, index) => (
        <TooltipProvider key={`${badge.name}-${badge.distance || badge.keydowns || index}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-2xl" key={`badge-icon-${badge.name}-${badge.distance || badge.keydowns || index}`}>
                {badge.badge}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-bold">{badge.name}</p>
                <p className="text-xs">{badge.description}</p>
                <p className="text-xs mt-1 italic">{badge.nerdTaunt}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {type === "distance" && earnedDistanceBadges.length > 3 && (
        <Badge variant="outline" className="px-1.5 py-0 text-xs border-primary/30 bg-primary/10">
          +{earnedDistanceBadges.length - 3}
        </Badge>
      )}

      {type === "keydowns" && earnedKeydownsBadges.length > 3 && (
        <Badge variant="outline" className="px-1.5 py-0 text-xs border-primary/30 bg-primary/10">
          +{earnedKeydownsBadges.length - 3}
        </Badge>
      )}

      {type === "all" && earnedDistanceBadges.length + earnedKeydownsBadges.length > 3 && (
        <Badge variant="outline" className="px-1.5 py-0 text-xs border-primary/30 bg-primary/10">
          +{earnedDistanceBadges.length + earnedKeydownsBadges.length - 3}
        </Badge>
      )}
    </div>
  )
}
