import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SlideUp } from '@/animation/animate';

const API_KEY = '6039d889595216895f1232e1';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// Map currency codes to country codes (for flags)
const currencyToCountry = {
    AED: 'AE', // UAE Dirham - United Arab Emirates
    AFN: 'AF', // Afghan Afghani - Afghanistan
    ALL: 'AL', // Albanian Lek - Albania
    AMD: 'AM', // Armenian Dram - Armenia
    AOA: 'AO', // Angolan Kwanza - Angola
    ARS: 'AR', // Argentine Peso - Argentina
    AUD: 'AU', // Australian Dollar - Australia
    AWG: 'AW', // Aruban Florin - Aruba
    AZN: 'AZ', // Azerbaijani Manat - Azerbaijan
    BAM: 'BA', // Bosnia-Herzegovina Convertible Mark - Bosnia & Herzegovina
    BBD: 'BB', // Barbadian Dollar - Barbados
    BDT: 'BD', // Bangladeshi Taka - Bangladesh
    BGN: 'BG', // Bulgarian Lev - Bulgaria
    BHD: 'BH', // Bahraini Dinar - Bahrain
    BIF: 'BI', // Burundian Franc - Burundi
    BMD: 'BM', // Bermudian Dollar - Bermuda
    BND: 'BN', // Brunei Dollar - Brunei
    BOB: 'BO', // Bolivian Boliviano - Bolivia
    BRL: 'BR', // Brazilian Real - Brazil
    BSD: 'BS', // Bahamian Dollar - Bahamas
    BTC: 'BT', // Bitcoin - Bhutan (placeholder)
    BTN: 'BT', // Bhutanese Ngultrum - Bhutan
    BWP: 'BW', // Botswanan Pula - Botswana
    BYN: 'BY', // Belarusian Ruble - Belarus
    BZD: 'BZ', // Belize Dollar - Belize
    CAD: 'CA', // Canadian Dollar - Canada
    CDF: 'CD', // Congolese Franc - DR Congo
    CHF: 'CH', // Swiss Franc - Switzerland
    CLF: 'CL', // Chilean Unit of Account (UF) - Chile
    CLP: 'CL', // Chilean Peso - Chile
    CNY: 'CN', // Chinese Yuan - China
    COP: 'CO', // Colombian Peso - Colombia
    CRC: 'CR', // Costa Rican Colón - Costa Rica
    CUC: 'CU', // Cuban Convertible Peso - Cuba
    CUP: 'CU', // Cuban Peso - Cuba
    CVE: 'CV', // Cape Verdean Escudo - Cape Verde
    CZK: 'CZ', // Czech Koruna - Czech Republic
    DJF: 'DJ', // Djiboutian Franc - Djibouti
    DKK: 'DK', // Danish Krone - Denmark
    DOP: 'DO', // Dominican Peso - Dominican Republic
    DZD: 'DZ', // Algerian Dinar - Algeria
    EGP: 'EG', // Egyptian Pound - Egypt
    ERN: 'ER', // Eritrean Nakfa - Eritrea
    ETB: 'ET', // Ethiopian Birr - Ethiopia
    EUR: 'EU', // Euro - European Union
    FJD: 'FJ', // Fijian Dollar - Fiji
    FKP: 'FK', // Falkland Islands Pound - Falkland Islands
    GBP: 'GB', // British Pound - United Kingdom
    GEL: 'GE', // Georgian Lari - Georgia
    GGP: 'GG', // Guernsey Pound - Guernsey
    GHS: 'GH', // Ghanaian Cedi - Ghana
    GIP: 'GI', // Gibraltar Pound - Gibraltar
    GMD: 'GM', // Gambian Dalasi - Gambia
    GNF: 'GN', // Guinean Franc - Guinea
    GTQ: 'GT', // Guatemalan Quetzal - Guatemala
    GYD: 'GY', // Guyanaese Dollar - Guyana
    HKD: 'HK', // Hong Kong Dollar - Hong Kong
    HNL: 'HN', // Honduran Lempira - Honduras
    HRK: 'HR', // Croatian Kuna - Croatia
    HTG: 'HT', // Haitian Gourde - Haiti
    HUF: 'HU', // Hungarian Forint - Hungary
    IDR: 'ID', // Indonesian Rupiah - Indonesia
    ILS: 'IL', // Israeli New Shekel - Israel
    IMP: 'IM', // Manx pound - Isle of Man
    INR: 'IN', // Indian Rupee - India
    IQD: 'IQ', // Iraqi Dinar - Iraq
    IRR: 'IR', // Iranian Rial - Iran
    ISK: 'IS', // Icelandic Króna - Iceland
    JEP: 'JE', // Jersey Pound - Jersey
    JMD: 'JM', // Jamaican Dollar - Jamaica
    JOD: 'JO', // Jordanian Dinar - Jordan
    JPY: 'JP', // Japanese Yen - Japan
    KES: 'KE', // Kenyan Shilling - Kenya
    KGS: 'KG', // Kyrgystani Som - Kyrgyzstan
    KHR: 'KH', // Cambodian Riel - Cambodia
    KMF: 'KM', // Comorian Franc - Comoros
    KPW: 'KP', // North Korean Won - North Korea
    KRW: 'KR', // South Korean Won - South Korea
    KWD: 'KW', // Kuwaiti Dinar - Kuwait
    KYD: 'KY', // Cayman Islands Dollar - Cayman Islands
    KZT: 'KZ', // Kazakhstani Tenge - Kazakhstan
    LAK: 'LA', // Laotian Kip - Laos
    LBP: 'LB', // Lebanese Pound - Lebanon
    LKR: 'LK', // Sri Lankan Rupee - Sri Lanka
    LRD: 'LR', // Liberian Dollar - Liberia
    LSL: 'LS', // Lesotho Loti - Lesotho
    LYD: 'LY', // Libyan Dinar - Libya
    MAD: 'MA', // Moroccan Dirham - Morocco
    MDL: 'MD', // Moldovan Leu - Moldova
    MGA: 'MG', // Malagasy Ariary - Madagascar
    MKD: 'MK', // Macedonian Denar - North Macedonia
    MMK: 'MM', // Myanmar Kyat - Myanmar
    MNT: 'MN', // Mongolian Tugrik - Mongolia
    MOP: 'MO', // Macanese Pataca - Macau
    MRU: 'MR', // Mauritanian Ouguiya - Mauritania
    MUR: 'MU', // Mauritian Rupee - Mauritius
    MVR: 'MV', // Maldivian Rufiyaa - Maldives
    MWK: 'MW', // Malawian Kwacha - Malawi
    MXN: 'MX', // Mexican Peso - Mexico
    MYR: 'MY', // Malaysian Ringgit - Malaysia
    MZN: 'MZ', // Mozambican Metical - Mozambique
    NAD: 'NA', // Namibian Dollar - Namibia
    NGN: 'NG', // Nigerian Naira - Nigeria
    NIO: 'NI', // Nicaraguan Córdoba - Nicaragua
    NOK: 'NO', // Norwegian Krone - Norway
    NPR: 'NP', // Nepalese Rupee - Nepal
    NZD: 'NZ', // New Zealand Dollar - New Zealand
    OMR: 'OM', // Omani Rial - Oman
    PAB: 'PA', // Panamanian Balboa - Panama
    PEN: 'PE', // Peruvian Sol - Peru
    PGK: 'PG', // Papua New Guinean Kina - Papua New Guinea
    PHP: 'PH', // Philippine Peso - Philippines
    PKR: 'PK', // Pakistani Rupee - Pakistan
    PLN: 'PL', // Polish Zloty - Poland
    PYG: 'PY', // Paraguayan Guarani - Paraguay
    QAR: 'QA', // Qatari Rial - Qatar
    RON: 'RO', // Romanian Leu - Romania
    RSD: 'RS', // Serbian Dinar - Serbia
    RUB: 'RU', // Russian Ruble - Russia
    RWF: 'RW', // Rwandan Franc - Rwanda
    SAR: 'SA', // Saudi Riyal - Saudi Arabia
    SBD: 'SB', // Solomon Islands Dollar - Solomon Islands
    SCR: 'SC', // Seychellois Rupee - Seychelles
    SDG: 'SD', // Sudanese Pound - Sudan
    SEK: 'SE', // Swedish Krona - Sweden
    SGD: 'SG', // Singapore Dollar - Singapore
    SHP: 'SH', // Saint Helena Pound - Saint Helena
    SLL: 'SL', // Sierra Leonean Leone - Sierra Leone
    SOS: 'SO', // Somali Shilling - Somalia
    SRD: 'SR', // Surinamese Dollar - Suriname
    SSP: 'SS', // South Sudanese Pound - South Sudan
    STN: 'ST', // São Tomé and Príncipe Dobra - São Tomé and Príncipe
    SVC: 'SV', // Salvadoran Colón - El Salvador
    SYP: 'SY', // Syrian Pound - Syria
    SZL: 'SZ', // Swazi Lilangeni - Eswatini
    THB: 'TH', // Thai Baht - Thailand
    TJS: 'TJ', // Tajikistani Somoni - Tajikistan
    TMT: 'TM', // Turkmenistani Manat - Turkmenistan
    TND: 'TN', // Tunisian Dinar - Tunisia
    TOP: 'TO', // Tongan Pa'anga - Tonga
    TRY: 'TR', // Turkish Lira - Turkey
    TTD: 'TT', // Trinidad and Tobago Dollar - Trinidad and Tobago
    TWD: 'TW', // New Taiwan Dollar - Taiwan
    TZS: 'TZ', // Tanzanian Shilling - Tanzania
    UAH: 'UA', // Ukrainian Hryvnia - Ukraine
    UGX: 'UG', // Ugandan Shilling - Uganda
    USD: 'US', // US Dollar - United States
    UYU: 'UY', // Uruguayan Peso - Uruguay
    UZS: 'UZ', // Uzbekistan Som - Uzbekistan
    VES: 'VE', // Venezuelan Bolívar - Venezuela
    VND: 'VN', // Vietnamese Dong - Vietnam
    VUV: 'VU', // Vanuatu Vatu - Vanuatu
    WST: 'WS', // Samoan Tala - Samoa
    XAF: 'CM', // CFA Franc BEAC - Central Africa (Cameroon as representative)
    XAG: 'EU', // Silver Ounce - Generic
    XAU: 'EU', // Gold Ounce - Generic
    XCD: 'AG', // East Caribbean Dollar - Eastern Caribbean (Antigua as representative)
    XDR: 'EU', // IMF Special Drawing Rights - International
    XOF: 'SN', // CFA Franc BCEAO - West Africa (Senegal as representative)
    XPF: 'PF', // CFP Franc - French Polynesia
    YER: 'YE', // Yemeni Rial - Yemen
    ZAR: 'ZA', // South African Rand - South Africa
    ZMW: 'ZM', // Zambian Kwacha - Zambia
    ZWL: 'ZW', // Zimbabwean Dollar - Zimbabwe
};

const CurrencyRateList = () => {
    const [rates, setRates] = useState({});
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);

    const nairaRate = rates['NGN'] || 460;

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch(BASE_URL);
                const data = await res.json();
                if (data && data.conversion_rates) {
                    setRates(data.conversion_rates);
                }
            } catch (error) {
                console.error('Failed to fetch exchange rates', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    const currencyCodes = Object.keys(rates).filter(code => code !== 'NGN');
    const visibleCurrencies = showAll ? currencyCodes : currencyCodes.slice(0, 10);

    if (loading) return <p className="p-4 text-center">Loading rates...</p>;

    return (
        <section id="liveRates" className="w-full space-y-4 p-4">
            <div className="text-center md:pb-10">
                <h2 className="text-[28px] sm:text-[38px] xmd:text-[48px] font-semibold">
                    Live Exchange Rates
                </h2>
                <p className="text-Gray">
                    Compare 100+ currencies in real time & find the right moment to transfer funds
                </p>
            </div>

            {visibleCurrencies.map((code, index) => {
                const rate = rates[code];
                const buy = Math.round(rate * nairaRate * 0.98);
                const sell = Math.round(rate * nairaRate * 1.02);
                const countryCode = currencyToCountry[code] || 'US'; // fallback to US
                // const flagUrl = `https://countryflagsapi.com/png/${countryCode}`;
                const flagUrl = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;

                return (
                    <motion.div
                        key={code}
                        variants={SlideUp(0.3)}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="bg-white shadow border rounded-md p-4 md:grid md:grid-cols-3 md:items-center justify-between"
                    >
                        {/* Left: Flag and Currency */}
                        <div className="flex flex-col gap-4 mb-4 md:mb-0">
                            <img src={flagUrl} alt={code} className="w-20 md:w-32 object-contain" />
                            <div className="flex flex-col">
                                <span className="text-sm">{code}</span>
                                <span className="md:hidden text-xs italic text-gray-500">{code} to Naira rate</span>
                            </div>
                        </div>

                        {/* Center: Labels */}
                        <div className="flex justify-between md:flex-col md:items-start text-sm font-medium text-gray-700 gap-1 mb-2 md:mb-0">
                            <span className="hidden md:block italic text-gray-500">{code} to Naira rate</span>
                            <p>BUY</p>
                            <p>SELL</p>
                        </div>

                        {/* Right: Values */}
                        <div className="flex justify-between md:flex-col md:items-end gap-1">
                            <p className="font-semibold text-gray-800">₦{buy}</p>
                            <p className="font-semibold text-gray-800">₦{sell}</p>
                        </div>
                    </motion.div>
                );
            })}

            {!showAll && currencyCodes.length > 10 && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowAll(true)}
                        className="bg-Custom-primary hover:bg-blue-300 transition transform hover:scale-105 duration-200 text-white py-4 my-4 px-8 rounded-md"
                    >
                        More
                    </button>
                </div>
            )}
        </section>
    );
};

export default CurrencyRateList;
