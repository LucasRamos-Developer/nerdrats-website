'use client';

import RankingTabs from "@/components/ranking-tabs";
import Image from "next/image";

export default function RankingPage() {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-center">Ranking de Líderes</h1>

      <p className="text-center text-muted-foreground mb-2 max-w-2xl">
        Confira os melhores jogadores classificados por distância percorrida (km) e teclas pressionadas. Alterne entre
        as abas para ver diferentes rankings.
      </p>

      <div className="w-full max-w-3xl">
        <RankingTabs />
      </div>
    </div>
  );
}