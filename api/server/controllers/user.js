const db = require('../models')
const bcrypt = require('bcrypt')
const User = db.User

const saltRounds = 10

module.exports = {
  create(req, res) {
    bcrypt.hash(req.body.pass, saltRounds, (e, hash) => {
      if (e) { res.status(400).send({ message: e.toString() }) }
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
          return res.status(400).send({
            message: 'User Not Found',
          });
        }
        bcrypt.compare(req.body.pass, user.password, (e, match) => {
          if (e) { res.status(400).send({ message: e.toString() }) }
          if (match) {
            return res.status(200).send(user)
          } else {
            return res.status(400).send({ message: 'Incorrect password' })
          }
        });
      })
      .catch(error => {
        res.status(400).send({ message: error.toString() })
      });
  }
}
