import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow from '../../assets/arrow.png'


const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="" style={{ width: '100px', height: 'auto' }} />
      <ul>
        <li>Home</li>
        <li>Features</li>
        <li>Pricing</li>
        <li>Blog</li>
      </ul>
      <div className="nav-right">
        <select>
            <option value="usd">USD</option>
            <option value="eur">EURO</option>
            <option value="inr">INR</option>
        </select>
        <button>Sign Up </button>
      </div>
    </div>
  )
}

export default Navbar
