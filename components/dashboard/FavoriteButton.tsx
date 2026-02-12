"use client";

import { useWatchlist } from "@/components/providers/WatchlistProvider";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
    coinId: string;
    className?: string;
}

export default function FavoriteButton({ coinId, className }: FavoriteButtonProps) {
    const { isInWatchlist, toggleWatchlist } = useWatchlist();
    const isFavorite = isInWatchlist(coinId);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(coinId);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "p-2 rounded-full transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 group",
                className
            )}
            aria-label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
        >
            <Star
                className={cn(
                    "w-5 h-5 transition-all",
                    isFavorite
                        ? "fill-yellow-500 text-yellow-500 scale-110"
                        : "text-muted-foreground group-hover:text-yellow-500"
                )}
            />
        </button>
    );
}
