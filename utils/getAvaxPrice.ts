// utils/avax.ts

let cachedAvaxPrice: number | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const fetchAvaxPrice = async (): Promise<number> => {
    try {
        const res = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd"
        );
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        const price = data?.["avalanche-2"]?.usd;

        if (price) {
            cachedAvaxPrice = price;
            lastFetchTime = Date.now();
        }

        return price || 0;
    } catch (err) {
        console.error("AVAX price fetch failed:", err);
        // fallback to cached price if available
        return cachedAvaxPrice || 0;
    }
};

// Get AVAX price, use cache if recent
export const getAvaxPrice = async (): Promise<number> => {
    const now = Date.now();
    if (!cachedAvaxPrice || now - lastFetchTime > CACHE_DURATION) {
        return await fetchAvaxPrice();
    }
    return cachedAvaxPrice;
};

// Convert testnet balance → USD value
export const convertBalanceToUSD = async (balance: number) => {
    const price = await getAvaxPrice();
    return parseFloat((balance * price).toFixed(4));
};

// Convert USD → AVAX
export const convertUSDToAvax = async (usd: number) => {
    const price = await getAvaxPrice();
    return price > 0 ? usd / price : 0;
};

// Optional formatting
export const formatBalance = (value: number) =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });