const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios") ; 


public_users.post("/register", (req,res) => {
  const username = req.body.username ; 
  const password = req.body.password ; 
  if (username && password) { 
    if (!users.find(user => user.username === username)) {
      users.push({ username: username, password: password }) ; 
      return res.status(200).json({ message: "User registration successful." })
    } else {
      return res.status(404).json({ message: "User with that username already exists." })
    }
  }
  return res.status(404).json({ message: "There was a error registering user."}) ; 
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(200).json(books);  
// });


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
public_users.get('/', function (req, res) {

  const getBookListPromise = new Promise((resolve, reject) => {
    resolve("Returning booklist...") ; 
  }) ; 

  getBookListPromise.then((successMessage) => {
    return res.status(200).json(books) ; 
  }).catch((failureMessage) => {
    return res.status(500).json({ message: "Unexpected error" }) ; 
  }) ; 
});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn ; 
//   if (books[isbn]) {
//     res.status(200).json(books[isbn]);  
//   } else {
//     res.status(404).json({ message: `Book with ISBN ${isbn} not found` }); 
//   }
//  });


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn ; 

  const getBookDetailsPromise = new Promise((resolve, reject) => {
    if (books[isbn]) { 
      resolve("Returning book details")
    } else {
      reject("Retrieval of book details failed.")
    }
  }) ; 

  getBookDetailsPromise.then((successMessage) => {
    res.status(200).json(books[isbn]); 
  })
  .catch((failureMessage) => {
    res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  })

 });
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const requestedAuthor = req.params.author ; 
//   const bookEntry = Object.entries(books).find(book => book[1].author === requestedAuthor) ;
//   if (bookEntry) {
//     res.status(200).json(bookEntry[1]) ; 
//   } else {
//     res.status(404).json({ message: `Book with Author "${requestedAuthor}" not found` }) ;
//   }
// });


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
public_users.get('/author/:author',function (req, res) {

  const requestedAuthor = req.params.author ; 
  const bookEntry = Object.entries(books).find(book => book[1].author === requestedAuthor) ;

  const getBookDetailsByAuthorPromise = new Promise((resolve, reject) => {
    if (bookEntry) {
      resolve("Returning book details based on author...") 
    } else {
      reject("Retrieval of book details failed.")
    }
  }) ; 

  getBookDetailsByAuthorPromise.then((successMessage) => {
    res.status(200).json(bookEntry[1]) ;
  })
  .catch((failureMessage) => {
    res.status(404).json({ message: `Book with Author '${requestedAuthor}' not found` }) ;
  }) ; 

});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const requestedTitle = req.params.title ; 
//   const bookEntry = Object.entries(books).find(book => book[1].title === requestedTitle) ;
//   if (bookEntry) {
//     res.status(200).json(bookEntry[1]) ; 
//   } else {
//     res.status(404).json({ message: `Book with Title "${requestedTitle}" not found` }) ;
//   }
// });



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
public_users.get('/title/:title',function (req, res) {
  const requestedTitle = req.params.title ; 
  const bookEntry = Object.entries(books).find(book => book[1].title === requestedTitle) ;

  const getBookDetailsByTitlePromise = new Promise((resolve, reject) => {
    if (bookEntry) {
      resolve("Returning book details based on title...") ; 
    } else {
      reject("Retrieval of book details failed.") ; 
    }
  }) ; 

  getBookDetailsByTitlePromise.then((successMessage) => {
    res.status(200).json(bookEntry[1]) ; 
  })
  .catch((failureMessage) => {
    res.status(404).json({ message: `Book with Title '${requestedTitle}' not found` }) ;
  }) ; 

});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn ; 
  const bookReviews = books[isbn]?.reviews ; 
  if (bookReviews) {
    res.status(200).json(bookReviews) ; 
  } else {
    res.status(404).json({ message: `Book with ISBN "${isbn}" not found` }) ;
  }
});

module.exports.general = public_users;
