export interface Coin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_percentage_24h: number;
    last_updated: string;
}

export interface MarketChart {
    prices: [number, number][]; // [timestamp, price]
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

const API_URL = 'https://api.coingecko.com/api/v3';

export async function getTopCoins(): Promise<Coin[]> {
    const res = await fetch(
        `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
        {
            next: { revalidate: 60 }, // Cache for 60 seconds (Free tier friendly)
        }
    );

    if (!res.ok) {
        if (res.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error('Failed to fetch coins');
    }

    return res.json();
}

export async function getCoinDetails(id: string): Promise<Coin> {
    // Reusing markets endpoint for detail overview if single coin needed, 
    // or use /coins/{id} for full details. 
    // For this app, usually /coins/markets with ids param is lighter, but /coins/{id} gives description etc.
    // The requirement says "Detail Page: Show price charts".
    // I'll use /coins/{id} for specific details if needed, but for now getting basic info from markets is efficient if I just need price/rank.
    // However, for a proper detail page, /coins/{id} is standard.
    // CAUTION: /coins/{id} is heavy.
    // Let's stick to markets with ids filter for basic info to save RUs if possible, but let's assume we want full metadata.
    // User asked "Show price charts".

    // Actually, I'll fetch the specific coin using markets endpoint filtering by ID to reuse the lightweight object structure 
    // unless description is needed. The requirements didn't explicitly ask for description, just "Detail Page: Show price charts".
    // But a detail page usually needs the name, image, etc.

    // I will implement getCoinHistory for the chart.

    const res = await fetch(
        `${API_URL}/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error('Failed to fetch coin details');
    const data = await res.json();
    if (data.length === 0) throw new Error('Coin not found');
    return data[0];
}

export async function getCoinHistory(id: string, days: string = '7'): Promise<MarketChart> {
    const res = await fetch(
        `${API_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
        {
            next: { revalidate: 120 }, // Cache longer for history
        }
    );

    if (!res.ok) {
        if (res.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error('Failed to fetch coin history');
    }

    return res.json();
}
