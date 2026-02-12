"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WatchlistContextType {
    watchlist: Set<string>;
    addToWatchlist: (id: string) => void;
    removeFromWatchlist: (id: string) => void;
    isInWatchlist: (id: string) => boolean;
    toggleWatchlist: (id: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("crypto-flux-watchlist");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    setWatchlist(new Set(parsed));
                }
            } catch (e) {
                console.error("Failed to parse watchlist", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("crypto-flux-watchlist", JSON.stringify(Array.from(watchlist)));
        }
    }, [watchlist, isInitialized]);

    const addToWatchlist = (id: string) => {
        setWatchlist((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    const removeFromWatchlist = (id: string) => {
        setWatchlist((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const toggleWatchlist = (id: string) => {
        if (watchlist.has(id)) {
            removeFromWatchlist(id);
        } else {
            addToWatchlist(id);
        }
    };

    const isInWatchlist = (id: string) => watchlist.has(id);

    return (
        <WatchlistContext.Provider
            value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist }}
        >
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error("useWatchlist must be used within a WatchlistProvider");
    }
    return context;
}
