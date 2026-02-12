import { getTopCoins } from "@/lib/api";
import { Suspense } from "react";
import WatchlistWrapper from "./WatchlistWrapper";

export const dynamic = 'force-dynamic';

export default async function WatchlistPage() {
    const coins = await getTopCoins();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="text-center mb-8 space-y-4 pt-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Your Watchlist
                </h1>
                <p className="text-muted-foreground">
                    Track your favorite cryptocurrencies in real-time.
                </p>
            </div>

            <main>
                <Suspense fallback={<div className="text-center py-20 text-muted-foreground animate-pulse">Loading watchlist...</div>}>
                    <WatchlistWrapper initialCoins={coins} />
                </Suspense>
            </main>
        </div>
    );
}
