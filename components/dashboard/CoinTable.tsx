"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { Coin } from "@/lib/api";
import { formatCurrency, formatCompactNumber, formatPercentage } from "@/lib/format";
import FavoriteButton from "./FavoriteButton";

interface CoinTableProps {
    initialCoins: Coin[];
}

type SortField = "market_cap" | "total_volume" | "price_change_percentage_24h";
type SortDirection = "asc" | "desc";

export default function CoinTable({ initialCoins }: CoinTableProps) {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("market_cap");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const filteredAndSortedCoins = useMemo(() => {
        let result = [...initialCoins];

        // Filter
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (coin) =>
                    coin.name.toLowerCase().includes(lowerSearch) ||
                    coin.symbol.toLowerCase().includes(lowerSearch)
            );
        }

        // Sort
        result.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });

        return result;
    }, [initialCoins, search, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };


    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search coins..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    {/* Filter buttons could go here if we wanted predefined filters, but headers act as sort */}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="p-4 w-12 text-center" aria-label="Favorite"></th>
                                <th className="p-4 font-semibold text-muted-foreground w-16 text-center">#</th>
                                <th className="p-4 font-semibold text-muted-foreground">Coin</th>
                                <th
                                    className="p-4 font-semibold text-muted-foreground cursor-pointer group select-none hover:text-foreground transition-colors text-right"
                                    onClick={() => handleSort("market_cap")}
                                >
                                    <div className="flex items-center justify-end">
                                        Market Cap
                                        <SortIcon field="market_cap" currentSort={sortField} sortDirection={sortDirection} />
                                    </div>
                                </th>
                                <th
                                    className="p-4 font-semibold text-muted-foreground cursor-pointer group select-none hover:text-foreground transition-colors text-right"
                                    onClick={() => handleSort("total_volume")}
                                >
                                    <div className="flex items-center justify-end">
                                        Volume
                                        <SortIcon field="total_volume" currentSort={sortField} sortDirection={sortDirection} />
                                    </div>
                                </th>
                                <th
                                    className="p-4 font-semibold text-muted-foreground cursor-pointer group select-none hover:text-foreground transition-colors text-right"
                                    onClick={() => handleSort("price_change_percentage_24h")}
                                >
                                    <div className="flex items-center justify-end">
                                        24h %
                                        <SortIcon field="price_change_percentage_24h" currentSort={sortField} sortDirection={sortDirection} />
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-muted-foreground text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredAndSortedCoins.map((coin) => (
                                <tr
                                    key={coin.id}
                                    className="hover:bg-muted/50 transition-colors group cursor-pointer"
                                >
                                    <td className="p-4 text-center">
                                        <FavoriteButton coinId={coin.id} />
                                    </td>
                                    <td className="p-4 text-center text-muted-foreground font-mono text-sm">{coin.market_cap_rank}</td>
                                    <td className="p-4">
                                        <Link href={`/coin/${coin.id}`} className="flex items-center gap-3">
                                            <Image
                                                src={coin.image}
                                                alt={coin.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full shadow-sm group-hover:scale-110 transition-transform"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">{coin.name}</span>
                                                <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-right font-mono text-muted-foreground">
                                        ${formatCompactNumber(coin.market_cap)}
                                    </td>
                                    <td className="p-4 text-right font-mono text-muted-foreground">
                                        ${formatCompactNumber(coin.total_volume)}
                                    </td>
                                    <td className="p-4 text-right font-medium">
                                        <div className={`flex items-center justify-end gap-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            {formatPercentage(coin.price_change_percentage_24h)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-foreground font-mono">
                                        {formatCurrency(coin.current_price)}
                                    </td>
                                </tr>
                            ))}

                            {filteredAndSortedCoins.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        No coins found matching &quot;{search}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SortIcon({ field, currentSort, sortDirection }: { field: SortField, currentSort: SortField, sortDirection: SortDirection }) {
    if (currentSort !== field) return <div className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50" />;
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
}
