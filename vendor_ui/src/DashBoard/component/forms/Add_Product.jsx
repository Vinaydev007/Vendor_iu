import React, { useState } from 'react';
import { API_URL } from '../data/apipath'; // Make sure this is correctly defined

function Add_Product() {
  const [ProductName, setProductName] = useState("");
  const [Price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [BestSeller, setBestSeller] = useState(false);
  const [image, setImage] = useState(null);
  const [Description, setDescription] = useState("");

  // ✅ Handle checkbox for Veg / Non-Veg
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  // ✅ Fix: Image upload state variable was wrong (`setFile`)
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  // ✅ Fix: BestSeller radio input handler logic
  const BestSellerhandler = (e) => {
    const value = e.target.value === 'true';
    setBestSeller(value);
  };

  // ✅ Submit handler
  const handleAddProducts = async (e) => {
    e.preventDefault();
    try {
      const logintoken = localStorage.getItem('login token');
      const firmid = localStorage.getItem('Id');
     console.log(logintoken,firmid);
      if (!logintoken || !firmid) {
        console.log("User not authenticated");
        return;
      }

      const formData = new FormData();
      formData.append("ProductName", ProductName);
      formData.append("Price", Price);
      formData.append("Description", Description);
      formData.append("BestSeller", BestSeller);
      formData.append("image", image);

      category.forEach((value) => {
        formData.append("category", value);
      });

      const response = await fetch(`${API_URL}/product/add-product/${firmid}`, {
        method: 'POST',
        headers: {
          token:logintoken
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully");
      } else {
        console.error("Error adding product:", data.message);
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className='Productsection'>
      <form className='formtable' onSubmit={handleAddProducts}>
        <h3>Add Products</h3>

        <label>Product Name</label>
        <input type="text" value={ProductName} onChange={(e) => setProductName(e.target.value)} />

        <label>Price</label>
        <input type="text" value={Price} onChange={(e) => setPrice(e.target.value)} />

        <div className="checkInp">
          <label>Category</label>
          <div className="Input-conatiner">
            <div className="checkbox-container">
              <label>Veg</label>
              <input
                type="checkbox"
                value="veg"
                checked={category.includes("veg")}
                onChange={handleCategoryChange}
              />
            </div>
            <div className="checkbox-container">
              <label>Non-Veg</label>
              <input
                type="checkbox"
                value="non-veg"
                checked={category.includes("non-veg")}
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        <div className="checkInp">
          <label>Best Seller</label>
          <div className="Input-conatiner">
            <div className="checkbox-container">
              <label>Yes</label>
              <input
                type="radio"
                value="true"
                checked={BestSeller === true}
                onChange={BestSellerhandler}
              />
            </div>
            <div className="checkbox-container">
              <label>No</label>
              <input
                type="radio"
                value="false"
                checked={BestSeller === false}
                onChange={BestSellerhandler}
              />
            </div>
          </div>
        </div>

        <label>Description</label>
        <input type="text" value={Description} onChange={(e) => setDescription(e.target.value)} />

        <label>Product Image</label>
        <input type="file" onChange={handleImageUpload} />

        <div className='btn2'>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Add_Product;
