const CURRENCY_SYMBOLS = {
    AUD: "A$",
    BGN: "лв",
    BRL: "R$",
    CAD: "C$",
    CHF: "CHF",
    CNY: "¥",
    CZK: "Kč",
    DKK: "kr",
    EUR: "€",
    GBP: "£",
    HKD: "HK$",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    INR: "₹",
    ISK: "kr",
    JPY: "¥",
    KRW: "₩",
    MXN: "Mex$",
    MYR: "RM",
    NOK: "kr",
    NZD: "NZ$",
    PHP: "₱",
    PLN: "zł",
    RON: "lei",
    SEK: "kr",
    SGD: "S$",
    THB: "฿",
    TRY: "₺",
    USD: "$",
    ZAR: "R"
};

/**
 * Formats the currency given the amount (symbol i.e. $ included)
 * @param {number} amount amount in USD formatted with the currency specified in settings
 * @returns the full string amount rounded to 4 decimal places (e.x. 0.0001 -> $0.0001)
 */
async function formatCurrency(amount, decimals = 4) {
    let settings = JSON.parse(localStorage.getItem('settings'));
    if (!settings) {
        settings = { currency: 'USD' };
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    let currency = settings.currency;
    return `${CURRENCY_SYMBOLS[currency]}${(await convertFromUSD(amount, currency)).toPrecision(decimals)}`;
}

// Frankfurter API will return an object something like this for the URL used:
// {
//   "base": "USD",
//   "date": "2025-05-08", (latest date in this case)
//   "rates": {
//     "AUD": 1.5584,
//   }
// }
let rates = {};
async function convertFromUSD(amount, currency) {
    if (currency === 'USD') {
        return amount;
    }
    if (!rates[currency]) {
        rates = await fetchRates();
    }
    if (rates[currency]) {
        return amount * rates[currency];
    } else {
        console.error(`Currency ${currency} not found`);
        return amount;
    }
}

async function fetchRates() {
    const url = `https://api.frankfurter.dev/v1/latest?base=USD`;
    let response = await fetch(url);
    let json = await response.json();
    return json.rates;
}