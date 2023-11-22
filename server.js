const express = require("express");
const knex = require("knex");
const Joi = require("joi");
const cors = require("cors");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "1234",
    database: "growthm",
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/show", (req, res) => {
  db.select("*")
    .from("growthm_customers")
    .then((user) => {
      res.json(user);
    });
});

app.post("/store", (req, res) => {
  const { name, message, phone, email } = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    message: Joi.string().min(3).max(30).required(),
    phone: Joi.string().max(10).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(result.error.details[0].message);
    return;
  } else {
    db("growthm_customers")
      .insert({
        name: name,
        message: message,
        phone: phone,
        email: email,
      })
      .then(
        (response) => {
          res.json(response);
        },
        (err) => {
          res.json(err);
        }
      );
  }
});

app.delete("/delete", (req, res) => {
  console.log(req.body);
  db("growthm_customers")
    .where("email", req.body.email)
    .del()
    .then(
      (response) => {
        res.json(response);
      },
      (err) => {
        res.json(err);
      }
    );
});

app.listen(2000, () => console.log("localhost 2000"));
