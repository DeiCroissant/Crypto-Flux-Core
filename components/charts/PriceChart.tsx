"use client";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ScriptableContext,
    TooltipItem
} from "chart.js";
import { MarketChart } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface PriceChartProps {
    initialData: MarketChart;
}

export default function PriceChart({ initialData }: PriceChartProps) {
    // We can add time range selector state here later if API supported dynamic days without full page reload, 
    // currently standard implementation passes initial data.
    // For interactivity, we ideally fetch new data on range change.

    const chartData = {
        labels: initialData.prices.map((item) => {
            const date = new Date(item[0]);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }),
        datasets: [
            {
                label: "Price (USD)",
                data: initialData.prices.map((item) => item[1]),
                fill: true,
                borderColor: "rgb(34, 211, 238)", // Cyan 400
                backgroundColor: (context: ScriptableContext<"line">) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "rgba(34, 211, 238, 0.5)"); // Cyan with opacity
                    gradient.addColorStop(1, "rgba(34, 211, 238, 0.0)");
                    return gradient;
                },
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(24, 24, 27, 0.9)', // Zinc 900
                titleColor: '#fafafa',
                bodyColor: '#a1a1aa',
                borderColor: '#27272a', // Zinc 800
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context: TooltipItem<'line'>) {
                        return formatCurrency(context.parsed.y || 0);
                    }
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                display: false, // Hide X axis labels for cleaner look similar to Robinhood/Coinbase
                grid: {
                    display: false
                }
            },
            y: {
                display: true,
                position: 'right' as const,
                grid: {
                    color: 'rgba(39, 39, 42, 0.5)' // Zinc 800 with opacity
                },
                ticks: {
                    color: '#a1a1aa', // Muted foreground
                    callback: function (value: string | number) {
                        return formatCurrency(Number(value)); // Format Y axis
                    }
                }
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    return (
        <div className="w-full h-[400px] bg-card/30 rounded-2xl border border-border p-4 glass-card">
            <Line data={chartData} options={options} />
        </div>
    );
}
