import { useEffect, useState } from 'react';

const useExchangeRates = () => {
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=NGN');
                const data = await res.json();
                const rate = data.rates?.NGN || 0;

                setRates({
                    CBN: { buy: rate, sell: rate + 5 },
                    BlackMarket: { buy: rate + 100, sell: rate + 120 },
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching exchange rates:', err);
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    return { rates, loading };
};

export default useExchangeRates;
