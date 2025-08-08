import React, { useState } from 'react'
import { API_URL } from '../data/apipath';

function login() {
  const [Email,setEmail]=useState("");
  const [Password,setPassword]=useState("")

  const loginhandler=async(e)=>{
    e.preventDefault();
    try {
      const response =await fetch(`${API_URL}/vendor/login`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({Email,Password})
      })
      const data=await response.json();
      if(response.ok){
        alert("login success");
        setEmail("");
        setPassword("")
        localStorage.setItem("login token",data.token)
      }
      const vendorId=data.vendorId;
      console.log("checking for vendorid:",vendorId);
      const vendorResponse=await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`);
      const vendorData=await vendorResponse.json();
      if(vendorResponse.ok){
        console.log(vendorData);
        const vendorRestaurantId=vendorData.message.vendorrestaurantid;
        const RestaurantName=vendorData.message.vendor.Restaurant[0].firmname;
        // console.log(RestaurantName);
        localStorage.setItem('RestaurantName',RestaurantName);
        localStorage.setItem('Id',vendorRestaurantId);
        console.log("checking for resID",vendorRestaurantId)
        window.location.reload();

      }
      
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='Loginsection'>
        
        <form className='authform' onSubmit={loginhandler}>
        <h2>Vendor-Login</h2>
            <label >Email</label><br />
            <input type="Email" placeholder='Enter Email' value={Email} name="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
            <label >Password</label><br />
            <input type="Password" placeholder='Enter Password'  value={Password} name="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <button className="btn1"type='submit'>submit</button>
        </form>
    </div>
  )
}

export default login