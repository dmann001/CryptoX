import React, { useContext, useEffect, useState } from 'react';
import Uparrow from '../../assets/up-arrow.png';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');

  const inputHandler = (event) => {
    setInput(event.target.value);
    if(event.target.value ===""){
      setDisplayCoin(allCoin);
    }
  }

  const searchHandler = (event) => {
    event.preventDefault();
    if (!input.trim()) {
      // If input is empty or only contains whitespace, reset displayCoin to show all coins
      setDisplayCoin(allCoin);
      return;
    }
    const coins = allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
  }
  const formatPrice = (price) => {
    if (price === 0) return '0';
    if (price < 0.01) {
      // For very small numbers,
      return price.toFixed(6);
    }
    if (price < 1) {
      // For numbers less than 1 but greater than 0.01, show up to 4 decimal places
      return price.toFixed(4);
    }
    if (price < 10) {
      return price.toFixed(2);
    }

    // For numbers >= 10, round to the nearest whole number and return without decimals
    return Math.round(price).toLocaleString();
  }

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin])

  return (
    <div className="home">
      <div className="hero">
        <h1>Crypto Price Tracker</h1>
        <p>
          Welcome to the Cryptocurrency Watchlist for prices. Explore all the prices
          and trends of various coins.
        </p>
        <form onSubmit={searchHandler}>
          <input 
            onChange={inputHandler} 
            list = 'coinlist'
            value={input} 
            type="text" 
            placeholder="Search Crypto"
          />
          <datalist id='coinlist'>
            {allCoin.map((item,index)=>(<option key={index} value={item.name}/>))}

          </datalist>
          <button type="submit">
            <img src={Uparrow} alt="Search" />
          </button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign: "center"}}>24h</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {displayCoin.slice(0,20).map((item, index) => (
          <div className="table-layout" key={index}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt="" />
              <p>{item.name + " - " + item.symbol}</p>
            </div>
            <p>{currency.symbol} {formatPrice(item.current_price)}</p>
            <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
              {Math.floor(item.price_change_percentage_24h * 100) / 100}%
            </p>
            <p className="market-cap">{currency.symbol}{item.market_cap.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;