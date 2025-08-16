const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const Vendor = require("../models/Vendor");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// ✅ Allow only image files
const fileFilter = (_req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ JWT Authentication Middleware
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.vendorId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Add Firm
const addfirm = async (req, res) => {
  try {
    const { firmname, area, offer } = req.body;

    // Handle single/multiple values
    const toArray = (v) =>
      v == null ? [] : Array.isArray(v) ? v : [v];
    const category = toArray(req.body.category);
    const region = toArray(req.body.region);

    const image = req.file ? req.file.filename : null;

    // Required fields check
    if (!firmname || !area || category.length === 0 || region.length === 0) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Ensure only one restaurant per vendor
    if (Array.isArray(vendor.Restaurant) && vendor.Restaurant.length > 0) {
      return res
        .status(400)
        .json({ message: "Vendor should have only one restaurant" });
    }

    const firm = new Restaurant({
      firmname,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    vendor.Restaurant.push(savedFirm._id);
    await vendor.save();

    return res.status(200).json({
      message: "Firm added successfully",
      firmid: savedFirm._id,
    });
  } catch (error) {
    console.error("Error in addfirm:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding firm" });
  }
};

// ✅ Delete Restaurant
const deleteRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Remove reference from vendors
    await Vendor.updateMany(
      { Restaurant: restaurantId },
      { $pull: { Restaurant: restaurantId } }
    );

    return res
      .status(200)
      .json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error in deleteRestaurantById:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting restaurant" });
  }
};

module.exports = {
  upload, // Multer middleware
  auth,   // JWT middleware
  addfirm,
  deleteRestaurantById,
};
