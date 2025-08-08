import React, { useState } from 'react';
import { API_URL } from '../data/apipath';

function Register({handlelogin}) {
  const [Name, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Error, setError] = useState("");
  const [Loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/vendor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Name, Email, Password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        alert("Vendor register success");
        setUserName('');
        setEmail('');
        setPassword('');
        handlelogin()
      } else {
        setError(data.message || "Registration failed");
      }
     

    } catch (error) {
      console.error("Registration failed", error);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='Registersection'>
      <form className='authform' onSubmit={handleSubmit}>
        <h2>Vendor-Register</h2>

        {Error && <p style={{ color: "red" }}>{Error}</p>}

        <label>Name</label>
        <input
          type="text"
          placeholder='Enter the name'
          name="Name"
          value={Name}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder='Enter Email'
          name="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder='Enter Password'
          name="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn1" type='submit' disabled={Loading}>
          {Loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Register;
