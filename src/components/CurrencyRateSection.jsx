import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import React from "react";

// Utility function to format numbers with commas
const formatNumber = (number) => {
    if (number === null || number === undefined || number === '') return '';
    return Number(number).toLocaleString();
};

const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <table className="w-full text-sm border">
    <thead className="bg-Custom-primary text-white text-left">
      <tr>
        {Array.from({ length: columns }).map((_, i) => (
          <th key={i} className="p-2">
            <div className="h-4 bg-white rounded animate-pulse"></div>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-t">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const CurrencyRateSectionSkeleton = () => (
  <div className="space-y-12">
    {/* Black Market Skeleton */}
    <div>
      <div className="h-8 w-48 bg-gray-300 rounded mb-4 animate-pulse"></div>
      <TableSkeleton rows={8} columns={4} />
    </div>

    {/* Fintech Skeleton */}
    <div>
      <div className="h-8 w-32 bg-gray-300 rounded mb-4 animate-pulse"></div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="mb-6">
          <div className="h-6 w-24 bg-gray-300 rounded mb-2 animate-pulse"></div>
          <TableSkeleton rows={3} columns={3} />
        </div>
      ))}
    </div>

    {/* CBN Skeleton */}
    <div>
      <div className="h-8 w-32 bg-gray-300 rounded mb-4 animate-pulse"></div>
      <TableSkeleton rows={8} columns={3} />
    </div>
  </div>
);

const CurrencyRateSection = () => {
    const axiosPublic = useAxiosPublic();
    const { data: allRates, isLoading } = useQuery({
        queryKey: ["allRates"],
        queryFn: async () => {
            const res = await axiosPublic.get("/categorized-exchange-rates");
            return res?.data?.data;
        }
    });

    if (isLoading) {
        return <CurrencyRateSectionSkeleton />;
    }

    return (
        <div className="space-y-12">
            {/* Black Market */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Dollar to Naira Today Black Market (Aboki Rate)</h2>
                <h3 className="text-lg text-gray-600 mb-4">Check today's black market exchange rates in Nigeria — dollar to naira, pounds, and euros.</h3>
                <table className="w-full text-sm border">
                    <thead className="bg-Custom-primary text-white text-left">
                        <tr>
                            <th className="p-2">Currency</th>
                            <th className="p-2">Code</th>
                            <th className="p-2">Buy Rate (₦)</th>
                            <th className="p-2">Sell Rate (₦)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRates?.blackMarketRates
                            ?.sort((a, b) => a.currency.localeCompare(b.currency))
                            ?.map((item, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-2">{item.currency}</td>
                                <td className="p-2">{item.code}</td>
                                <td className="p-2">{formatNumber(item.buy)}</td>
                                <td className="p-2">{formatNumber(item.sell)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Fintech */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Compare Daily Fintech Exchange Rates</h2>
                <h3 className="text-lg text-gray-600 mb-4">Live Dollar-to-Naira Rates from Payoneer, Grey, Geegpay & Cleva for freelancers and remote workers at a glance</h3>
                {
                    allRates?.fintechRates && (
                        Object?.entries(allRates?.fintechRates).map(([provider, rates]) => (
                            <div key={provider} className="mb-6">
                                <h3 className="font-semibold text-lg mb-2">{provider}</h3>
                                <table className="w-full text-sm border">
                                    <thead className="bg-Custom-primary text-white text-left">
                                        <tr>
                                            <th className="p-2">Currency</th>
                                            <th className="p-2">Code</th>
                                            <th className="p-2">Rate to Naira (₦)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(rates)
                                            .sort(([a], [b]) => a.localeCompare(b))
                                            .map(([currency, rate], i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-2">{currency}</td>
                                                <td className="p-2">{currency}</td>
                                                <td className="p-2">{formatNumber(rate)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )
                }
            </div>

            {/* CBN */}
            <div>
                <h2 className="text-2xl font-bold mb-4">🏦 CBN Rates</h2>
                <table className="w-full text-sm border">
                    <thead className="bg-Custom-primary text-white text-left">
                        <tr>
                            <th className="p-2">Currency</th>
                            <th className="p-2">Code</th>
                            <th className="p-2">CBN Rate to Naira (₦)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRates?.cbnRates
                            ?.sort((a, b) => a.currency.localeCompare(b.currency))
                            ?.map((item, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-2">{item.currency}</td>
                                <td className="p-2">{item.code}</td>
                                <td className="p-2">{formatNumber(item.rate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CurrencyRateSection;
