import React from 'react'
import "./AllProducts.css"
import { Link } from 'react-router-dom'
const NotFound = () => {
  return (
   
    <div className='pagenotfound'>
         <Link to={"/"}>Go Back</Link>
        <h1>
            404
        </h1>
        <div>
            Page Not Found
        </div>
    </div>
  )
}

export default NotFound