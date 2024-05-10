const express = require("express");
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

  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the database
  users[username] = password;
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //   retrieve ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the ISBN exists in the books object
  if (books.hasOwnProperty(isbn)) {
    const bookDetails = books[isbn];
    res.status(200).json({ book: bookDetails });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const saveBookKeys = Object.keys(books);

  // create an empty array to store books with matching author
  const matchingBooks = [];

  // check the books array for matching authors
  saveBookKeys.forEach((key) => {
    const book = books[key];
    if (book.author === author) {
      matchingBooks.push(book);
    }
  });

  // check the matching books
  if (matchingBooks.length > 0) {
    res.status(200).json({ books: matchingBooks });
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const saveBookKeys = Object.keys(books);

  // create an arr to store books with matching title
  const matchingBooks = [];

  // check the books array for matching titles
  saveBookKeys.forEach((key) => {
    const book = books[key];
    if (book.title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(book);
    }
  });

  if (matchingBooks.length > 0) {
    res.status(200).json({ books: matchingBooks });
  } else {
    res.status(404).json({ message: "No books found with the provided title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  // Check if the provided ISBN exists in the books object
  if (isbn in books) {
    const book = books[isbn];
    const reviews = book.reviews;

    res.status(200).json({ reviews: reviews });
  } else {
    res.status(404).json({ message: "No reviews found" });
  }
});

module.exports.general = public_users;
