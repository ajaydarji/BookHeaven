const express = require("express");
const router = express.Router();
const Book = require("../Models/book")
const { authenticateToken } = require("./userAuth");
const User = require("../Models/user");


//add to book to Fevourite

router.put("/add-book-to-Fevourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res
        .status(200)
        .json({ message: "book allready added in favourites " });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    // Send success response
    return res.status(200).json({ message: "book added in favourites" });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete the book from Fevourite

router.put(
  "/delete-book-from-Fevourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookFavourite = userData.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
      }
      // Send success response
      return res.status(200).json({ message: "book delete-from-favurite" });
    } catch (error) {
      console.log(error);
      // Send generic error response
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//get Fevourite book from perticular user

router.get("/get-favourites-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(id).populate("favourites");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const favouritesbook = userData.favourites;
    return res.json({
      message: "Success",
      data: favouritesbook,
    });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;
