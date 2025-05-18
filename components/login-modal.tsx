"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string) => void
}



export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      const response = await fetch(`https://nerds-rats-hackathon.onrender.com/user-by-email/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Erro na resposta:', response.status, response.statusText)
        setIsEmailValid(false)
        setIsLoading(false)
        return
      }

      const data = await response.json()
      console.log('Dados recebidos:', data)
      
      if (data && Array.isArray(data) && data.length > 0 && data[0].id !== undefined) {
        onLogin(email)
        setEmail("")
      } else {
        setIsEmailValid(false)
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      setIsEmailValid(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Entrar na sua conta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
              autoComplete="email"
              className={!isEmailValid && email ? "border-red-500" : ""}
            />
            {!isEmailValid && email && (
              <p className="text-sm text-red-500">Email inválido ou não encontrado</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
