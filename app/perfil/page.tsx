"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, MapPin, Keyboard, Edit, ArrowLeft } from "lucide-react"
import UserBadges from "@/components/user-badges"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  id: string
  email: string
  name: string
  initials: string
  avatar?: string
  memberSince: string
  lastActivity: string
  distance: {
    current: number
    position: number
    bestPosition: number
    change: string
  }
  keydowns: {
    total: number
    position: number
    wpm: number
    change: string
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar se há um usuário no localStorage
    const storedUser = localStorage.getItem("nerdrats_user")

    if (!storedUser) {
      // Redirecionar para a página inicial se não houver usuário logado
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
      localStorage.removeItem("nerdrats_user")
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[60vh]">
        <p>Carregando perfil...</p>
      </div>
    )
  }

  if (!user) {
    return null // Isso não deve acontecer devido ao redirecionamento, mas é bom ter
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.avatar || `/placeholder.svg?height=96&width=96&text=${user.initials}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Membro desde</span>
                <span>{user.memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Última atividade</span>
                <span>{user.lastActivity}</span>
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Seu desempenho nos rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-slate-500" />
                  <h3 className="font-medium">Ranking de Distância</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Posição Atual</div>
                    <div className="flex items-center">
                      {user.distance.position === 1 ? (
                        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                      ) : user.distance.position === 2 ? (
                        <Medal className="h-5 w-5 text-slate-400 mr-2" />
                      ) : user.distance.position === 3 ? (
                        <Award className="h-5 w-5 text-amber-700 mr-2" />
                      ) : null}
                      <span className="text-xl font-bold">{user.distance.position}º</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Distância Total</div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold">{user.distance.current.toFixed(1)}</span>
                      <span className="ml-1 text-xs uppercase font-semibold text-slate-500">km</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Melhor Posição</div>
                    <div className="flex items-center">
                      {user.distance.bestPosition === 1 ? (
                        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                      ) : user.distance.bestPosition === 2 ? (
                        <Medal className="h-5 w-5 text-slate-400 mr-2" />
                      ) : user.distance.bestPosition === 3 ? (
                        <Award className="h-5 w-5 text-amber-700 mr-2" />
                      ) : null}
                      <span className="text-xl font-bold">{user.distance.bestPosition}º</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Keyboard className="h-5 w-5 mr-2 text-slate-500" />
                  <h3 className="font-medium">Ranking de Teclas</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Posição Atual</div>
                    <div className="flex items-center">
                      {user.keydowns.position === 1 ? (
                        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                      ) : user.keydowns.position === 2 ? (
                        <Medal className="h-5 w-5 text-slate-400 mr-2" />
                      ) : user.keydowns.position === 3 ? (
                        <Award className="h-5 w-5 text-amber-700 mr-2" />
                      ) : null}
                      <span className="text-xl font-bold">{user.keydowns.position}º</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Total de Teclas</div>
                    <div className="text-xl font-bold">{user.keydowns.total.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">WPM Médio</div>
                    <div className="text-xl font-bold">{user.keydowns.wpm}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Badges */}
        <div className="md:col-span-3">
          <UserBadges
            userDistance={user.distance.current}
            userKeydowns={user.keydowns.total}
            showAll={true}
            type="all"
          />
        </div>
      </div>
    </div>
  )
}
