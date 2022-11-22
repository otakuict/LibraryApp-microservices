const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./Book");
const Book = mongoose.model("Book");
const port = 4545;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

mongoose.connect(
  "mongodb+srv://user1:hthDIhVw86LhdSYT@cluster0.fbv2h.mongodb.net/booksservice?retryWrites=true&w=majority",
  () => {
    console.log("Book DB connected");
  }
);
app.get("/", (req, res) => {
  res.send("Books service is Ready!");
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
