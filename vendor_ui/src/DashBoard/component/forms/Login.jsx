import React, { useState } from 'react';
import { API_URL } from '../data/apipath';

function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const loginhandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email, Password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login success");
        setEmail("");
        setPassword("");
        localStorage.setItem("login token", data.token);

        const vendorId = data.vendorId;
        console.log("Vendor ID:", vendorId);

        const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`);
        const vendorData = await vendorResponse.json();

        if (vendorResponse.ok) {
          console.log("Vendor Data:", vendorData);

          // Safely extract restaurant data
          const vendorrestaurantid = vendorData.vendorrestaurantid || null;
          let RestaurantName = null;

          if (vendorData.vendor?.Restaurant?.length > 0) {
            RestaurantName = vendorData.vendor.Restaurant[0].firmname;
          }

          // Save to localStorage
          if (RestaurantName) {
            localStorage.setItem('RestaurantName', RestaurantName);
          }
          if (vendorrestaurantid) {
            localStorage.setItem('Id', vendorrestaurantid);
          }

          console.log("Restaurant ID:", vendorrestaurantid);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className='Loginsection'>
      <form className='authform' onSubmit={loginhandler}>
        <h2>Vendor Login</h2>
        <label>Email</label><br />
        <input
          type="email"
          placeholder='Enter Email'
          value={Email}
          name="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label><br />
        <input
          type="password"
          placeholder='Enter Password'
          value={Password}
          name="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn1" type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Login;
