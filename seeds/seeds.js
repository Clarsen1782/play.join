const sequelize = require('../config/connection');
const { Friends, Game, GamerTag, Platform, User, UserGame } = require('../models');

const friendsData = require('./friendsData.json');
const gameData = require('./gameData.json');
const gamerTagData = require('./gamerTagData.json');
const platformData = require('./platformData.json');
const userData = require('./userData.json');
const userGameData = require('./userGameData.json');

const seedDatabase = async () => {
    await sequelize.sync({force: true});

    await User.bulkCreate(userData);
    console.log("\n\n---- SEEDED USER ----");

    await Game.bulkCreate(gameData);
    console.log("\n\n---- SEEDED GAME ----");

    await Platform.bulkCreate(platformData);
    console.log("\n\n---- SEEDED PLATFORM ----");

    await Friends.bulkCreate(friendsData);
    console.log("\n\n---- SEEDED FRIENDS ----");

    await GamerTag.bulkCreate(gamerTagData);
    console.log("\n\n---- SEEDED GAMERTAG ----");

    await UserGame.bulkCreate(userGameData);
    console.log("\n\n---- SEEDED FRIENDS ----");


    process.exit(0);
}

seedDatabase();