import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/blockchain2.png';
import arrow from '../../assets/arrow.png';
import { CoinContext } from '../../context/CoinContext';

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const [showMessage, setShowMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case 'usd': {
        setCurrency({ name: 'usd', symbol: '$' });
        break;
      }
      case 'cad': {
        setCurrency({ name: 'cad', symbol: 'CA$' });
        break;
      }
      case 'inr': {
        setCurrency({ name: 'inr', symbol: 'INR' });
        break;
      }
      default: {
        setCurrency({ name: 'usd', symbol: '$' });
        break;
      }
    }
  };

  const handleSignupClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <a href="/"><img src={logo} alt="" />CryptoXCoin</a>
        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          {/* <li>Dashboard</li> */}
          {/* <li>Markets</li> */}
          {/* <li>Pricing</li> */}
          {/* <li>Blog</li> */}
        </ul>

        <div className="nav-right">
          <select onChange={currencyHandler}>
            <option value="usd">USD</option>
            <option value="cad">CAD</option>
            <option value="inr">INR</option>
          </select>
          <div className="signup-container">
            <button onClick={handleSignupClick}>
              Sign up
              <img src={arrow} alt=" " />
            </button>

            {showMessage && (
              <div className="coming-soon-message">
                Coming Soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
