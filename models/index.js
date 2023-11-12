const AccessToken = require("./AccessToken");
const Friends = require('./Friends');
const Game = require('./Game');
const GamerTag = require('./GamerTag');
const Platform = require('./Platform');
const User = require('./User');
const UserGame = require('./UserGame');
const message = require('./message');

User.hasMany(GamerTag, {
    foreignKey: "user_id"
});

// Connecting friends together
// Getting the list of people who received the request.
User.belongsToMany(User, {
    through: Friends,
    as: "friended",
    foreignKey: "friend_id",

});

// Getting the list of people who sent friend requests
User.belongsToMany(User, {
    through: Friends,
    as: "friender",
    foreignKey: "user_id"
});


// Many-to-many between users and games
User.belongsToMany(Game, {
    through: UserGame,
    foreignKey: "user_id"
});

// Many-to-many between users and games
Game.belongsToMany(User, {
    through: UserGame,
    foreignKey: "game_id"
});


Platform.hasMany(GamerTag, {
    foreignKey: "platform_id"
});


GamerTag.belongsTo(Platform, {
    foreignKey: "platform_id"
});


GamerTag.belongsTo(User, {
    foreignKey: "user_id"
});

Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender'
});
Message.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'receiver'
});

User.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
});
User.hasMany(Message, {
    foreignKey: 'receiverId',
    as: 'receivedMessages'
});

module.exports = { AccessToken, Friends, Game, GamerTag, Platform, User, UserGame, message};