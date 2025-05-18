"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AchievementPopupProps {
  badgeName?: string
  nerdTaunt?: string
  badgeIcon?: string
}

export default function AchievementPopup({ 
  badgeName = "", 
  nerdTaunt = "",
  badgeIcon = "🏆"
}: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Sempre mostramos o popup quando recebemos novas props
    if (nerdTaunt) {
      setIsVisible(true);
    }
  }, [nerdTaunt, badgeName]);

  if (!isVisible || !nerdTaunt) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-[5%] right-[5%] z-50 w-[90%] mx-auto animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
      <Card className="border-2 border-primary/40 bg-gradient-to-r from-background via-background/95 to-primary/10 shadow-xl shadow-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse opacity-30"></div>
        <CardContent className="p-5 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-bounce">{badgeIcon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg text-primary">Nova conquista!</h4>
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 font-semibold">
                    {badgeName}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 italic">"{nerdTaunt}"</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}