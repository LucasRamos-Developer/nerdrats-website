"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserBadgesProps {
  userDistance: number
  showAll?: boolean
  reverseOrder?: boolean
}

export default function UserBadges({ userDistance, showAll = false, reverseOrder = true }: UserBadgesProps) {
  const [earnedBadges, setEarnedBadges] = useState<any[]>([])
  const [allBadges, setAllBadges] = useState<any[]>([])

  useEffect(() => {
    // Função para carregar os badges do arquivo JSON
    const loadBadges = async () => {
      try {
        // Importar o arquivo de badges dinamicamente
        const badgeModule = await import("@/lib/badge.json")
        const badgeData = badgeModule.default || []

        // Filtrar badges que o usuário ganhou com base na distância
        const badges = badgeData.filter((badge: any) => userDistance >= badge.distance)

        // Guardar todos os badges para exibição na página de perfil
        setAllBadges(badgeData)

        // Definir os badges conquistados
        setEarnedBadges(badges)
      } catch (error) {
        console.error("Erro ao carregar badges:", error)
        setEarnedBadges([])
        setAllBadges([])
      }
    }

    loadBadges()
  }, [userDistance])

  // Se não for para mostrar todos e não houver badges conquistados, não exibe nada
  if (!showAll && earnedBadges.length === 0) return null

  // Se for para mostrar todos os badges (página de perfil)
  if (showAll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allBadges.map((badge, index) => {
              const isEarned = userDistance >= badge.distance

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex flex-col items-center p-3 rounded-lg border ${
                          isEarned ? "bg-primary/10 border-primary/30" : "bg-slate-100 border-slate-200 opacity-60"
                        }`}
                      >
                        <div className="text-3xl mb-2">{badge.badge}</div>
                        <div className="text-sm font-medium text-center">{badge.name}</div>
                        <div className="text-xs text-muted-foreground text-center mt-1">{badge.distance} km</div>
                        {!isEarned && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Bloqueado
                          </Badge>
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
                            Percorra mais {(badge.distance - userDistance).toFixed(1)} km para desbloquear este badge!
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
    )
  }

  // Exibição padrão para cards de ranking (mostra apenas badges conquistados)
  // Se reverseOrder for true, mostra os badges em ordem inversa (último conquistado primeiro)
  const badgesToShow = reverseOrder
    ? [...earnedBadges].sort((a, b) => b.distance - a.distance).slice(0, 3)
    : earnedBadges.slice(0, 3)

  return (
    <div className="flex gap-1">
      {badgesToShow.map((badge, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="px-1.5 py-0 text-xs border-primary/30 bg-primary/10">
                {badge.badge}
              </Badge>
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
      {earnedBadges.length > 3 && (
        <Badge variant="outline" className="px-1.5 py-0 text-xs border-primary/30 bg-primary/10">
          +{earnedBadges.length - 3}
        </Badge>
      )}
    </div>
  )
}
