import { useState, useEffect } from 'react';

const BASE_URL = 'https://api.coingecko.com/api/v3'; // API perusosoite

// Hook yksittäisen coinin tietojen hakemiseen
export const useCrypto = (coinId) => {
  const [data, setData] = useState(null); // säilyttää datan
  const [loading, setLoading] = useState(false); // lataustila
  const [error, setError] = useState(null); // virhetilan säilytys

  useEffect(() => {
    if (!coinId) return; // jos coinId puuttuu, lopeta

    const fetchData = async () => {
      setLoading(true); // aloita lataus
      setError(null); // nollaa virhe
      try {
        const res = await fetch(
          `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=hourly` // fetch API:sta
        );
        if (!res.ok) throw new Error('Failed to fetch data'); // virhe tarkistus
        const json = await res.json(); // parsitaan JSON

        const prices = json.prices.map(([time, price]) => ({ time: new Date(time), price })); // muotoile hinnat
        const current = prices[prices.length - 1]; // viimeisin hinta
        const high = prices.reduce((a, b) => (b.price > a.price ? b : a), prices[0]); // päivän korkein
        const low = prices.reduce((a, b) => (b.price < a.price ? b : a), prices[0]); // päivän alin

        setData({
          coinName: coinId, // coinin nimi
          current, // nykyinen
          high, // korkein
          low, // alin
        });
      } catch (err) {
        setError(err.message); // aseta virhe
        setData(null); // tyhjennä data
      } finally {
        setLoading(false); // lopeta lataus
      }
    };

    fetchData(); // kutsu fetchData funktiota
  }, [coinId]); // dependency coinId

  return { data, loading, error }; // palauta tilat
};

// Hook top 10 coinin hakemiseen
export const useTopCoins = () => {
  const [coins, setCoins] = useState([]); // säilytä coin-lista
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1` // top 10 fetch
        );
        const json = await res.json(); // parsitaan JSON
        setCoins(json.map((c) => ({ id: c.id, name: c.name }))); // aseta coin-lista
      } catch (err) {
        console.error('Failed to fetch top coins', err); // virhe konsoliin
      }
    };
    fetchCoins(); // kutsu fetchCoins
  }, []); // vain kerran

  return coins; // palauta top coins
};
