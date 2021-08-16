const db = require('../models')
const bcrypt = require('bcrypt')
const User = db.User

const saltRounds = 10

module.exports = {
  create(req, res) {
    bcrypt.hash(req.body.pass, saltRounds, (err, hash) => {
      if (err) { console.log(err) }
      return User
        .create({
          username: req.body.username,
          password: hash,
          drawColor: req.body.color
        })
        .then(user => res.status(201).send(user))
        .catch(error => {
          res.status(400).send({ message: error.toString() })
        });
    });
  },
  retrieve(req, res) {
    return User
      .findOne({
        where: { username: req.body.username }
      })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        bcrypt.compare(req.body.pass, user.password, (err, match) => {
          if (err) { console.log(err) }
          if (match) {
            return res.status(200).send(user)
          } else {
            return res.status(404).send({ message: 'Incorrect password' })
          }
        });
      })
      .catch(error => {
        res.status(400).send({ message: error.toString() })
      });
  }
  // list = (req, res) => {

  // },
  // find = (req, res) => {

  // },
  // update = (req, res) => {

  // },
  // destroy = (req, res) => {

  // }
}