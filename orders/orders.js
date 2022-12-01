const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./Order");
const Order = mongoose.model("Order");
const port = 7777;
const axios = require("axios");
const { response } = require("express");

const CircuitBreaker = require("./circuit-braker/CircuitBreaker");

const circuitBreaker = CircuitBreaker();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

mongoose.connect(
  "mongodb+srv://user1:hthDIhVw86LhdSYT@cluster0.fbv2h.mongodb.net/odersservice?retryWrites=true&w=majority",
  () => {
    console.log("order DB connected");
  }
);
app.get("/", (req, res) => {
  res.json({ status: "order service is ready!" });
});

app.get("/service1", (req, res) => {
  let resdata = circuitBreaker.callAPI("http://localhost:4545/");
  res.send(resdata);
});

app.post("/order", (req, res) => {
  console.log(req.body);
  let newOrder = {
    CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
    BookID: mongoose.Types.ObjectId(req.body.BookID),
    initialDate: req.body.initialDate,
    deliveryDate: req.body.deliveryDate,
  };

  let order = new Order(newOrder);
  order
    .save()
    .then(() => {
      console.log("new order created");
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
  res.send("order created!");
});

app.get("/order/:id", (req, res) => {
  Order.findById(req.params.id).then(async (order) => {
    if (order) {
      await axios
        .get("http://localhost:5555/customer/" + order.CustomerID)
        .then(function (response) {
          // handle success
          var orderObj = {
            customerName: response.data.name,
            booktitle: "",
          };
          axios
            .get("http://localhost:4545/book/" + order.BookID)
            .then(function (response) {
              // handle success
              orderObj.booktitle = response.data.title;
              res.json(orderObj);
            });
        });
    } else {
      res.send("invalid order");
    }
  });
});

app.listen(port, () => {
  console.log(`orders app is listening on port ${port}`);
});
