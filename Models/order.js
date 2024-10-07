const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // Assuming "User" is the correct model name
    book: [{ type: mongoose.Types.ObjectId, ref: "Book", required: true }], // Assuming "Book" is the correct model name
    status: {
      type: String,
      default: "Order Placed",
      enum: ["Order Placed", "Out for Delivery", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

// Export the model using capitalized naming convention
module.exports = mongoose.model("Order", orderSchema);
