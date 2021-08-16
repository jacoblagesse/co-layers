const db = require("../models");
const Feature = db.Feature;

module.exports = {
  create(req, res) {
    return Feature
      .create({
        userId: req.body.userId,
        type: req.body.type,
        color: req.body.color,
        geometry: req.body.geom
      })
      .then(feature => res.status(201).send(feature))
      .catch(error => {
        res.status(400).send({ message: error.toString() });
      });
  },
  list(req, res) {
    return Feature
      .findAll({
        where: { userId: req.params.userId }
      })
      .then(features => res.status(200).send(features))
      .catch(error => res.status(400).send({ message: error.toString() }))
  },
  retrieve(req, res) {
    return Feature
      .findByPk(req.params.id)
      .then((feature) => {
        if (!feature) {
          return res.status(404).send({
            message: `Feature with id ${req.params.id} not found`,
          });
        }
        return res.status(200).send(feature)
      })
      .catch(error => res.status(400).send({ message: error.toString() }))
  },
  update(req, res) {
    return Feature
      .update({
        geometry: req.body.geom
      }, {
        where: { id: req.params.id }
      })
      .then(updatedFeature => res.status(200).send(updatedFeature))
      .catch(error => res.status(400).send({ message: error.toString() }))
  },
  destroy(req, res) {
    return Feature
      .destroy({
        where: { id: req.params.id }
      })
      .then(() => res.status(204).send())
      .catch(error => res.status(400).send({ message: error.toString() }))
  },
  purge(req, res) {
    return Feature
      .destroy({
        where: { userId: req.params.userId }
      })
      .then(() => res.status(204).send())
      .catch(error => res.status(400).send({ message: error.toString() }))
  }
}
