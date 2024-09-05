import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow from '../../assets/arrow.png'


const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="" className='w-32 h-32'/>
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
        <button>Sign Up <img src={arrow} alt="" className='w-10 h-10'/></button>
      </div>
    </div>
  )
}

export default Navbar
