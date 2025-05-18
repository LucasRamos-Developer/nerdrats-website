"use client"

import { useState, useEffect } from "react"
import { Play, Pause, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function TrackingControls() {
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const { toast } = useToast()

  // Efeito para controlar o temporizador
  useEffect(() => {
    let timer: NodeJS.Timer | null = null

    if (isTracking) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isTracking])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    setIsTracking(true)
    toast({
      title: "Rastreamento iniciado",
      description: "Suas atividades estão sendo monitoradas.",
    })
  }

  const handlePause = () => {
    setIsTracking(false)
    toast({
      title: "Rastreamento pausado",
      description: "Suas atividades não estão sendo monitoradas.",
    })
  }

  const handleStop = () => {
    setIsTracking(false)
    setElapsedTime(0)
    toast({
      title: "Rastreamento parado",
      description: "Suas atividades foram registradas.",
    })
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        {!isTracking ? (
          <Button onClick={handleStart} size="sm" className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-1" />
            Iniciar
          </Button>
        ) : (
          <Button onClick={handlePause} size="sm" variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
            <Pause className="h-4 w-4 mr-1" />
            Pausar
          </Button>
        )}
        <Button
          onClick={handleStop}
          size="sm"
          variant="outline"
          className="border-red-500 text-red-700 hover:bg-red-50"
          disabled={!isTracking && elapsedTime === 0}
        >
          <StopCircle className="h-4 w-4 mr-1" />
          Parar
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isTracking ? "default" : "outline"} className={isTracking ? "bg-green-600" : ""}>
          {isTracking ? "Rastreando" : "Pausado"}
        </Badge>
        <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
      </div>
    </div>
  )