const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./Customer");
const Customer = mongoose.model("Customer");
const port = 5555;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

mongoose.connect(
  "mongodb+srv://user1:hthDIhVw86LhdSYT@cluster0.fbv2h.mongodb.net/customersservice?retryWrites=true&w=majority",
  () => {
    console.log("customer DB connected");
  }
);
app.get("/", (req, res) => {
  res.send("customers service is Ready!");
});

app.post("/customer", (req, res) => {
  console.log(req.body);
  let newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  let customer = new Customer(newCustomer);
  customer
    .save()
    .then(() => {
      console.log("new customer created");
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
  res.send("customer created!");
});

app.get("/customers", (req, res) => {
  Customer.find()
    .then((customers) => {
      res.json(customers);
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
});

app.get("/customer/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      res.json(customer);
    })
    .catch(
      (error = {
        if(error) {
          throw error;
        },
      })
    );
});

app.delete("/customer/:id", (req, res) => {
  Customer.findOneAndDelete(req.params.id)
    .then(() => {
      res.send("customer remove success");
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
  console.log(`customers app is listening on port ${port}`);
});
