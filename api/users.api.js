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
        var _sort = { ...env.sort };
        delete query.accessToken;
        if (query['$skip']) {
          _skip = parseInt(query['$skip']);
          delete query['$skip'];
        }
        if (query['$limit']) {
          _limit = parseInt(query['$limit']);
          delete query['$limit'];
        }
        if (query['$sort']) {
          let _temp_sort = query['$sort'].trim().substring(1, query['$sort'].trim().length - 1);
          let _arr_sort = _temp_sort.split(':');
          _sort = {};
          _sort[_arr_sort[0].trim()] = parseInt(_arr_sort[1].trim())
          delete query['$sort'];
        }
        if (query['$regex']) {
          let regex_arr = JSON.parse(query['$regex']);
          regex_arr.forEach((e) => {
            query[e.name] = {
              $regex: e.value,
              $options: e['$options']
            }
          });
          delete query['$regex'];
        }
        objectSchema.find(query).skip(_skip).limit(_limit).sort({ ..._sort }).then((data) => {
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
        if (!data) {
          res.send({
            total: 0,
            data: [],
            errorName: '401',
            errorMessage: 'Account or password wrong'
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
  },

  loginFacebook(app, _link) {
    app.post(_link, (req, res) => {
      var facebook = req.body;
      Utils.connect();
      objectSchema.findOne({ facebookId: facebook.facebookId })
        .then((data) => {
          if (!data) {
            var query = {
              account: facebook.facebookId,
              password: '123456a@',
              name: facebook.name,
              companyId: '5efac7d93fad9636108234d4',
              cmt: facebook.facebookId,
              phone: facebook.facebookId,
              email: facebook.email ? facebook.email : facebook.facebookId,
              role: 'user',
              numberPlate: facebook.facebookId,
              description: 'FACEBOOK',
              vehicleColor: facebook.facebookId,
              vehicleBranch: facebook.facebookId,
              vehicleType: facebook.facebookId,
              facebookId: facebook.facebookId,
              facebook: { ...facebook.facebook }
            };
            objectSchema.create(query, (err1, data1) => {
              if (err1) {
                res.send({
                  total: 0,
                  data: [],
                  errorName: '500',
                  errorMessage: 'Login with facebook false'
                });
                return;
              }
              let token = Utils.createToken(data1);
              data1.password = undefined;
              res.send({
                total: 1,
                data: {
                  ...data1._doc,
                  accessToken: token
                }
              });
              return;
            });
          } else {
            var token = Utils.createToken(data);
            data.password = undefined;
            res.send({
              total: 1,
              data: {
                ...data._doc,
                accessToken: token
              }
            });
            return;
          }
        })
        .catch((err) => {
          if (err) {
            res.send({
              total: 0,
              data: [],
              errorName: err.name,
              errorMessage: err.message
            });
            return;
          }
        })
    })
  }
}