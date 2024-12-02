const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
  const authenticUsers = users.filter(user => user.username === username && user.password === password ) ; 
  if (authenticUsers.length > 0) {
    return true ; 
  } else {
    return false ; 
  }
} 

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username ; 
  const password = req.body.password ; 
  if (!username || !password) {
    return res.status(404).json({ message: "There was an error logging in." }) ; 
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60*60 }) ; 
    req.session.authorization = { accessToken: accessToken, username: username } ; 
    return res.status(200).send("Successful log in") ; 
  } else {
    return res.status(208).json({ message: "Invalid login." }) ; 
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn ; 
  const userReview = req.body.review ; 

  if (req.session.authorization) {
    const token = req.session.authorization.accessToken ; 
    jwt.verify(token, "access", (error, user) => {
      if (!error) {
        req.user = user ; 
        if (!books[isbn]) {
          return res.status(404).json( { message: `Book with ISBN ${isbn} not found` } ) ; 
        }
        if (!userReview) { 
          return res.status(400).json( { message: "Please provide a review to add" }) ; 
        }
        books[isbn].reviews[req.session.authorization.username] = userReview ; 
        res.send("Review successfully added") ; 
      } else {
        return res.status(403).json( { message: "User is not authenticated" } ) ; 
      }
    })
  } else {
    return res.status(403).json( { message: "User is not logged in." } ) ; 
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn ; 

  if (req.session.authorization) {
    const token = req.session.authorization.accessToken ; 
    jwt.verify(token, "access", (error, user) => {
      if (!error) {
        req.user = user ; 
        if (!books[isbn]) {
          return res.status(404).json( { message: `Book with ISBN ${isbn} not found` } ) ; 
        }
        delete books[isbn].reviews[req.session.authorization.username] ; 
        res.send("Review successfully deleted") ; 
      } else {
        return res.status(403).json( { message: "User is not authenticated" } ) ; 
      }
    })
  } else {
    return res.status(403).json( { message: "User is not logged in." } ) ; 
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
