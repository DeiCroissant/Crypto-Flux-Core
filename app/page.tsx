import { getTopCoins } from "@/lib/api";
import CoinTable from "@/components/dashboard/CoinTable";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const coins = await getTopCoins();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header removed and moved to layout */}
      <div className="text-center mb-8 space-y-4 pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight pb-2 sm:hidden">
          Crypto Flux
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Real-time cryptocurrency aggregator powered by CoinGecko API.
          Aggressive caching strategy for optimal performance.
        </p>
      </div>

      <main>
        <Suspense fallback={<div className="text-center py-20 text-muted-foreground animate-pulse">Loading market data...</div>}>
          <CoinTable initialCoins={coins} />
        </Suspense>
      </main>

      <footer className="mt-20 text-center text-sm text-muted-foreground py-8 border-t border-border/50">
        <p>Data provided by CoinGecko Free API</p>
      </footer>
    </div>
  );
}
