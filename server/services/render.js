const axios = require("axios");
const mongoose = require("mongoose");
const Userdb = require("../model/model");


exports.homeRoutes = async (req, res) => {
  if (req.query.search) {
    console.log(req.query)
    const data = await req.elastic.search({
      index: "users",
      body: {
        query: {
          multi_match: {
            query: req.query.search,
            fields: ["name", "email"],
          },
        },
      },
    });


    const found = data.hits.hits;

    const ids = found
      .map((item) => item._source.id)
      .filter((item) => item)
      .map((id) => new mongoose.Types.ObjectId(id));

    const users = await Userdb.find({
      _id: { $in: ids },
    });

    res.render("index", { users });
    return;
  }

  // Make a get request to /api/users
  axios
    .get("http://localhost:8080/api/users")
    .then(function (response) {
      res.render("index", { users: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.add_user = (req, res) => {
  res.render("add_user");
};

exports.update_user = (req, res) => {
  axios
    .get("http://localhost:8080/api/users", { params: { id: req.query.id } })
    .then(function (userdata) {
      res.render("update_user", { user: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
};
