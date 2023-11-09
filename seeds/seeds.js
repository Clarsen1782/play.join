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
    console.log("\n\n");


    await User.bulkCreate(userData, { individualHooks: true }); // Runs beforeCreate for all
    console.log("---- SEEDED USER ----\n\n");

    await Game.bulkCreate(gameData);
    console.log("---- SEEDED GAME ----\n\n");

    await Platform.bulkCreate(platformData);
    console.log("---- SEEDED PLATFORM ----\n\n");

    await Friends.bulkCreate(friendsData);
    console.log("---- SEEDED FRIENDS ----\n\n");

    await GamerTag.bulkCreate(gamerTagData);
    console.log("---- SEEDED GAMERTAG ----\n\n");

    await UserGame.bulkCreate(userGameData);
    console.log("---- SEEDED USERGAME ----\n\n");


    process.exit(0);
}

seedDatabase();