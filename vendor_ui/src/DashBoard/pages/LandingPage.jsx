import React from "react";
import NavBar from "../component/NavBar";
import SideBar from "../component/SideBar";
import Login from "../component/forms/login";
import Register from "../component/forms/Register";
import Add_Restaurant from "../component/forms/Add_Restaurant";
import Add_Product from "../component/forms/Add_Product";
import { useState,useEffect } from "react";
import AllProducts from "../component/AllProducts";

const LandingPage = () => {
  const [login,setlogin]=useState(false);
  const [register,setregister]=useState(false);
  const [restaurant,setrestaurant]=useState(false);
  const [product,setproduct]=useState(false);
  const [Allproducts,setAllproducts]=useState(false);
  const [logout,setlogout]=useState(false);
  const [titleuse,settitleuse]=useState(true);


   useEffect(()=>{
    const logoutid=localStorage.getItem("login token");
    if(logoutid){
     setlogout(true)
    }
  },[])

  useEffect(()=>{
    const RestaurantName=localStorage.getItem("RestaurantName");
    if(RestaurantName){
     settitleuse(false)
    }
  },[])
   
  const logouthandler=()=>{
      localStorage.removeItem("login token");
      localStorage.removeItem("Id");
      localStorage.removeItem("RestaurantName");
      setlogout(false);
      settitleuse(true)
  }
 

  const loginhandler=()=>{
        setlogin(true);
        setregister(false)
        setrestaurant(false)
        setproduct(false)
        setAllproducts(false);
  }
  const registerhandler=()=>{
    setregister(true)
    setlogin(false)
    setproduct(false)
    setrestaurant(false)
    setAllproducts(false);
  }
  const restauranthandler=()=>{
    if(logout){
    setregister(false)
    setlogin(false)
    setproduct(false)
    setrestaurant(true)
    setAllproducts(false);
  }
  else{
    alert("login first")
    setlogin(true)
  }
  }
  const producthandler=()=>{
    if(logout){
    setregister(false)
    setlogin(false)
    setrestaurant(false)
    setproduct(true)
    setAllproducts(false);
    }
    else{
      alert("login first")
      setlogin(true)
    }
  }
  const HandleAllproducts=()=>{
    if(logout){
    setregister(false)
    setlogin(false)
    setrestaurant(false)
    setproduct(false)
    setAllproducts(true);
    }
    else{
      alert("login first")
      setlogin(true)
    }
  }
  return (
    <div>
      <NavBar  login={loginhandler} register={registerhandler} logout={logout} logouthandler={logouthandler}/>
      <div className="collectionsection">
        <SideBar restaurant={restauranthandler} product={producthandler} Allproduct={HandleAllproducts} titleuse={titleuse}/>
        {login&&<Login/>}
        {register &&<Register  handlelogin={loginhandler}/>}
        {restaurant && logout &&<Add_Restaurant/>}
        {product && logout&&<Add_Product/>}
        {Allproducts && logout&&<AllProducts/>}
      </div>
    </div>
  );
};

export default LandingPage;
