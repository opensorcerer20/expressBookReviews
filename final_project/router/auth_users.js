const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  return !!regd_users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res
      .status(401)
      .json({ message: "Username and password are required" });
  }
  const match = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!match) {
    return res.status(401).json({ message: "Invalid login" });
  }

  // Generate JWT access token
  let accessToken = jwt.sign(
    {
      data: match,
    },
    "access",
    { expiresIn: 60 * 60 }
  );
  // Store access token in session
  req.session.authorization = {
    accessToken,
  };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // user already auth'd by this point

  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: "Book with isbn " + isbn + " not found" });
  }

  const review = req.body.review;
  if (!review) {
    return res.status(200).json({ message: "Review is required" });
  }

  const username = req.user.data.username;
  const action = !!books[isbn].reviews[username] ? "updated" : "created";

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review was " + action });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
