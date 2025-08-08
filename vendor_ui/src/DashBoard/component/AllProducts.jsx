import './AllProducts.css';
import React, { useState, useEffect } from 'react';
import { API_URL } from "./data/apipath";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const productHandler = async () => {
    const restaurantId = localStorage.getItem('Id');
    try {
      const response = await fetch(`${API_URL}/product/${restaurantId}/products`);
      const newProducts = await response.json();
      setProducts(newProducts.products);
      console.log(newProducts);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch products");
    }
  };

  // ✅ useEffect must be at the top level
  useEffect(() => {
    productHandler();
    console.log("useEffect ran");
  }, []);

  const Deletehandler = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      console.log("Deleting:", productId);
      const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "DELETE"
      });
  
      if (response.ok) {
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
        alert("Your product was deleted");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  };
  
  
  return (
    <div>
      {!products ? (
        <p>No products listed</p>
      ) : (
        <table className='ProductsTable'>
          <thead>
            <tr>
              <th>ProductName</th>
              <th>Price</th>
              <th>Image</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id}>
                <td>{item.ProductName}</td>
                <td>{item.Price}</td>
                <td>
                  {item.image && (
                    <img
                      src={`${API_URL}/uploads/${item.image}`}
                      alt={item.ProductName}
                      style={{ width: "80px" }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={()=>Deletehandler(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllProducts;
