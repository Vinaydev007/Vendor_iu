import React from 'react'

function SideBar({restaurant,product,Allproduct,titleuse}) {
  return (
    <div className="sidebarsection">
        <ul>
          {titleuse? <li onClick={restaurant}>Add_Restaurant</li>:""}
            <li onClick={product}>Add_Prducts</li>
            <li onClick={Allproduct}>All_Products</li>
            <li>User_Details</li>
        </ul>
    </div>
  )
}

export default SideBar