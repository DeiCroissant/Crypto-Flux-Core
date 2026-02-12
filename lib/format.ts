export const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value < 1 ? 6 : 2,
        maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
};

export const formatCompactNumber = (number: number | null | undefined) => {
    if (number === null || number === undefined) return '0';
    return new Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(number);
};

export const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0.00%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};
