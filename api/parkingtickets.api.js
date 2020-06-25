const multer = require('multer');
const fs = require('fs');
const env = require('../const_env');
const ObjectSchema = require('../models/parkingTickets.model');
var Utils = require('../Utils');

module.exports = {
  uploadImage(app) {
    let _date = new Date();
    const _rootFolder = `${env.ROOT_IMAGES}\\${env.db_collection.packingTickets}\\${_date.getFullYear()}${_date.getMonth()}${_date.getDate()}`;
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


}