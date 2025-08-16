// import React, { useState } from "react";
// import { API_URL } from "../data/apipath";

// function Add_Restaurant() {
//   const [firmname, setFirmname] = useState("");
//   const [area, setArea] = useState("");
//   const [category, setCategory] = useState([]);
//   const [region, setRegion] = useState([]);
//   const [offer, setOffer] = useState("");
//   const [file, setFile] = useState(null);

//   // ✅ Toggle checkboxes
//   const handleCheckboxChange = (setter, currentValues) => (event) => {
//     const value = event.target.value;
//     setter(
//       currentValues.includes(value)
//         ? currentValues.filter((item) => item !== value)
//         : [...currentValues, value]
//     );
//   };

//   // ✅ Image Upload
//   const handleImageUpload = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // ✅ Submit Form
//   const handleFirmSubmit = async (e) => {
//     e.preventDefault();

//     const loginToken = localStorage.getItem("login token");
//     if (!loginToken) {
//       alert("Please login first");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("firmname", firmname);
//       formData.append("area", area);
//       formData.append("offer", offer);
//       if (file) formData.append("image", file);

//       category.forEach((value) => formData.append("category", value));
//       region.forEach((value) => formData.append("region", value));

//       const response = await fetch(`${API_URL}/firm/add-firm`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${loginToken}`, // ✅ Send token in standard format
//         },
//         body: formData,
//       });

//       let data;
//       try {
//         data = await response.json();
//       } catch {
//         throw new Error("Server returned invalid JSON (possibly HTML error page)");
//       }

//       if (response.ok) {
//         alert("Firm added successfully");
//         localStorage.setItem("Id", data.firmid);

//         // Reset form
//         setFirmname("");
//         setArea("");
//         setOffer("");
//         setCategory([]);
//         setRegion([]);
//         setFile(null);
//       } else if (data.message === "vendor should have only one restaurant") {
//         alert("You can only add one restaurant");
//       } else {
//         alert(data.message || "Failed to add firm");
//       }
//     } catch (error) {
//       console.error("Error submitting firm:", error);
//       alert(error.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="Restaurantsection">
//       <form className="formtable" onSubmit={handleFirmSubmit}>
//         <h3>Restaurant</h3>

//         <label>Restaurant Name</label>
//         <input
//           type="text"
//           value={firmname}
//           onChange={(e) => setFirmname(e.target.value)}
//           required
//         />

//         <label>Area</label>
//         <input
//           type="text"
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//           required
//         />

//         {/* ✅ Category */}
//         <div className="checkInp">
//           <label>Category</label>
//           <div className="Input-conatiner">
//             {["veg", "non-veg"].map((item) => (
//               <div key={item} className="checkbox-container">
//                 <label>{item}</label>
//                 <input
//                   type="checkbox"
//                   value={item}
//                   checked={category.includes(item)}
//                   onChange={handleCheckboxChange(setCategory, category)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ✅ Region */}
//         <div className="checkInp">
//           <label>Region</label>
//           <div className="Input-conatiner">
//             {["north-indian", "south-indian", "bakery", "chinese"].map((item) => (
//               <div key={item} className="checkbox-container">
//                 <label>{item}</label>
//                 <input
//                   type="checkbox"
//                   value={item}
//                   checked={region.includes(item)}
//                   onChange={handleCheckboxChange(setRegion, region)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <label>Offer</label>
//         <input
//           type="text"
//           value={offer}
//           onChange={(e) => setOffer(e.target.value)}
//         />

//         <label>Restaurant Image</label>
//         <input type="file" accept="image/*" onChange={handleImageUpload} />

//         <div className="btn2">
//           <button type="submit">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Add_Restaurant;

import React, { useState } from "react";
import { API_URL } from "../data/apipath";

function Add_Restaurant() {
  const [firmname, setFirmname] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckboxChange = (setter, currentValues) => (event) => {
    const value = event.target.value;
    setter(
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
    );
  };

  const handleImageUpload = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();

    const loginToken = localStorage.getItem("login token");
    if (!loginToken) {
      alert("Please login first");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firmname", firmname.trim());
      formData.append("area", area.trim());
      formData.append("offer", offer.trim());

      // Append arrays correctly (multiple entries with the same key)
      category.forEach((value) => formData.append("category", value));
      region.forEach((value) => formData.append("region", value));

      if (file) formData.append("image", file);

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginToken}`,
          // DO NOT set Content-Type for FormData; browser sets boundary automatically
        },
        body: formData,
      });

      // Guard: ensure we only parse JSON
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text(); // helpful for debugging if server sent HTML
        throw new Error(
          `Server did not return JSON (status ${response.status}). Body starts with: ${text.slice(
            0,
            80
          )}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        // Specific vendor-only-one message casing normalized
        const msg = data.message || "Failed to add firm";
        alert(msg);
        return;
      }

      alert("Firm added successfully");
      if (data.firmid) {
        localStorage.setItem("Id", data.firmid);
      }

      // Reset form
      setFirmname("");
      setArea("");
      setOffer("");
      setCategory([]);
      setRegion([]);
      setFile(null);
    } catch (error) {
      console.error("Error submitting firm:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="Restaurantsection">
      <form className="formtable" onSubmit={handleFirmSubmit}>
        <h3>Restaurant</h3>

        <label>Restaurant Name</label>
        <input
          type="text"
          value={firmname}
          onChange={(e) => setFirmname(e.target.value)}
          required
        />

        <label>Area</label>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        />

        <div className="checkInp">
          <label>Category</label>
          <div className="Input-conatiner">
            {["veg", "non-veg"].map((item) => (
              <div key={item} className="checkbox-container">
                <label>{item}</label>
                <input
                  type="checkbox"
                  value={item}
                  checked={category.includes(item)}
                  onChange={handleCheckboxChange(setCategory, category)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="checkInp">
          <label>Region</label>
          <div className="Input-conatiner">
            {["north-indian", "south-indian", "bakery", "chinese"].map((item) => (
              <div key={item} className="checkbox-container">
                <label>{item}</label>
                <input
                  type="checkbox"
                  value={item}
                  checked={region.includes(item)}
                  onChange={handleCheckboxChange(setRegion, region)}
                />
              </div>
            ))}
          </div>
        </div>

        <label>Offer</label>
        <input
          type="text"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />

        <label>Restaurant Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="btn2">
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add_Restaurant;

