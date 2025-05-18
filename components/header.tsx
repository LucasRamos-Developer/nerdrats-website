"use client"

import Link from "next/link"
import Image from "next/image"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginModal from "@/components/login-modal"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import usersData from "@/lib/users.json"

// Tipo para o usuário logado
interface LoggedInUser {
  id: string
  name: string
  email: string
  initials: string
  avatar?: string
}

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { toast } = useToast()
  const [user, setUser] = useState<LoggedInUser | null>(null)
  const router = useRouter()

  // Verificar se há um usuário no sessionStorage ao carregar
  useEffect(() => {
    const storedUser = sessionStorage.getItem("nerdrats_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        sessionStorage.removeItem("nerdrats_user")
      }
    }
  }, [])

  const handleLogin = async (email: string) => {
    try {
      const response = await fetch(`https://nerds-rats-hackathon.onrender.com/user-by-email/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error("Usuário não encontrado")
      }

      const data = await response.json()
      
      if (data && Array.isArray(data) && data.length > 0) {
        const userData = data[0]
        // Salvar usuário no sessionStorage
        sessionStorage.setItem("nerdrats_user", JSON.stringify(userData))

        // Atualizar estado
        setUser(userData)

        // Fechar modal
        setShowLoginModal(false)

        // Mostrar toast de sucesso
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${userData.user_github}!`,
        })
      } else {
        throw new Error("Usuário não encontrado")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      toast({
        title: "Erro no login",
        description: "Não foi possível encontrar uma conta com este email.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    // Remover usuário do sessionStorage
    sessionStorage.removeItem("nerdrats_user")

    // Limpar estado
    setUser(null)

    // Mostrar toast
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    })
    
    // Redirecionar para a página inicial se estiver na página de perfil
    // Isso deve ser feito após a limpeza do usuário
    if (window.location.pathname.includes("/perfil")) {
      router.push("/")
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex px-4">
        <div className="flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nerdrats-bZXIsl29NnVDcaRTJtkOsFdFjF7JeE.png"
                alt="NERDRATS Logo"
                width={180}
                height={50}
                className="h-auto"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/ranking" className="text-sm font-medium text-gray-800 hover:text-gray-600">
                Ranking
              </Link>
            </nav>
            
            {user ? (
              <>
                <Link href="/perfil">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <User className="h-4 w-4" />
                    Perfil
                  </Button>
                </Link>
                <Button onClick={handleLogout} className="bg-black hover:bg-gray-800 text-white rounded" size="sm">
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-black hover:bg-gray-800 text-white rounded"
                size="sm"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </header>
  )
}
