"use client";

import Header from "@/components/header";
import { TypeWriter } from "@/components/type-writer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import welcomeQuotes from "@/lib/welcome-quotes.json";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <TypeWriter words={welcomeQuotes} delay={80} />

        <p className="mt-6 text-lg text-muted-foreground max-w-lg">
          Junte-se à comunidade dos mestres da inércia e descubra que nem tudo
          na vida é sobre se mover — às vezes, é só sobre estar presente... no
          mesmo lugar.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex gap-4 mt-4">
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/nerdrats/tracker/releases/latest/download/nerdrats-tracker-linux.zip">
                Download Linux
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/nerdrats/tracker/releases/latest/download/nerdrats-tracker-win.zip">
                Download Windows
              </a>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
