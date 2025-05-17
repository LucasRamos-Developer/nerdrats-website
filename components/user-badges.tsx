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

  if (!showAll && !hasEarnedDistanceBadges && !hasEarnedKeydownsBadges) return null

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
                {allDistanceBadges.map((badge, index) => {
                  const isEarned = userDistance >= (badge.distance || 0)
                  const isLastEarned = lastDistanceBadge && badge.distance === lastDistanceBadge.distance

                  return (
                    <TooltipProvider key={`distance-${index}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center p-3 rounded-lg border ${
                              isEarned
                                ? isLastEarned
                                  ? "bg-primary/20 border-primary shadow-md"
                                  : "bg-primary/10 border-primary/30"
                                : "bg-slate-100 border-slate-200 opacity-60"
                            }`}
                          >
                            <div className="mb-2 w-12 h-12 relative">
                              <Image
                                src={badge.icon || `/icons/badge-${badge.name.toLowerCase().replace(/\s+/g, "-")}.svg`}
                                alt={badge.name}
                                width={48}
                                height={48}
                                className={isEarned ? "" : "grayscale"}
                              />
                            </div>
                            <div className="text-sm font-medium text-center">{badge.name}</div>
                            <div className="text-xs text-muted-foreground text-center mt-1">{badge.distance} km</div>
                            {!isEarned && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                Bloqueado
                              </Badge>
                            )}
                            {isLastEarned && (
                              <Badge className="mt-2 text-xs bg-primary text-primary-foreground">Último</Badge>
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
                              <p className="text-xs mt-2 italic">
                                Percorra mais {((badge.distance || 0) - userDistance).toFixed(1)} km para desbloquear
                                este badge!
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
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
                {allKeydownsBadges.map((badge, index) => {
                  const isEarned = userKeydowns >= (badge.keydowns || 0)
                  const isLastEarned = lastKeydownsBadge && badge.keydowns === lastKeydownsBadge.keydowns

                  return (
                    <TooltipProvider key={`keydowns-${index}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center p-3 rounded-lg border ${
                              isEarned
                                ? isLastEarned
                                  ? "bg-primary/20 border-primary shadow-md"
                                  : "bg-primary/10 border-primary/30"
                                : "bg-slate-100 border-slate-200 opacity-60"
                            }`}
                          >
                            <div className="mb-2 w-12 h-12 relative">
                              <Image
                                src={badge.icon || `/icons/badge-${badge.name.toLowerCase().replace(/\s+/g, "-")}.svg`}
                                alt={badge.name}
                                width={48}
                                height={48}
                                className={isEarned ? "" : "grayscale"}
                              />
                            </div>
                            <div className="text-sm font-medium text-center">{badge.name}</div>
                            <div className="text-xs text-muted-foreground text-center mt-1">
                              {(badge.keydowns || 0).toLocaleString()} teclas
                            </div>
                            {!isEarned && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                Bloqueado
                              </Badge>
                            )}
                            {isLastEarned && (
                              <Badge className="mt-2 text-xs bg-primary text-primary-foreground">Último</Badge>
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
                              <p className="text-xs mt-2 italic">
                                Digite mais {((badge.keydowns || 0) - userKeydowns).toLocaleString()} teclas para
                                desbloquear este badge!
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Se for para mostrar apenas o último badge conquistado
  if (showOnlyLast) {
    // Determinar qual badge mostrar com base no tipo
    let badgeToShow = null

    if (type === "distance" && lastDistanceBadge) {
      badgeToShow = lastDistanceBadge
    } else if (type === "keydowns" && lastKeydownsBadge) {
      badgeToShow = lastKeydownsBadge
    } else if (type === "all") {
      // Se for "all", mostrar o badge mais recente entre os dois tipos
      // Aqui estamos assumindo que o badge com maior valor relativo é o mais recente
      // Isso é uma simplificação, você pode querer uma lógica mais sofisticada

      const distanceProgress = lastDistanceBadge ? userDistance / (lastDistanceBadge.distance || 1) : 0

      const keydownsProgress = lastKeydownsBadge ? userKeydowns / (lastKeydownsBadge.keydowns || 1) : 0

      badgeToShow = distanceProgress > keydownsProgress ? lastDistanceBadge : lastKeydownsBadge
    }

    if (badgeToShow) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-6 h-6 relative inline-block">
                <Image
                  src={badgeToShow.icon || `/icons/badge-${badgeToShow.name.toLowerCase().replace(/\s+/g, "-")}.svg`}
                  alt={badgeToShow.name}
                  width={24}
                  height={24}
                  className="inline-block"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-bold">{badgeToShow.name}</p>
                <p className="text-xs">{badgeToShow.description}</p>
                <p className="text-xs mt-1 italic">{badgeToShow.nerdTaunt}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return null
  }

  // Exibição padrão para cards de ranking (mostra apenas badges conquistados)
  // Determinar quais badges mostrar com base no tipo
  let badgesToShow: BadgeData[] = []

  if (type === "distance") {
    badgesToShow = reverseOrder
      ? [...earnedDistanceBadges].sort((a, b) => (b.distance || 0) - (a.distance || 0)).slice(0, 3)
      : earnedDistanceBadges.slice(0, 3)
  } else if (type === "keydowns") {
    badgesToShow = reverseOrder
      ? [...earnedKeydownsBadges].sort((a, b) => (b.keydowns || 0) - (a.keydowns || 0)).slice(0, 3)
      : earnedKeydownsBadges.slice(0, 3)
  } else {
    // Se for "all", combinar os dois tipos e pegar os 3 mais recentes
    const combinedBadges = [...earnedDistanceBadges, ...earnedKeydownsBadges]

    // Ordenar por "recência" (maior valor relativo)
    // Isso é uma simplificação, você pode querer uma lógica mais sofisticada
    badgesToShow = reverseOrder
      ? combinedBadges
          .sort((a, b) => {
            const aValue = a.distance ? userDistance / a.distance : a.keydowns ? userKeydowns / a.keydowns : 0

            const bValue = b.distance ? userDistance / b.distance : b.keydowns ? userKeydowns / b.keydowns : 0

            return bValue - aValue
          })
          .slice(0, 3)
      : combinedBadges.slice(0, 3)
  }

  return (
    <div className="flex gap-1">
      {badgesToShow.map((badge, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-5 h-5 relative">
                <Image
                  src={badge.icon || `/icons/badge-${badge.name.toLowerCase().replace(/\s+/g, "-")}.svg`}
                  alt={badge.name}
                  width={20}
                  height={20}
                  className="inline-block"
                />
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
