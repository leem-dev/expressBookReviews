const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/customer");
    const books = response.data.books;
    return res.status(200).json({ books });
  } catch (error) {
    console.error("Failed to fetch book list", error);
    return res.status(500).json({ message: "Failed to fetch book list" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(
      `http://localhost:5000/customer/isbn/${isbn}`
    );
    const book = response.data.book;
    return res.status(200).json({ book });
  } catch (error) {
    console.error(`Failed to fetch book details for ISBN: ${isbn}`, error);
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(
      `http://localhost:5000/customer/author/${author}`
    );
    const books = response.data.books;
    return res.status(200).json({ books });
  } catch (error) {
    console.error(`Failed to fetch books by author: ${author}`, error);
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(
      `http://localhost:5000/customer/title/${title}`
    );
    const books = response.data.books;
    return res.status(200).json({ books });
  } catch (error) {
    console.error(`Failed to fetch books with title: ${title}`, error);
    return res
      .status(404)
      .json({ message: "No books found with the provided title" });
  }
});

module.exports.general = public_users;
