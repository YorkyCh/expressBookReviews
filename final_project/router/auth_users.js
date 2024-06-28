const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // returns boolean
  // check if the username is valid
  return username && username.length > 0 && /^[a-zA-Z0-9_]+$/.test(username);
};

const authenticatedUser = (username, password) => {
  // returns boolean
  // check if username and password match the one we have in records
  return users[username] && users[username].password === password;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!isValid(name)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (authenticatedUser(name, password)) {
    const token = jwt.sign({ name }, "secretkey", { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.name;

  isbn = Number(isbn);

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
