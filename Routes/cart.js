const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./userAuth");
const User = require("../Models/user");
const Book = require("../Models/book");

//add to cart

router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      return res.status(200).json({ message: "book allready added in Cart " });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    // Send success response
    return res.status(200).json({ message: "book added in cart" });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete to the cart

router.put("/delete-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
    }
    // Send success response
    return res.status(200).json({ message: "book delete in cart" });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error" });
  }
});

//get cart of perticuler user

router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();

    return res.json({
      message: "Success",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
