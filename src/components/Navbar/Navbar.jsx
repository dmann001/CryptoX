import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/blockchain2.png'
import arrow from '../../assets/arrow.png'
import { CoinContext } from '../../context/CoinContext'

const Navbar = () => {

  const {setCurrency} = useContext(CoinContext)
  const currencyHandler = (event)=>{
    switch (event.target.value){
      case "usd":{
        setCurrency({name:"usd", symbol:"$"});
        break;
      }
      case "cad" :{
        setCurrency({name:"cad", symbol:"CA$"});
        break;
      }
      default:{
        setCurrency({name:"usd", symbol:"$"});
        break;
      }
    }
  }
  return (
    <div className="navbar">
        <span className='logo'>
            <a href="/"><img src={logo} alt="" />CryptoX</a></span>
        
        <ul>
            {/* <li>Dashboard</li> */}
            <li>Markets</li>
            {/* <li>Pricing</li>
            <li>Blog</li> */}
        </ul>
        <div className="nav-right">
            <select onChange={currencyHandler}>
                <option value="usd">USD</option>
                <option value="cad">CAD</option>
                </select>
                <button>Sign up<img src={arrow} alt=" "/></button>
        </div>
    </div>
  )
}

export default Navbar
