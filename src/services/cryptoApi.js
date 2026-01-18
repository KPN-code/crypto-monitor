const BASE_URL = 'https://api.coingecko.com/api/v3'; // API perusosoite

// Funktio hakee coinin nyky- ja historiallisen datan
export const fetchCryptoData = async (coinId) => {
  try {
    // Nykyinen markkinadata
    const res = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&ids=${coinId}`); // fetch nykyhinta
    if (res.status === 429) throw new Error('Too many requests – please wait a moment and try again.'); // liian monta pyyntöä
    if (!res.ok) throw new Error('Failed to fetch data'); // muu virhe
    const data = await res.json(); // parsitaan JSON
    if (!data[0]) throw new Error('Coin not found'); // coin ei löytynyt

    const result = {
      name: data[0].name, // coin nimi
      current: data[0].current_price, // nykyhinta
      high: data[0].high_24h, // 24h korkein
      low: data[0].low_24h // 24h alin
    };

    // Hae 1kk historia
    const historyRes = await fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=30`); // 30 päivän historia
    if (!historyRes.ok) throw new Error('Failed to fetch historical data'); // virhe historiassa
    const historyData = await historyRes.json(); // parsitaan JSON
    const prices = historyData.prices; // [timestamp, price] array

    // Muodosta data Chart.js:lle
    result.chartData = {
      labels: prices.map(p => new Date(p[0]).toLocaleDateString()), // päivämäärät
      datasets: [
        {
          label: 'Price (USD)', // datasetin nimi
          data: prices.map(p => p[1]), // hinnat
          borderColor: '#38bdf8', // viivan väri
          backgroundColor: 'rgba(56, 189, 248, 0.2)', // täyttöväri
          fill: true, // täyttö päälle
          tension: 0.2 // kaarevuus viivassa
        }
      ]
    };

    return result; // palauta valmis objekti
  } catch (err) {
    throw err; // heitä virhe ylös
  }
};
