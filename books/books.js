const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./Book");
const Book = mongoose.model("Book");
const port = 4545;
const path = require("path");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
require("dotenv").config({ path: path.resolve(__dirname, "./") });
console.log(`Database  ${process.env}`);
mongoose.connect(
  "mongodb+srv://user1:hthDIhVw86LhdSYT@cluster0.fbv2h.mongodb.net/booksservice?retryWrites=true&w=majority",
  () => {
    console.log("Book DB connected");
  }
);
app.get("/", (req, res) => {
  res.json({ status: "book service is ready!" });
});

app.post("/book", (req, res) => {
  console.log(req.body);
  let newBook = {
    title: req.body.title,
    author: req.body.author,
    numberPages: req.body.numberPages,
    publisher: req.body.publisher,
  };

  let book = new Book(newBook);
  book
    .save()
    .then(() => {
      console.log("newbook created");
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
  res.send("ok");
});

app.get("/books", (req, res) => {
  Book.find()
    .then((books) => {
      res.json(books);
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
});

app.get("/book/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      res.json(book);
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
});

app.delete("/book/:id", (req, res) => {
  Book.findOneAndDelete(req.params.id)
    .then(() => {
      res.send("book remove success");
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
});

app.listen(port, () => {
  console.log(`Books app is listening on port ${port}`);
});
