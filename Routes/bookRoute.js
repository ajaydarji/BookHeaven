const express = require("express");
const router = express.Router();
const Book = require("../Models/book");
const { authenticateToken } = require("./userAuth");
const User = require("../Models/user"); // Ensure correct path to your User model
const book = require("../Models/book");

//add books

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const id = req.headers["id"];
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You have no access to create the book" });
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    // Send success response
    res.status(200).json({ message: "Books added successfully" });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error" });
  }
});

//update the books

router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    // Send success response
    res.status(200).json({ message: "Books Update successfully" });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error", error });
  }
});

//delete books--admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await book.findByIdAndDelete(bookid);

    // Send success response
    res.status(200).json({ message: "Books Delete successfully" });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error", error });
  }
});

//get all books

router.get("/get-all-book", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({ ststus: "successfully", data: books });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error", error });
  }
});

//get last 5 book added

router.get("/get-recent-book", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(5);
    return res.json({ ststus: "successfully", data: books });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error", error });
  }
});

//get book by id

router.get("/get-bookid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      // If no book is found with the given ID, return a 404 status
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    // Return the found book
    return res.json({ status: "success", data: book });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    // Return a generic error message
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
  console.log(error);
});

module.exports = router;
