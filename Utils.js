const mongoose = require('mongoose');
const env = require('./const_env');

module.exports = {
  connect(){
    mongoose.connect(env.url_db );
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
  }
}
