const Sequelize = require('sequelize');
const Room = require('./room');
const Chat = require('./chat');
const User = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.sequelize = sequelize;
db.Room = Room;
db.Chat = Chat;
db.User = User;

Room.init(sequelize);
Chat.init(sequelize);
User.init(sequelize);

Room.associate(db);
Chat.associate(db);

module.exports = db;
