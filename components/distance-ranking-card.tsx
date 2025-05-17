"use client"

import { useState } from "react"
import { Medal, Trophy, Award, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import UserBadges from "@/components/user-badges"

type DistancePlayer = {
  id: number
  name: string
  distance: number
  unit: string
  avatar?: string // Tornando avatar opcional
  change: "up" | "down" | "same"
}

// Frases para os primeiros colocados
const topRankerQuotes = [
  "Enquanto os outros programadores dormiam, você estava digitando. Vitória merecida! 🏆",
  "Você é o Usain Bolt da programação! Rápido nos dedos, lento em levantar da cadeira. 🥇",
  "Parabéns! Você ganhou o prêmio de 'Mais Quilômetros Virtuais Sem Sair do Lugar'! 🎖️",
  "Sua cadeira merece um troféu por aguentar tanto tempo com você sentado nela! 👑",
  "Primeiro lugar no ranking, último lugar em exposição solar! Equilíbrio é tudo! 🌞",
  "Você é o campeão mundial de maratona sentada! Seus dedos merecem uma massagem! 💪",
  "Tão produtivo que seu teclado pediu férias! Merecido primeiro lugar! ⌨️",
]

// Frases para segundo e terceiro lugares
const runnerUpQuotes = [
  "Quase lá! Mais alguns bugs para corrigir e você chega ao topo! 🥈",
  "Prata virtual! Seu sedentarismo está quase no nível profissional! 🏅",
  "Segundo/terceiro lugar no ranking, primeiro lugar em consumo de café! ☕",
  "Você está no pódio virtual! Sua coluna vertebral não está tão impressionada... 🦴",
  "Medalha de prata/bronze por ignorar consistentemente o alarme para se exercitar! 🏃‍♂️",
  "Tão perto do topo! Talvez se você ignorar mais algumas refeições... 🍕",
  "Posição honrosa! Seu médico ainda não está orgulhoso, mas nós estamos! 👨‍⚕️",
]

// Frases para posições intermediárias (4-10)
const midRankerQuotes = [
  "Você está no meio do pelotão! Nem o mais sedentário, nem o mais ativo. Perfeitamente equilibrado! 🧘‍♂️",
  "Posição média, habilidades de programação acima da média! Prioridades! 💻",
  "Você está subindo no ranking! Sua cadeira está afundando na mesma proporção! 🪑",
  "Nem tão rápido, nem tão devagar. Como um bom algoritmo de ordenação! 🔄",
  "Você está no caminho certo! O caminho para a fisioterapia também, mas isso é outro assunto... 🩺",
  "Posição decente! Sua produtividade e sua postura estão inversamente proporcionais! 📊",
  "Você está no meio termo! Como seu café: nem muito quente, nem muito frio! ☕",
]

// Frases para posições mais baixas (>10)
const lowerRankerQuotes = [
  "Ei, pelo menos você está no ranking! Isso é mais do que seu plano de exercícios pode dizer! 🏋️‍♂️",
  "Posição humilde, mas seu potencial de sedentarismo é promissor! 📈",
  "Você está começando sua jornada virtual! Sua jornada real para a geladeira já é expert! 🍔",
  "Ainda há muito espaço para crescer! Tanto no ranking quanto na sua cadeira! 🪑",
  "Não desanime! Com mais algumas noites viradas codando, você sobe no ranking! 🌙",
  "Você está construindo sua reputação virtual! Sua reputação com o personal trainer está em ruínas! 🏃‍♂️",
  "Posição modesta, mas seu histórico de navegação no Stack Overflow é impressionante! 🔍",
]

// Frases gerais que podem ser usadas para qualquer posição
const generalRankerQuotes = [
  "Cada linha de código é um passo que você não deu no mundo real! 🚶‍♂️",
  "Sua posição no ranking é diretamente proporcional ao tempo que você não passa ao ar livre! 🌳",
  "Parabéns! Seu médico acabou de comprar um iate com o dinheiro das suas futuras consultas! 👨‍⚕️",
  "Sua cadeira conhece melhor o formato do seu corpo do que seu parceiro(a)! 💺",
  "Você está no ranking! Seu contador de passos no celular está com ciúmes! 📱",
  "Sua posição mostra dedicação! Ao código, não à sua saúde! 💉",
  "Impressionante! Seu avatar virtual percorre mais distância que você na vida real! 🎮",
]

export default function DistanceRankingCard({ player, index }: { player: DistancePlayer; index: number }) {
  // Selecionar uma frase aleatória com base na posição
  let quotePool: string[] = []

  if (index === 0) {
    quotePool = topRankerQuotes
  } else if (index === 1 || index === 2) {
    quotePool = runnerUpQuotes
  } else if (index >= 3 && index <= 9) {
    quotePool = midRankerQuotes
  } else {
    quotePool = lowerRankerQuotes
  }

  // Adicionar frases gerais ao pool para aumentar a variedade
  quotePool = [...quotePool, ...generalRankerQuotes]

  // Selecionar uma frase aleatória do pool
  const randomIndex = Math.floor(Math.random() * quotePool.length)
  const initialQuote = quotePool[randomIndex] || ""

  const [randomQuote] = useState(initialQuote)

  // Verificar se player existe antes de continuar
  if (!player) {
    return <div>Dados do jogador não disponíveis</div>
  }

  // Extrair as iniciais do nome para o fallback do avatar
  const initials = player.name ? player.name.substring(0, 2).toUpperCase() : "??"

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${index < 3 ? "border-2" : ""} ${
        index === 0 ? "border-yellow-500" : index === 1 ? "border-slate-400" : index === 2 ? "border-amber-700" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="flex items-center justify-center w-10 mr-4 font-bold text-lg">
            {index === 0 ? (
              <Trophy className="h-6 w-6 text-yellow-500" />
            ) : index === 1 ? (
              <Medal className="h-6 w-6 text-slate-400" />
            ) : index === 2 ? (
              <Award className="h-6 w-6 text-amber-700" />
            ) : (
              <span className="text-muted-foreground">{index + 1}</span>
            )}
          </div>

          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name || "Usuário"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="font-medium">{player.name || "Usuário Anônimo"}</div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <div className="flex items-baseline">
                <span className="font-medium text-foreground">{player.distance.toFixed(1)}</span>
                <span className="ml-1 text-xs uppercase font-semibold text-slate-500">km</span>
              </div>
            </div>

            {/* Adicionando apenas o último badge do usuário */}
            <div className="mt-1">
              <UserBadges userDistance={player.distance} showOnlyLast={true} />
            </div>
          </div>

          <div className="ml-auto flex items-center">
            {player.change === "up" && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ▲ Subiu
              </Badge>
            )}
            {player.change === "down" && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                ▼ Desceu
              </Badge>
            )}
            {player.change === "same" && (
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                ● Manteve
              </Badge>
            )}
          </div>
        </div>

        {/* Frase aleatória baseada na posição */}
        <div className="px-4 pb-3 pt-0">
          <p className="text-xs italic text-muted-foreground">{randomQuote}</p>
        </div>
      </CardContent>
    </Card>
  )
}
