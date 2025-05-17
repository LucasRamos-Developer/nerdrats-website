"use client"

import { useState, useEffect } from "react"
import { Trophy, Award, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { fetchRankingData } from "@/lib/api"
import type { RankingEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RankingTableProps {
  type: "distancia" | "teclas"
}

export default function RankingTable({ type }: RankingTableProps) {
  const [data, setData] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchRankingData(type)
        setData(result)
      } catch (error) {
        console.error("Falha ao buscar dados do ranking:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [type])

  if (loading) {
    return <div className="flex justify-center py-8">Carregando rankings...</div>
  }

  return (
    <div className="space-y-4">
      {data.map((entry, index) => (
        <div
          key={entry.id}
          className={cn(
            "bg-white border rounded-lg p-4 flex items-center",
            index < 3 ? "border-primary" : "border-gray-200",
          )}
        >
          {index === 0 && <Trophy className="h-6 w-6 text-primary mr-4" />}
          {index === 1 && <Award className="h-6 w-6 text-primary mr-4" />}
          {index === 2 && <Award className="h-6 w-6 text-primary mr-4" />}
          {index > 2 && <span className="w-10 text-center font-medium text-gray-500 mr-4">{index + 1}</span>}

          <div className="flex-shrink-0 w-8 font-medium text-gray-600">{entry.initials}</div>

          <div className="flex-grow">
            <div className="font-medium">{entry.username}</div>
            <div className="text-xs text-gray-500">Carregando badges...</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 text-gray-400"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
              <span className="font-medium">{type === "distancia" ? entry.distance : entry.words}</span>
              <span className="text-xs text-gray-500 ml-1">KM</span>
            </div>

            <div
              className={cn(
                "ml-4 text-xs px-2 py-0.5 rounded flex items-center gap-1",
                entry.status === "subiu"
                  ? "text-green-600"
                  : entry.status === "desceu"
                    ? "text-red-600"
                    : "text-blue-600",
              )}
            >
              {entry.status === "subiu" && <ArrowUp className="h-3 w-3" />}
              {entry.status === "desceu" && <ArrowDown className="h-3 w-3" />}
              {entry.status === "manteve" && <Minus className="h-3 w-3" />}
              <span>{entry.status === "subiu" ? "Subiu" : entry.status === "desceu" ? "Desceu" : "Manteve"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
