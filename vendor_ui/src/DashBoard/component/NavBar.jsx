import React from 'react'


const NavBar = ({login,register,logout,logouthandler}) => {
  const firmname=localStorage.getItem("RestaurantName");
  return (
    <div className="main-block">
        <div className="Company">Vendor DashBoard</div>
        <div>{firmname}</div>
        <div className="user-auth">
          {!logout?<><span onClick={login}>Login</span>
            <span onClick={register}>Register</span></>:<span onClick={logouthandler}>logout</span>}
        </div>
     </div>
  )
}

export default NavBar