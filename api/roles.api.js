
const env = require('../const_env');
const link = `/${env.db_collection.roles}`;
const role = require('../models/roles.model');
const Utils = require('../Utils');

module.exports = {
  get(app) {
    app.get(link, (req, res) => {
      Utils.connect();
      var query = req.body;
      role.find(query).exec((err, data) => {
        if (err) {
          res.send({
            total: 0,
            data: [],
            errorName: err.name,
            errorMessage: err.message
          });
          return;
        }

        res.send({
          total: data.length,
          data: data
        });
      })
    });
  },

  post(app) {
    app.post(link, (req, res) => {
      Utils.connect();
      var query = req.body;
      role.create(query)
        .then((data) => {
          if (data) {
            res.send({
              total: data.length ? data.length : 1,
              data: data
            });
          }
        })
        .catch((err) => {
          res.send({
            total: 0,
            data: [],
            errorMessage: 'Create item false'
          });
        });
    })
  },

  patch(app) {
    app.patch(link, (req, res) => {
      var id = req.body._id;
      if (!id) {
        res.send({
          total: 0,
          data: [],
          errorMessage: 'Id not found'
        });
        return;
      }
      Utils.connect();
      var query = req.body;
      delete query._id;
      role.update({ _id: id }, { $set: { ...query } }).exec((err, data) => {
        if (err) {
          res.send({
            total: 0,
            data: [],
            errorName: err.name,
            errorMessage: err.message
          });
        }

        res.send({
          total: data.length ? data.length : 1,
          data: data
        });
      });
    });
  },

  delete(app) {
    app.delete(link, (req, res) => {
      var id = req.body._id;
      if (!id) {
        res.send({
          total: 0,
          data: [],
          errorMessage: 'Id not found'
        });
        return;
      }

      Utils.connect();
      role.remove({ _id: id })
        .exec()
        .then((data) => {
          res.send({
            total: 1,
            data: data
          });
        })
        .catch((err) => {
          res.send({
            total: 0,
            data: [],
            errorMessage: 'Id not found'
          });
        })
    })
  }
}