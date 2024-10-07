const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "path/to/default/avatar.png", // Use a relative path or URL for default avatar
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    favourites: [{ type: mongoose.Types.ObjectId, ref: "Book" }], // Ensure correct model name
    cart: [{ type: mongoose.Types.ObjectId, ref: "Book" }], // Ensure correct model name
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }], // Ensure correct model name
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
