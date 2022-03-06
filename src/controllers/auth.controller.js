const jwt = require("jsonwebtoken");
const userModel = require("../services/db.services").User;
const bcrypt = require("bcrypt");

require("dotenv").config();

const generateToken = (data, res) => {
  const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET);

  return res.send({
    msg: "Login Successful",
    token: token,
  });
};

const login = (req, res) => {
  userModel
    .findOne({
      where: {
        emailId: req.body.emailId,
      },
    })
    .then((data) => {
      console.log(data);
      if (data.length == 0) {
        return res.send({
          msg: "Please SignUp",
        });
      } else if (data["dataValues"].password == null) {
        return res.send({
          msg: "Please Reset your Password",
        });
      }
      if (bcrypt.compareSync(req.body.password, data.password)) {
        return generateToken(data, res);
      }
      return res.send({
        msg: "Password Incorrect",
      });
    })
    .catch((err) => {
      console.log("Error in login controller", err);
      res.send({
        msg: "Not Able to login",
      });
    });
};

const signUp = (req, res) => {
  userModel
    .findAll({
      where: {
        emailId: req.body.emailId,
      },
    })
    .then((data) => {
      console.log(data);
      if (data.length == 0) {
        const hash = bcrypt.hashSync(req.body.password, 10);
        userModel
          .create({
            emailId: req.body.emailId,
            password: hash,
          })
          .catch((err) => console.log("Error in signup controller", err));

        return res.send({
          msg: "User Signed Up Successfully",
        });
      }
      return res.send({
        msg: "user already exist",
      });
    })
    .catch((err) => console.log("Error in signup controller", err));
};

const AuthController = {
  login,
  signUp,
};

module.exports = AuthController;