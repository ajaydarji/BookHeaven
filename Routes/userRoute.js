const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Models/user"); // Ensure correct path to your User model
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const user = require("../Models/user");

// Signup route
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Validate input
    if (!username || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be at least 4 characters long" });
    }

    if (password.length <= 4) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long" });
    }

    // Check if email or username already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in /sign-up route:", error); // Log error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

//login route

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (isMatch) {
      const authClaims = [
        { name: existingUser.username },
        { role: existingUser.role },
      ];
      const token = jwt.sign({ authClaims }, "bookStore123", {
        expiresIn: "30d",
      });
      return res.status(200).json({
        id: existingUser._id,
        role: existingUser.role,
        token,
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in /sign-in route:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get user information

router.get("/get-user-infromation", authenticateToken, async (req, res) => {
  try {
    const id = req.headers["id"]; // Correctly extract the id from headers
    if (!id) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const data = await user.findOne({ _id: id }).select("-password"); // Find user by id and exclude password
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" }); // Corrected typo
  }
});

//update the address

router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    // Extract id from headers and address from request body
    const id = req.headers["id"];
    const { address } = req.body;

    // Check if id and address are provided
    if (!id || !address) {
      return res.status(400).json({ message: "Id and address are required" });
    }

    // Find user by id and update the address
    const user = await User.findByIdAndUpdate(
      id,
      { address: address },
      { new: true }
    );

    // Check if user was found and updated
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send success response
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.log(error);
    // Send generic error response
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
