const Utils = require("./Utils");
const env = require('./const_env');
const express = require('express');
const port = env.port;
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

// Use Node.js body parsing middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// init database
Utils.setupDatabase();

// role
// const role = require('./api/roles.api');
// role.get(app);
// role.post(app);
// role.patch(app);
// role.delete(app);

const role = require('./models/roles.model');
const role_link = `/${env.db_collection.roles}`;
Utils.get(app, role, role_link);
Utils.post(app, role, role_link);
Utils.put(app, role, role_link);
Utils.delete(app, role, role_link);

// Start the server
const server = app.listen(port, (error) => {
  if (error) {
    throw error;
  }
});
