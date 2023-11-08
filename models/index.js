const Friends = require('./Friends');
const Game = require('./Game');
const GamerTag = require('./GamerTag');
const Platform = require('./Platform');
const User = require('./User');
const UserGame = require('./UserGame');

User.hasMany(Game, {
    through: UserGame
});

User.hasMany(GamerTag, {
    foreignKey: "user_id"
});

// Connecting friends together
User.belongsToMany(User, {
    through: Friends,
});

// Connecting users to games
Game.belongsToMany(User, {
    through: UserGame
});


Platform.hasMany(GamerTag, {
    foreignKey: "platform_id"
});


GamerTag.belongsTo(Platform, {
    foreignKey: "platform_id"
});



module.exports = { Friends, Game, GamerTag, Platform, User, UserGame };