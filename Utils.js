const mongoose = require('mongoose');
const env = require('./const_env');
const jwt = require('jsonwebtoken');

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
        dbo.createCollection(env.db_collection[e], function (err, res) {
          if (err) throw err;
          console.log(`Collection ${env.db_collection[e]} created!`);
          db.close();
        });
      });
    });
  },

  createToken(obj) {
    let token = jwt.sign(
      {
        account: obj.account,
        role: obj.role,
        time: Date.now()
      },
      env.PRIVATE_KEY,
      {
        algorithm: 'HS256'
      }
    );
    return token;
  },

  async checkToken(token) {
    if (!token) {
      return {
        errorName: '403',
        errorMessage: 'Required accessToken'
      };
    }
    let _userToken = jwt.decode(token);

    var userSchema = require('./models/users.model');
    this.connect();
    var data = await userSchema.findOne({ account: _userToken.account, role: _userToken.account });
    if (!data) {
      return {
        errorName: '404',
        errorMessage: 'Account not exist'
      };
    }
    var _now = new Date();
    if (_now.getTime() - _userToken.time > env.EXPIRY_TOKEN) {
      return {
        errorName: '498',
        errorMessage: 'Token expired'
      };
    }
    return {
      _id: data._id,
      account: data.account,
      name: data.name,
      companyId: data.companyId,
      cmt: data.cmt,
      phone: data.phone,
      email: data.email,
      role: data.role,
      numberPlate: data.numberPlate,
      balance: data.balance,
      description: data.description,
      vehicleColor: data.vehicleColor,
      vehicleBranch: data.vehicleBranch,
      vehicleType: data.vehicleType
    };
  },

  get(app, objectSchema, link) {
    app.get(link, (req, res) => {
      this.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }
        this.connect();
        var query = req.query;
        var _skip = env.skip;
        var _limit = env.limit;
        delete query.accessToken;
        if (query['$skip']) {
          _skip = parseInt(query['$skip']);
          delete query['$skip'];
        }
        if (query['$limit']) {
          _limit = parseInt(query['$limit']);
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
    });
  },

  post(app, objectSchema, link) {
    app.post(link, (req, res) => {
      this.checkToken(req.body.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }
        this.connect();
        var query = req.body;
        delete query.accessToken;
        objectSchema.create(query)
          .then((data) => {
            if (data) {
              res.send({
                total: data.length ? data.length : 1,
                data: [data]
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
      });
    });
  },

  put(app, objectSchema, link) {
    app.put(link, (req, res) => {
      this.checkToken(req.body.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }
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
        delete query.accessToken;
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
            data: [data]
          });
        });
      });
    });
  },

  delete(app, objectSchema, link) {
    app.delete(link, (req, res) => {
      this.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }
        var id = req.query._id;
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
              data: [data]
            });
          })
          .catch((err) => {
            res.send({
              total: 0,
              data: [],
              errorMessage: 'Id not found'
            });
          })
      });
    });
  }

}
