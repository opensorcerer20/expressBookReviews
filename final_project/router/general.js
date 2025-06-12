const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res
      .status(200)
      .json({ message: "Username and password are required" });
  }
  users.push({ username, password });
  //Write your code here
  return res.status(200).json({ message: "User has been registered" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // task 10: use promise/callback for book listing
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 2000);
  });

  myPromise.then((booksResponse) => {
    return res.send(booksResponse);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({ message: "ISBN required" });
  }

  // task 11: use promise/callback for isbn search
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!Object.keys(books).includes(isbn)) {
        resolve(null);
      }
      resolve(books[isbn]);
    }, 2000);
  });

  myPromise.then((book) => {
    if (book) {
      return res.send(book);
    }
    return res.status(404).json({ message: "ISBN " + isbn + " not found" });
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res.status(404).json({ message: "Author required" });
  }

  // task 12: use promise/callback for author search
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const authorBooks = [];
      Object.keys(books).map((isbn) => {
        let book = books[isbn];
        if (book.author === author) {
          authorBooks.push({ isbn, ...book });
        }
      });
      resolve(authorBooks);
    }, 2000);
  });

  myPromise.then((authorBooks) => {
    res.send(authorBooks);
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res.status(404).json({ message: "Title required" });
  }
  const titleBooks = [];
  Object.keys(books).map((isbn) => {
    let book = books[isbn];
    if (book.title === title) {
      titleBooks.push({ isbn, ...book });
    }
  });
  res.send(titleBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({ message: "ISBN required" });
  }
  if (!Object.keys(books).includes(isbn)) {
    return res.status(404).json({ message: "ISBN " + isbn + " not found" });
  }
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
