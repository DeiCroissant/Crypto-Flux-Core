import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { getCoinDetails, getCoinHistory } from "@/lib/api";
import PriceChart from "@/components/charts/PriceChart";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CoinPage({ params }: PageProps) {
    const { id } = await params;

    // Parallel fetch for valid data
    const coinData = getCoinDetails(id);
    const historyData = getCoinHistory(id);

    const [coin, history] = await Promise.all([coinData, historyData]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Header & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <Image src={coin.image} alt={coin.name} fill className="rounded-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{coin.name}</h1>
                            <span className="text-xl text-muted-foreground font-mono uppercase">{coin.symbol}</span>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 bg-card rounded-2xl border border-border">
                        <div>
                            <span className="text-sm text-muted-foreground">Current Price</span>
                            <div className="text-4xl font-bold font-mono text-foreground mt-1">
                                {formatCurrency(coin.current_price)}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-muted-foreground">24h Change</span>
                            <div className={`text-lg font-medium flex items-center gap-2 mt-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                {formatPercentage(coin.price_change_percentage_24h)}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border grid grid-cols-1 gap-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Market Cap</span>
                                <div className="font-mono text-lg">{formatCurrency(coin.market_cap)}</div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Volume (24h)</span>
                                <div className="font-mono text-lg">{formatCurrency(coin.total_volume)}</div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">High 24h</span>
                                <div className="font-mono text-lg">{formatCurrency(coin.high_24h)}</div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Low 24h</span>
                                <div className="font-mono text-lg">{formatCurrency(coin.low_24h)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Price History (7 Days)</h2>
                        {/* Could add time range selector here in future */}
                    </div>
                    <Suspense fallback={<div className="h-[400px] w-full bg-card/30 rounded-2xl animate-pulse"></div>}>
                        <PriceChart initialData={history} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
