import React, { useState } from "react";
import { API_URL } from "../data/apipath";

function Add_Restaurant() {
  const [firmname, setFirmname] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const handleRegionChange = (event) => {
    const value = event.target.value;
    if (region.includes(value)) {
      setRegion(region.filter((item) => item !== value));
    } else {
      setRegion([...region, value]);
    }
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setFile(selectedImage);
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginToken = localStorage.getItem("login token");
      if (!loginToken) {
        console.error("User not authenticated");
        alert("Please login first");
        return;
      }

      const formData = new FormData();
      formData.append("firmname", firmname);
      formData.append("area", area);
      formData.append("offer", offer);
      if (file) {
        formData.append("image", file);
      }

      category.forEach((value) => {
        formData.append("category", value);
      });

      region.forEach((value) => {
        formData.append("region", value);
      });

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: "POST",
        headers: {
          token: `${loginToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        alert("Firm added successfully");
        // Clear form after successful submission
        setFirmname("");
        setArea("");
        setOffer("");
        setCategory([]);
        setRegion([]);
        setFile(null);
        const firmid=data.firmid
        localStorage.setItem('id',firmid);
      }
      else if(data.message=="vendor should have only one restaurant"){
         alert("already exist only one can be added")
      } else {
        console.error("Failed to add firm:", data.message || "Unknown error");
        alert("Failed to add firm");
      }
    } catch (error) {
      console.error("Error submitting firm:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="Restaurantsection">
      <form className="formtable" onSubmit={handleFirmSubmit}>
        <h3>Restaurant</h3>

        <label>Restaurant Name</label>
        <input
          type="text"
          name="firmname"
          value={firmname}
          onChange={(e) => setFirmname(e.target.value)}
        />

        <label>Area</label>
        <input
          type="text"
          name="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

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
          <label>Region</label>
          <div className="Input-conatiner">
            <div className="checkbox-container">
              <label>North-Indian</label>
              <input
                type="checkbox"
                value="north-indian"
                checked={region.includes("north-indian")}
                onChange={handleRegionChange}
              />
            </div>
            <div className="checkbox-container">
              <label>South-Indian</label>
              <input
                type="checkbox"
                value="south-indian"
                checked={region.includes("south-indian")}
                onChange={handleRegionChange}
              />
            </div>
            <div className="checkbox-container">
              <label>Bakery</label>
              <input
                type="checkbox"
                value="bakery"
                checked={region.includes("bakery")}
                onChange={handleRegionChange}
              />
            </div>
            <div className="checkbox-container">
              <label>Chinese</label>
              <input
                type="checkbox"
                value="chinese"
                checked={region.includes("chinese")}
                onChange={handleRegionChange}
              />
            </div>
          </div>
        </div>

        <label>Offer</label>
        <input
          type="text"
          name="offer"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />

        <label>Restaurant Image</label>
        <input type="file" onChange={handleImageUpload} />

        <div className="btn2">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Add_Restaurant;

