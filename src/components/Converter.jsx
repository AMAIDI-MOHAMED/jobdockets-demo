// Converter.jsx
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { motion } from 'framer-motion';
import { SlideUp } from '@/animation/animate';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';

const Converter = () => {
    const [amount, setAmount] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [conversionType, setConversionType] = useState('buy'); // buy or sell
    const [nairaAmount, setNairaAmount] = useState(0);
    const [rateSource, setRateSource] = useState('blackMarketRates'); // blackMarketRates, fintechRates, cbnRates

    const axiosPublic = useAxiosPublic();

    const { data: exchangeRates } = useQuery({
        queryKey: ['exchangeRates'],
        queryFn: async () => {
            const res = await axiosPublic.get('/categorized-exchange-rates');
            return res?.data?.data;
        }
    });

    // Get available currencies based on selected rate source
    const getAvailableCurrencies = () => {
        if (!exchangeRates) return [];
        
        switch (rateSource) {
            case 'blackMarketRates':
                return [...new Set(exchangeRates.blackMarketRates.map(item => item.code))];
            case 'fintechRates':
                const fintechCurrencies = new Set();
                Object.values(exchangeRates.fintechRates).forEach(service => {
                    Object.keys(service).forEach(currency => fintechCurrencies.add(currency));
                });
                return Array.from(fintechCurrencies);
            case 'cbnRates':
                return [...new Set(exchangeRates.cbnRates.map(item => item.code))];
            default:
                return [];
        }
    };

    // Get available services based on rate source
    const getAvailableServices = () => {
        if (!exchangeRates) return [];
        
        switch (rateSource) {
            case 'fintechRates':
                return Object.keys(exchangeRates.fintechRates);
            default:
                return [rateSource]; // For other sources, use the source name as the "service"
        }
    };

    // Calculate conversion when inputs change
    useEffect(() => {
        if (!amount || !exchangeRates || !selectedCurrency) {
            setNairaAmount(0);
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            setNairaAmount(0);
            return;
        }

        let rate = 0;
        
        switch (rateSource) {
            case 'blackMarketRates':
                const blackMarketRate = exchangeRates.blackMarketRates.find(
                    item => item.code === selectedCurrency
                );
                if (blackMarketRate) {
                    rate = conversionType === 'buy' ? blackMarketRate.buy : blackMarketRate.sell;
                }
                break;
                
            case 'fintechRates':
                if (selectedService && exchangeRates.fintechRates[selectedService]) {
                    rate = exchangeRates.fintechRates[selectedService][selectedCurrency] || 0;
                }
                break;
                
            case 'cbnRates':
                const cbnRate = exchangeRates.cbnRates.find(
                    item => item.code === selectedCurrency
                );
                if (cbnRate) {
                    rate = cbnRate.rate;
                }
                break;
        }

        setNairaAmount(numericAmount * rate);
    }, [amount, selectedCurrency, conversionType, selectedService, rateSource, exchangeRates]);

    return (
        <section id='exchange'>
            <p className="text-[28px] sm:text-[38px] xmd:text-[48px] text-center font-semibold">
                Converter with Live Exchange Rates
            </p>

            <motion.form
                variants={SlideUp(0.3)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className='grid xmd:grid-cols-4 gap-4 my-10'
            >
                <div className="grid w-full items-center gap-4">
                    <Label htmlFor="amount" className="text-xl xlg:text-3xl">Enter Currency Amount</Label>
                    <Input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-12"
                    />
                </div>

                <div className="grid w-full items-center gap-4">
                    <Label htmlFor="rate-source" className="text-xl xlg:text-3xl">Rate Source</Label>
                    <Select 
                        value={rateSource} 
                        onValueChange={(value) => {
                            setRateSource(value);
                            setSelectedService(value === 'fintechRates' ? '' : value);
                        }}
                    >
                        <SelectTrigger className="w-full border !h-12">
                            <SelectValue placeholder="Select Rate Source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="blackMarketRates">Black Market</SelectItem>
                            <SelectItem value="fintechRates">Fintech</SelectItem>
                            <SelectItem value="cbnRates">CBN Rates</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full items-center gap-4">
                    <Label htmlFor="currency" className="text-xl xlg:text-3xl">Currency</Label>
                    <Select 
                        value={selectedCurrency} 
                        onValueChange={setSelectedCurrency}
                    >
                        <SelectTrigger className="w-full border !h-12">
                            <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {getAvailableCurrencies().map((currency) => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {rateSource === 'blackMarketRates' && (
                    <div className="grid w-full items-center gap-4">
                        <Label htmlFor="conversion-type" className="text-xl xlg:text-3xl">Buy/Sell</Label>
                        <Select 
                            value={conversionType} 
                            onValueChange={setConversionType}
                        >
                            <SelectTrigger className="w-full border !h-12">
                                <SelectValue placeholder="Buy/Sell" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="buy">Buy</SelectItem>
                                <SelectItem value="sell">Sell</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {rateSource === 'fintechRates' && (
                    <div className="grid w-full items-center gap-4">
                        <Label htmlFor="service" className="text-xl xlg:text-3xl">Fintech Service</Label>
                        <Select
                            value={selectedService}
                            onValueChange={setSelectedService}
                        >
                            <SelectTrigger className="w-full !h-12" id="service">
                                <SelectValue placeholder="Select Service" />
                            </SelectTrigger>
                            <SelectContent>
                                {getAvailableServices().map((service) => (
                                    <SelectItem key={service} value={service}>{service}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="grid w-full items-center gap-4 ">
                    <Label htmlFor="naira-amount" className="text-xl xlg:text-3xl">
                        Total Naira Amount
                    </Label>
                    <Input
                        type="text"
                        id="naira-amount"
                        className="h-12"
                        value={nairaAmount.toLocaleString('en-NG', { 
                            style: 'currency',
                            currency: 'NGN',
                            maximumFractionDigits: 2 
                        })}
                        readOnly
                        placeholder="₦0.00"
                    />
                </div>
            </motion.form>
        </section>
    );
};

export default Converter;