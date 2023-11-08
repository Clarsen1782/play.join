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

    
}