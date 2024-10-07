const { authenticateToken } = require("./userAuth");
const Book = require("../Models/book");
const Order = require("../Models/order");
const express = require("express");
const User = require("../Models/user");
const router = express.Router();

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({ message: "No orders provided" });
    }

    // Loop through each order item
    for (const orderdata of order) {
      // Create a new order for each book
      const newOrder = new Order({
        user: id,
        book: orderdata._id, // Corrected to 'book'
      });

      // Save the order to the database
      const orderdataFromDb = await newOrder.save();

      // Update the user's order history and clear the cart
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderdataFromDb._id }, // 'orders' should match your schema
        $pull: { cart: orderdata._id }, // Remove the item from the user's cart
      });
    }

    // Send response after all orders are processed
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error" });
  }
});

// get order history from perticular user

router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Extract user ID from headers
    if (!id) {
      return res.status(400).json({ message: "User ID is required" }); // Check for missing user ID
    }

    // Find user by ID and populate orders and books
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" }, // Assuming the field is named "book" and not "books"
    });

    // Handle case where user is not found
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reverse the order of orders (if needed)
    const ordersData = userData.orders.reverse(); // Assuming you want the latest orders first

    // Send a success response with the order data
    return res.json({
      message: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    // Send a generic error response
    return res.status(500).json({ message: "Internal server error", error });
  }
});

//get all order

router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await Order.find()
      .populate({ path: "user" })
      .populate({
        path: "book",
      })
      .sort({ ordersdata: -1 });

    return res.json({
      message: "Success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error", error });
  }
});

//update order by admin

router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res.json({
      status: "Success",
      massage: "status update successfully",
    });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error", status: "fail" });
  }
});
module.exports = router;
