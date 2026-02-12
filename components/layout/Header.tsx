"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useWatchlist } from "@/components/providers/WatchlistProvider";

export default function Header() {
    const { watchlist } = useWatchlist();
    const count = watchlist.size;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Crypto Flux Core
                    </span>
                </Link>

                <nav className="flex items-center gap-4">
                    <Link
                        href="/watchlist"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                    >
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>Watchlist</span>
                        {count > 0 && (
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                {count}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
