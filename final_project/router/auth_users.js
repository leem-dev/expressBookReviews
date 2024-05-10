const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "Tunji", password: "IBMlearner1" },
  { username: "Tunj", password: "IBMlearner2" },
];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username is valid
  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  // Check if username and password match records
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token for authenticated user
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  // Set the token in response headers or send it as JSON response
  res.setHeader("Authorization", `Bearer ${token}`);
  res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
