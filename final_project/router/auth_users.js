const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = "yourSecretKey";

const isValid = (username) => {
  // Check if the username is valid
  return username && username.length > 0;
};

const authenticatedUser = (username, password) => {
  // Check if the username and password match a user in the database
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validUsers.length > 0;
};

// Endpoint for user login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username and password are valid
  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, secretKey);

  // Save the token in the session
  req.session.authorization = { accessToken: token };
  res.status(200).json({ message: "Login successful", token });
});

// Add a book review (assuming this will be implemented elsewhere)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.user.username; // Assuming the username is stored in the session

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!(isbn in books)) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Check if the user has already reviewed this book
  if (books[isbn].reviews[username]) {
    // Modify the existing review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // Add a new review
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Assuming the username is stored in the session

  if (!(isbn in books)) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  // Check if the user has reviewed this book
  if (books[isbn].reviews[username]) {
    // Delete the review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this book" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
