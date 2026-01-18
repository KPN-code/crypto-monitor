import './styles/main.css'; // tyylitiedosto
import { useState, useEffect } from 'react'; // React hookit
import { Line } from 'react-chartjs-2'; // Chart.js React wrapper
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchCryptoData } from './services/cryptoApi'; // tietojen haku API:sta

// Rekisteröidään Chart.js komponentit
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Top 10 coin valikkoon
const topCoins = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'binancecoin', name: 'BNB' },
  { id: 'ripple', name: 'XRP' },
  { id: 'cardano', name: 'ADA' },
  { id: 'solana', name: 'SOL' },
  { id: 'dogecoin', name: 'DOGE' },
  { id: 'polkadot', name: 'DOT' },
  { id: 'litecoin', name: 'LTC' },
  { id: 'tron', name: 'TRX' }
];

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState(topCoins[0].id); // valittu coin
  const [data, setData] = useState(null); // coin data
  const [loading, setLoading] = useState(false); // latausstatus
  const [error, setError] = useState(null); // virheet

  // Funktio hakee API:sta dataa
  const getCryptoData = async (coinId) => {
    setLoading(true); // aloitetaan lataus
    setError(null); // tyhjennetään virhe
    try {
      const result = await fetchCryptoData(coinId); // haetaan data
      setData(result); // asetetaan data stateen
    } catch (err) {
      setError(err.message || 'Failed to fetch data'); // virhetilanteessa
      setData(null);
    } finally {
      setLoading(false); // lopetetaan lataus
    }
  };

  // Käynnistetään datan haku aina kun valittu coin vaihtuu
  useEffect(() => {
    getCryptoData(selectedCoin);
  }, [selectedCoin]);

  return (
    <div className="app" style={{ textAlign: 'center', padding: '2rem' }}>
      <h1> Crypto Monitor </h1>

      {/* Coin valikko */}
      <select
        value={selectedCoin}
        onChange={(e) => setSelectedCoin(e.target.value)}
        style={{ fontSize: '1rem', padding: '0.5rem', marginBottom: '1rem' }}
      >
        {topCoins.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>

      {/* Status */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Näytetään data jos saatavilla */}
      {data && (
        <div className="crypto-card" style={{ marginTop: '2rem' }}>
          <h2>{data.name}</h2>
          <p>Current: ${data.current}</p>
          <p>24h High: ${data.high}</p>
          <p>24h Low: ${data.low}</p>
          <p>1 week ago: ${data.oneWeekAgo}</p>
          <p>1 month ago: ${data.oneMonthAgo}</p>
          <p>1 year ago: ${data.oneYearAgo}</p>

          <h3>📈 1 Month Price Chart</h3>
          <Line data={data.chartData} /> {/* Chart.js graafi */}
        </div>
      )}
    </div>
  );
};

export default App;
