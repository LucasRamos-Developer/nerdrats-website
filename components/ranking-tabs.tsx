"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Route, Keyboard } from "lucide-react"
import DistanceRankingCard from "./distance-ranking-card"
import KeydownRankingCard from "./keydown-ranking-card"
import { fetchRankingData } from "@/lib/api"
import type { RankingEntry } from "@/lib/types"

export default function RankingTabs() {
  const [distanceData, setDistanceData] = useState<RankingEntry[]>([])
  const [keydownData, setKeydownData] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  const getInitials = (name: string | undefined) => {
    if (!name) return "US"; // US para "User"
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarUrl = (avatar: string | undefined, initials: string | undefined, username: string | undefined) => {
    if (avatar) return avatar;
    const text = initials || getInitials(username);
    return `/placeholder.svg`;
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [distanceResult, keydownResult] = await Promise.all([
          fetchRankingData("distancia"),
          fetchRankingData("teclas"),
        ])

        setDistanceData(distanceResult)
        setKeydownData(keydownResult)
      } catch (error) {
        console.error("Falha ao buscar dados do ranking:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <Tabs defaultValue="distancia" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="distancia" className="flex items-center gap-2 data-[state=active]:bg-white">
          <Route className="h-4 w-4" />
          <span>Distância</span>
        </TabsTrigger>
        <TabsTrigger value="teclas" className="flex items-center gap-2 data-[state=active]:bg-white">
          <Keyboard className="h-4 w-4" />
          <span>Teclas</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="distancia">
        {loading ? (
          <div className="flex justify-center py-8">Carregando rankings...</div>
        ) : (
          <div className="space-y-4">
            {distanceData.map((player, index) => (
              <DistanceRankingCard
                key={player.id || player.user_github}
                player={{
                  user_github: player.user_github,
                  name: player.username,
                  quant_dist: player.quant_dist,
                  avatar: getAvatarUrl(player.avatar, player.initials, player.username),
                }}
                index={index}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="teclas">
        {loading ? (
          <div className="flex justify-center py-8">Carregando rankings...</div>
        ) : (
          <div className="space-y-4">
            {keydownData.map((player, index) => (
              <KeydownRankingCard
                key={player.id || player.user_github}
                player={{
                  id: Number(player.id) || undefined,
                  user_github: player.user_github,
                  name: player.username || player.user_github,
                  quant_keys: player.quant_keys || 0,
                  wpm: player.quant_keys ? Math.floor((player.quant_keys) / 5) : undefined,
                  avatar: getAvatarUrl(player.avatar, player.initials, player.username)
                }}
                index={index}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
