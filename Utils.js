const mongoose = require('mongoose');
const env = require('./const_env');

module.exports = {
  connect() {
    mongoose.connect(env.url_db);
  },

  setupDatabase() {
    var MongoClient = require('mongodb').MongoClient;
    var url = env.url;
    var url_db = env.url_db;
    var db_name = env.db_name;

    // create database
    MongoClient.connect(url_db, function (err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.close();
    });

    // create all collections
    Object.keys(env.db_collection).forEach(e => {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.createCollection(e, function (err, res) {
          if (err) throw err;
          console.log(`Collection ${e} created!`);
          db.close();
        });
      });
    });
  },

  get(app, objectSchema, link) {
    app.get(link, (req, res) => {
      this.connect();
      var query = req.body;
      var _skip = env.skip;
      var _limit = env.limit;
      if (query['$skip']) {
        _skip = query['$skip'];
        delete query['$skip'];
      }
      if (query['$limit']) {
        _limit = query['$limit'];
        delete query['$limit'];
      }
      objectSchema.find(query).skip(_skip).limit(_limit).exec((err, data) => {
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

  post(app, objectSchema, link) {
    app.post(link, (req, res) => {
      this.connect();
      var query = req.body;
      objectSchema.create(query)
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

  patch(app, objectSchema, link) {
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
      this.connect();
      var query = req.body;
      delete query._id;
      var date = new Date();
      query.updatedAt = date.toLocaleString();
      objectSchema.update({ _id: id }, { $set: { ...query } }).exec((err, data) => {
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

  delete(app, objectSchema, link) {
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

      this.connect();
      objectSchema.remove({ _id: id })
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
