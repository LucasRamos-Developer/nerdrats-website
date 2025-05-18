import RankingTabs from "@/components/ranking-tabs"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center">

      <h1 className="text-3xl font-bold mb-2 text-center">Ranking de Líderes</h1>

      <p className="text-center text-muted-foreground mb-2 max-w-2xl">
        Confira os melhores jogadores classificados por distância percorrida (km) e teclas pressionadas. Alterne entre
        as abas para ver diferentes rankings.
      </p>

      <div className="text-sm text-center text-muted-foreground mb-6 flex items-center justify-center gap-1">
        <span className="inline-flex items-center">
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
            className="mr-1"
          >
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
          </svg>
          Distâncias medidas em quilômetros (km)
        </span>
      </div>

      <div className="w-full max-w-3xl">
        <RankingTabs />
      </div>
    </div>
  )
}
