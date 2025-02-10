// Coin.jsx-->
import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';
import { ExternalLink, Github, Twitter, MessageCircle } from 'lucide-react';
import { BsTwitterX} from "react-icons/bs";
import { FaExternalLinkAlt, FaGithub  } from "react-icons/fa";
import { inject } from '@vercel/analytics';



const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState();
  const { currency } = useContext(CoinContext);
  const apiKey = import.meta.env.VITE_API_KEY;

   useEffect(() => {
      inject();
    }, []);
  

  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey },
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await response.json();
      setCoinData(data);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  const fetchHistoricalData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey },
    };

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10`, options)
      .then(res => res.json())
      .then(res => setHistoricalData(res))
      .catch(err => console.error(err));
  };
  
  
  

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency]);

  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin-container">
      {/* Header Section */}
      <div className="coin-header">
        <div className="coin-name">
          {coinData.image ? (
            <img src={coinData.image.large} alt={coinData.name} />
          ) : (
            <span>Loading image...</span>
          )}
          <div className="coin-title">
            <h1>
              {coinData.name} ({coinData.symbol.toUpperCase()})
            </h1>
            <div className="coin-rank">Rank #{coinData.market_cap_rank}</div>
          </div>
        </div>

        {/* Social Links */}
        <div className="social-links">
          {coinData.links.homepage[0] && (
            <a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt size={20} />
            </a>
          )}
          {coinData.links.twitter_screen_name && (
            <a href={`https://x.com/${coinData.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
              <BsTwitterX size={20} />
            </a>
          )}
          {coinData.links.repos_url.github[0] && (
            <a href={coinData.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
              <FaGithub size={20} />
            </a>
          )}
        </div>
      </div>
      {/* Coin Market Data Section */}
<div className="market-data">
  <h3>Coin Market Data</h3>
  <div className="market-grid">
    <div className="market-item">
      <strong>Current Price:</strong> {currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}
    </div>
    <div className="market-item">
      <strong>Market Cap:</strong> {currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}
    </div>
    <div className="market-item">
      <strong>24 Hour High:</strong> {currency.symbol} {coinData.market_data.high_24h[currency.name].toLocaleString()}
    </div>
    <div className="market-item">
      <strong>24 Hour Low:</strong> {currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}
    </div>
   
    <div className="market-item">
      <strong>Fully Diluted Valuation:</strong> {currency.symbol} {coinData.market_data.fully_diluted_valuation[currency.name].toLocaleString()}
    </div>
    <div className="market-item">
      <strong>24h Trading Volume:</strong> {currency.symbol} {coinData.market_data.total_volume[currency.name].toLocaleString()}
    </div>
    <div className="market-item">
      <strong>Circulating Supply:</strong> {coinData.market_data.circulating_supply.toLocaleString()}
    </div>
    {/* <div className="market-item">
      <strong>Total Supply:</strong> {coinData.market_data.total_supply?.toLocaleString() || "N/A"}
    </div> */}
    <div className="market-item">
      <strong>Max Supply:</strong> {coinData.market_data.max_supply?.toLocaleString() || "N/A"}
    </div>
    {/* <div className="market-item">
      <strong>All-Time Low:</strong> {currency.symbol} {coinData.market_data.low_24h[currency.name]?.toLocaleString() || "N/A"}
    </div> */}
  </div>
</div>

      {/* Chart Section */}
      <div className="coin-chart">
      <p className="chart-title">Last 10 Days Price Trend – {coinData.name}</p>
        <LineChart historicalData={historicalData} />
      </div>


      {/* Key Info Grid */}
      <div className="info-grid">
  <div className="info-card">
    <h3>Technical Info</h3>
    <div className="info-content">
      <p><strong>Hash Algorithm:</strong> {coinData.hashing_algorithm}</p>
      <p><strong>Block Time:</strong> {coinData.block_time_in_minutes} minutes</p>
      <p>
        <strong>Genesis Date:</strong>{' '}
        {coinData.genesis_date
          ? new Date(coinData.genesis_date).toLocaleDateString()
          : 'N.A'}
      </p>
    </div>
  </div>



        <div className="info-card">
          <h3>Categories</h3>
          <div className="categories">
            {coinData.categories.map((category, index) => (
              category && <span key={index} className="category-tag">{category}</span>
            ))}
          </div>
        </div>

        <div className="info-card">
          <h3>Community Sentiment</h3>
          <div className="sentiment-stats">
            <div className="sentiment-bar">
              <div 
                className="sentiment-up"
                style={{ width: `${coinData.sentiment_votes_up_percentage}%` }}
              >
                {coinData.sentiment_votes_up_percentage.toFixed(1)}%
              </div>
            </div>
            <p><strong>Watchlist Users:</strong> {coinData.watchlist_portfolio_users.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <h3>About {coinData.name}</h3>
        <div 
          className="description-content"
          dangerouslySetInnerHTML={{ __html: coinData.description.en }}
        />
      </div>

      {/* Resources Section */}
      <div className="resources-section">
        <h3>Crypto Resources</h3>
        <div className="resources-grid">
          {coinData.links.blockchain_site.slice(0, 3).map((site, index) => (
            site && (
              <a 
                key={index}
                href={site}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                Block Explorer {index + 1}
              </a>
            )
          ))}
          {coinData.links.whitepaper && (
            <a 
              href={coinData.links.whitepaper}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Whitepaper
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coin;