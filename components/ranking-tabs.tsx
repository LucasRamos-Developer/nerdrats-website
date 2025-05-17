"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Route, Keyboard } from "lucide-react"
import DistanceRankingCard from "./distance-ranking-card"
import KeydownRankingCard from "./keydown-ranking-card"
import { fetchRankingData } from "@/lib/api"

export default function RankingTabs() {
  const [distanceData, setDistanceData] = useState<any[]>([])
  const [keydownData, setKeydownData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const distanceResult = await fetchRankingData("distancia")
        const keydownResult = await fetchRankingData("teclas")

        // Transformar os dados para o formato esperado pelos componentes de card
        const formattedDistanceData = distanceResult.map((user) => ({
          id: Number.parseInt(user.id),
          name: user.username,
          distance: user.distance || 0,
          unit: "km",
          avatar: `/placeholder.svg?height=40&width=40&text=${user.initials}`,
          change: user.status === "subiu" ? "up" : user.status === "desceu" ? "down" : "same",
        }))

        const formattedKeydownData = keydownResult.map((user) => ({
          id: Number.parseInt(user.id),
          name: user.username,
          keydowns: user.words || 0,
          wpm: Math.floor((user.words || 0) / 5), // Estimativa simples de WPM
          avatar: `/placeholder.svg?height=40&width=40&text=${user.initials}`,
          change: user.status === "subiu" ? "up" : user.status === "desceu" ? "down" : "same",
        }))

        setDistanceData(formattedDistanceData)
        setKeydownData(formattedKeydownData)
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
              <DistanceRankingCard key={player.id} player={player} index={index} />
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
              <KeydownRankingCard key={player.id} player={player} index={index} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
