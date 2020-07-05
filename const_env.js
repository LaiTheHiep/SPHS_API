exports.hostname = '127.0.0.1';
exports.port = process.env.PORT || '8080';

// Mongo
// const url = 'mongodb://localhost:27017/';
const url = 'mongodb+srv://LaiTheHiep:kingstar02@clustersphs.gzqky.mongodb.net/SPHS_DB?retryWrites=true&w=majority';
const db_name = 'SPHS_DB';
const url_db = url + db_name;

exports.url = url;
exports.db_name = db_name;
exports.url_db = url_db;

exports.ROOT_IMAGES = 'C:\\SPHS_images';

// collection name
exports.db_collection = {
  roles: 'roles',
  users: 'users',
  transactions: 'transactions',
  companies: 'companies',
  packingTickets: 'parkingtickets',
  vehicleTypes: 'vehicletypes'
};

// limit get list data
const skip = 0;
const limit = 200;
const sort = { createdAt: -1 };

exports.skip = skip;
exports.limit = limit;
exports.sort = sort;

exports.IMG_BB_KEY = 'bbda9cabea0a8e3852cbe26df54d959c';
exports.IMG_BB_IMAGE_UPLOAD = 'https://api.imgbb.com/1/upload';
const PRIVATE_KEY = 'Hat Dau Nho - Manchester United';
exports.PRIVATE_KEY = PRIVATE_KEY;

const EXPIRY_TOKEN = 86400000; // 1day (milliseconds)
exports.EXPIRY_TOKEN = EXPIRY_TOKEN;

exports.FORBIDDEN = {
  get: {
    admin: [],
    security: [`/${this.db_collection.roles}`, `/${this.db_collection.vehicleTypes}`],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`]
  },
  post: {
    admin: [],
    security: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.packingTickets}`]
  },
  put: {
    admin: [],
    security: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.transactions}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.transactions}`, `/${this.db_collection.packingTickets}`]
  },
  delete: {
    admin: [],
    security: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.packingTickets}`, `/${this.db_collection.users}`, `/${this.db_collection.transactions}`]
  }
};