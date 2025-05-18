"use client"

import { useState } from "react"
import { Medal, Trophy, Award, Keyboard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import UserBadges from "@/components/user-badges"

type KeydownPlayer = {
  id: number
  name: string
  keydowns: number
  wpm: number
  avatar?: string // Tornando avatar opcional
  change: "up" | "down" | "same"
}

// Frases para os primeiros colocados
const topTyperQuotes = [
  "Seus dedos são mais rápidos que a velocidade da luz! Seu médico de RSI agradece! 🚀",
  "Você é o Mozart do teclado! Infelizmente, seu código ainda tem bugs... 🎹",
  "Campeão de digitação! Seu teclado pediu férias remuneradas! ⌨️",
  "Seus dedos são tão rápidos que a física quântica não consegue acompanhar! ⚡",
  "Primeiro lugar! Seu teclado está considerando pedir uma ordem de restrição! 🏆",
  "Você digita tão rápido que seu antivírus detectou seus dedos como ameaça! 🦠",
  "Velocidade impressionante! Seu seguro de saúde acabou de aumentar a cobertura para síndrome do túnel do carpo! 🩺",
]

// Frases para segundo e terceiro lugares
const runnerUpTyperQuotes = [
  "Quase lá! Mais alguns energy drinks e você chega ao primeiro lugar! ⚡",
  "Prata/Bronze na digitação! Ouro em ignorar os sinais de tendinite! 🥈",
  "Seus dedos estão quase pegando fogo! Seu extintor está pronto? 🔥",
  "Tão perto do topo! Seu teclado está torcendo por você (e por uma limpeza)! 🧹",
  "Posição honrosa! Seu ortopedista também está orgulhoso do seu negócio! 👨‍⚕️",
  "Você é quase o mais rápido! Seu corretor ortográfico não consegue acompanhar! 📝",
  "Medalha de prata/bronze em digitação! Também merece ouro em consumo de café! ☕",
]

// Frases para posições intermediárias (4-10)
const midTyperQuotes = [
  "Velocidade média, erros de digitação acima da média! Perfeitamente equilibrado! 🧘‍♂️",
  "Você está no meio do pelotão! Seu teclado agradece o ritmo moderado! ⌨️",
  "Nem tão rápido, nem tão devagar. Como um bom algoritmo de busca binária! 🔍",
  "Digitação decente! Seu corretor ortográfico ainda consegue acompanhar... por enquanto! 📝",
  "Você está no caminho certo! Seus dedos também estão no caminho certo para a fisioterapia! 👆",
  "Velocidade média! Como seu café: forte o suficiente para manter você acordado! ☕",
  "Posição intermediária! Seu teclado ainda tem todas as letras visíveis! 🔤",
]

// Frases para posições mais baixas (>10)
const lowerTyperQuotes = [
  "Ei, qualidade é melhor que quantidade! (É o que dizemos para nos sentirmos melhor) 🐢",
  "Digitação lenta, pensamento profundo! Einstein também não era conhecido por digitar rápido! 🧠",
  "Você está economizando a vida útil do seu teclado! Estratégia de longo prazo! 📈",
  "Seus dedos estão no modo econômico! Preservando energia para o sprint final! 🔋",
  "Digitação sustentável! Seu teclado vai durar mais que os dos outros competidores! ♻️",
  "Você prefere pensar duas vezes e digitar uma! Sabedoria acima da velocidade! 🦉",
  "Posição modesta, mas seu código provavelmente tem menos bugs que o do primeiro lugar! 🐛",
]

// Frases gerais que podem ser usadas para qualquer posição
const generalTyperQuotes = [
  "Cada tecla pressionada é um passo a mais para a síndrome do túnel do carpo! 🤕",
  "Seu teclado conhece seus segredos melhor que seu terapeuta! 🛋️",
  "Você já digitou o suficiente para escrever 'Guerra e Paz' três vezes! Tolstói estaria orgulhoso! 📚",
  "Tantas teclas pressionadas e ainda assim seu bug persiste! Irônico, não? 🐞",
  "Seu teclado merece um aumento de salário pelo trabalho extra! 💰",
  "Você já digitou o suficiente para fazer seu médico comprar um iate! 🛥️",
  "Impressionante! Seus dedos têm mais quilometragem que seu carro! 🚗",
]

export default function KeydownRankingCard({ player, index }: { player: KeydownPlayer; index: number }) {
  // Selecionar uma frase aleatória com base na posição
  let quotePool: string[] = []

  if (index === 0) {
    quotePool = topTyperQuotes
  } else if (index === 1 || index === 2) {
    quotePool = runnerUpTyperQuotes
  } else if (index >= 3 && index <= 9) {
    quotePool = midTyperQuotes
  } else {
    quotePool = lowerTyperQuotes
  }

  // Adicionar frases gerais ao pool para aumentar a variedade
  quotePool = [...quotePool, ...generalTyperQuotes]

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
              <Keyboard className="h-3.5 w-3.5 text-slate-500" />
              <div className="flex items-baseline">
                <span className="font-medium text-foreground">{player.keydowns.toLocaleString()}</span>
                <span className="ml-2 text-xs text-slate-500">
                  <span className="font-semibold">{player.wpm}</span> WPM
                </span>
              </div>
            </div>

            {/* Adicionando apenas o último badge do usuário */}
            <div className="mt-1">
              <UserBadges userKeydowns={player.keydowns} showOnlyLast={true} type="keydowns" />
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
