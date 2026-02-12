"use client";

import { useWatchlist } from "@/components/providers/WatchlistProvider";
import CoinTable from "@/components/dashboard/CoinTable";
import { Coin } from "@/lib/api";
import Link from "next/link";
import { useMemo } from "react";

interface WatchlistWrapperProps {
    initialCoins: Coin[];
}

export default function WatchlistWrapper({ initialCoins }: WatchlistWrapperProps) {
    const { watchlist } = useWatchlist();

    const watchlistCoins = useMemo(() => {
        return initialCoins.filter(coin => watchlist.has(coin.id));
    }, [initialCoins, watchlist]);

    if (watchlist.size === 0) {
        return (
            <div className="text-center py-20 bg-card/50 rounded-2xl border border-border">
                <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground mb-6">Start starring coins to track them here!</p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                    Browse Coins
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 text-sm text-muted-foreground">
                Showing {watchlistCoins.length} saved coins
            </div>
            <CoinTable initialCoins={watchlistCoins} />
        </>
    );
}
