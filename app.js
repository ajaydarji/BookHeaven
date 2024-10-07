const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
require("./conn/conn"); // Assuming this file sets up your database connection

// Import route modules
const userRoutes = require("./Routes/userRoute.js");
const booksRoutes = require("./Routes/bookRoute.js");
const favouriteRoutes = require("./Routes/Fevourite.js");
const cartRoutes = require("./Routes/cart.js");
const orderRoutes = require("./Routes/order.js");

// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Route handling
app.use("/api/v1", userRoutes);
app.use("/api/v1", booksRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB!");

  // Log the registered models
  console.log("Registered Mongoose Models:", mongoose.modelNames());
  // Start server
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
});
