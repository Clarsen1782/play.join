const Game = require('./Game');
const GamerTag = require('./GamerTag');
const Platform = require('./Platform');
const User = require('./User');
const UserGame = require('./UserGame');

User.hasMany(GamerTag, {
    foreignKey: "user_id"
});

module.exports = { Game, GamerTag, Platform, User, UserGame };