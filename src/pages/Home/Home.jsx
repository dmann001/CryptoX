import React, { useContext,useEffect,useState } from 'react';
import Uparrow from '../../assets/up-arrow.png';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';

const Home = () => {
  const {allCoin, currency}= useContext(CoinContext);
  const [displayCoin, SetDisplayCoin]= useState([]);

useEffect(()=>{
  SetDisplayCoin(allCoin);
},[allCoin])

  return (
    <div className="home">
      <div className="hero">
        <h1>Crypto Price Tracker</h1>
        <p>
          Welcome to the Cryptocurrency Watchlist for prices. Explore all the prices
          and trends of various coins.
        </p>
        <form>
          <input type="text" placeholder="Search Crypto" />
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
          <p style={{textAlign:"center"}}>24h</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {
          displayCoin.slice(0,10).map((item,index)=>(
            <div className="table-layout" key={index}>
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt="" />
                <p>{item.name +" - "+ item.symbol}</p>
              </div>
              <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
              <p className={item.price_change_percentage_24h>0?"green":"red"}>
                {Math.floor(item.price_change_percentage_24h*100)/100}%
              </p>
              <p className="market-cap">{currency.symbol}{item.market_cap.toLocaleString()}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Home;
