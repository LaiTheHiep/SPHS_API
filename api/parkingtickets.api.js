const multer = require('multer');
const fs = require('fs');
const env = require('../const_env');
const ObjectSchema = require('../models/parkingTickets.model');
var Utils = require('../Utils');

module.exports = {
  uploadImage(app) {
    let _date = new Date();
    const _rootFolder = `${env.ROOT_IMAGES}\\${env.db_collection.packingTickets}\\${_date.getFullYear()}${`${_date.getMonth() + 1}`.padStart(2, '0')}${_date.getDate()}`;
    if (!fs.existsSync(_rootFolder)) {
      fs.mkdirSync(_rootFolder);
    }
    const upload = multer({ dest: _rootFolder });
    app.post(`/uploads-${env.db_collection.packingTickets}`, upload.single('images'), (req, res) => {
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

        if (!Utils.checkForbidden('put', dataToken.role, `/${env.db_collection.packingTickets}`)) {
          res.send({
            total: 0,
            data: [],
            errorName: '403',
            errorMessage: 'Account can not access system by function'
          });
          return;
        }

        if (req.body.userId && req.body._id) {
          const processedFile = req.file || {};
          let orgName = processedFile.originalname || '';
          const fullPathInServer = processedFile.path;
          const newFullPath = `${_rootFolder}\\${req.body.userId}-${req.body._id}-${req.body.uploadIn ? 'in' : 'out'}-${orgName}`;
          fs.renameSync(fullPathInServer, newFullPath);
          let query = req.body.uploadIn ? { imageIn: newFullPath } : { imageOut: newFullPath }
          ObjectSchema.update({ _id: req.body._id }, { $set: { ...query } }).exec((err, data) => {
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
              total: data.length ? data.length : 1,
              data: [data]
            });
          })
        } else {
          res.send({
            total: 0,
            data: [],
            errorName: '402',
            errorMessage: 'Data wrong!',
          });
        }
      });
    });
  },

  workDay(app) {
    app.get('/work-days', async (req, res) => {
      var dataToken = await Utils.checkToken(req.query.accessToken)
      if (dataToken.errorMessage) {
        res.send({
          total: 0,
          data: [],
          errorName: dataToken.errorName,
          errorMessage: dataToken.errorMessage
        });
        return;
      }

      if (dataToken.role != 'manager') {
        res.send({
          total: 0,
          data: [],
          errorName: '403',
          errorMessage: 'Account can not access system by function'
        });
        return;
      }

      var dateStart = req.query.dateStart;
      var dateEnd = req.query.dateEnd;
      var timeCalculate = 0;
      var timeCalculateParse = parseInt(req.query.timeCalculate);
      var userId = req.query.userId;
      var timeStart = req.query.timeStart;
      var timeEnd = req.query.timeEnd;

      var start = new Date(dateStart);
      var end = new Date(dateEnd);
      if (!timeCalculateParse) timeCalculate = 0;
      else timeCalculate = timeCalculateParse;

      if (!dateStart || !dateEnd || !userId || !timeStart || !timeEnd || end - start <= 0) {
        res.send({
          total: 0,
          data: [],
          errorName: '400',
          errorMessage: 'Bad Request'
        })
        return;
      }

      var data = [];
      while (end - start >= 0) {
        var startTemp = new Date(`${start.toDateString()} ${timeStart}`);
        var endTemp = new Date(`${start.toDateString()} ${timeEnd}`);
        startTemp.setMinutes(startTemp.getMinutes() - timeCalculate);
        endTemp.setMinutes(endTemp.getMinutes() + timeCalculate);

        Utils.connect();
        var resData = await ObjectSchema.find({
          description: 'event',
          timeIn: {
            $gte: startTemp,
            $lt: endTemp
          }
        }).sort({ timeIn: 1 });

        if (resData.length > 0) {
          data.push({
            date: startTemp.toLocaleDateString(),
            start: resData[0].timeIn,
            end: resData[resData.length - 1].timeIn
          });
        }

        start.setDate(start.getDate() + 1);
      }

      res.send({
        total: data.length,
        data: data
      })

    });
  },

  postEvent(app) {
    app.post('/update-event-async', async (req, res) => {
      var dataToken = await Utils.checkToken(req.query.accessToken);
      if (dataToken.errorMessage) {
        res.send({
          total: 0,
          data: [],
          errorName: dataToken.errorName,
          errorMessage: dataToken.errorMessage
        });
        return;
      }

      if (dataToken.role != 'admin') {
        res.send({
          total: 0,
          data: [],
          errorName: '403',
          errorMessage: 'Account can not access system by function'
        });
        return;
      }

      Utils.connect();
      ObjectSchema.create(req.body, (err, documents) => {
        if (err) {
          res.send({
            total: req.body.length,
            data: req.body,
            errorName: '422',
            errorMessage: 'Error'
          });
        }

        res.send({
          total: 0,
          data: [],
        })
      })
    })
  },

  postTicket(app) {
    app.post('/update-ticket-async', async (req, res) => {
      var dataToken = await Utils.checkToken(req.query.accessToken);
      if (dataToken.errorMessage) {
        res.send({
          total: 0,
          data: [],
          errorName: dataToken.errorName,
          errorMessage: dataToken.errorMessage
        });
        return;
      }

      if (dataToken.role != 'admin') {
        res.send({
          total: 0,
          data: [],
          errorName: '403',
          errorMessage: 'Account can not access system by function'
        });
        return;
      }

      Utils.connect();
      ObjectSchema.create(req.body, (err, documents) => {
        if (err) {
          res.send({
            total: req.body.length,
            data: req.body,
            errorName: '422',
            errorMessage: 'Error'
          });
        }
        var tickets = req.body;
        tickets.forEach(e => {
          var userSchema = require('../models/users.model');
          if (e.description !== '0') {
            // Utils.connect();
            userSchema.findById(e.userId, (errUser, resUser) => {
              console.log('err find: ' + errUser)
              if (resUser) {
                // Utils.connect();
                userSchema.update({ _id: e.userId }, { $set: { balance: resUser.balance - parseInt(e.description) } }).exec((errUpdate, dataUpdate) => {
                  console.log('err update: ' + errUpdate)
                });
              }
            });
          }
        });
        res.send({
          total: 0,
          data: [],
        })
      })
    })
  },
}