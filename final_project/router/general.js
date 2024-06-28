const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const bcrypt = require("bcrypt");
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  if (users[name]) {
    return res.status(409).json({ message: "User already exists" });
  }

  users[name] = { password: password };

  console.log(`User registered: ${name}`);
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const books_data = books;
  console.log(books_data);
  return res.status(300).json({ books_data });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here

  const id = Number(req.params.isbn);
  const book = books[id];
  console.log(book);
  return res.status(300).json({ book });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = String(req.params.author);

  // Find books by the specified author
  const authorBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  return res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = String(req.params.title);

  const book = Object.values(books).filter((book) => book.title === title);

  return res.status(300).json({ book });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const id = Number(req.params.isbn);

  const book = books[id];
  console.log(book);
  return res.status(300).json(book.reviews);
});

module.exports.general = public_users;
