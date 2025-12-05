import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const BASE_URL = "https://fx-api.fluentax.com/v1/banks/CBN"; // replace with your actual endpoint

const currencyToCountry = {
    USD: "US",
    EUR: "EU",
    GBP: "GB",
    NGN: "NG",
    CAD: "CA",
    AUD: "AU",
    JPY: "JP",
    CNY: "CN",
    INR: "IN",
    // add more if needed
};

export default function CBNRateList() {
    const [rates, setRates] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch(BASE_URL);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setRates(data);
                } else if (data?.data) {
                    setRates(data.data);
                } else {
                    console.error("Unexpected API format", data);
                }
            } catch (err) {
                console.error("Error fetching CBN rates:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    const filteredRates = useMemo(() => {
        return rates.filter(rate =>
            rate.code.toLowerCase().includes(search.toLowerCase())
        );
    }, [rates, search]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">CBN Exchange Rates</h2>
            <Input
                placeholder="Search by currency code (e.g. USD, EUR)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-6"
            />
            {loading ? (
                <p className="text-center">Loading rates...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRates.length > 0 ? (
                        filteredRates.map((item, idx) => {
                            const code = item.code;
                            const rate = item.rate;
                            const countryCode = currencyToCountry[code] || "US";

                            return (
                                <motion.div
                                    key={code}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="border p-4 rounded-xl shadow-md hover:shadow-lg bg-white flex items-center gap-4"
                                >
                                    <img
                                        src={`https://flagsapi.com/${countryCode}/flat/32.png`}
                                        alt={code}
                                        className="w-8 h-6 object-cover rounded"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-lg">{code}</h4>
                                        <p className="text-sm text-gray-600">₦{Number(rate).toLocaleString()}</p>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500">No matching currencies found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
