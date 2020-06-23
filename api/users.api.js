const env = require('../const_env');
const link = `/${env.db_collection.users}`;
const objectSchema = require('../models/users.model');
const Utils = require('../Utils');

module.exports = {
  get(app) {
    app.get(link, (req, res) => {
      Utils.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }

        if (!Utils.checkForbidden('get', dataToken.role, link)) {
          res.send({
            total: 0,
            data: [],
            errorName: '403',
            errorMessage: 'Account can not access system by function'
          });
          return;
        }

        Utils.connect();
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

          for (let i = 0; i < data.length; i++) {
            data[i].password = undefined;
          }

          res.send({
            total: data.length,
            data: data
          });
        })
      });
    });
  },

  authentication(app, _link) {
    app.post(_link, (req, res) => {
      var query = req.body;
      Utils.connect();
      objectSchema.findOne({ account: query.account, password: query.password }, (err, data) => {
        if (err) {
          res.send({
            total: 0,
            data: [],
            errorName: err.name,
            errorMessage: err.message
          });
          return;
        }
        var token = Utils.createToken(data);
        data.password = undefined;
        res.send({
          total: 1,
          data: {
            ...data._doc,
            accessToken: token
          }
        });
      });
    });
  }
}