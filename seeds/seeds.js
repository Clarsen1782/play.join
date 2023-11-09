const sequelize = require('../config/connection');
const { Friends, Game, GamerTag, Platform, User, UserGame } = require('../models');

const friendsData = require('./friendsData.json');
const gameData = require('./gameData.json');
const gamerTagData = require('./gamerTagData.json');
const platformData = require('./platformData.json');
const userData = require('./userData.json');
const userGameData = require('./userGameData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true }); // Makes tables reinitialize ({ Makes tables update})

  const users = await User.bulkCreate(userData, {
    individualHooks: true, //must have to make hooks work
    returning: true,
  });

  // seeds need all models to be defined so we know what to set up

  // .bulkCreate can be used for tables that are not associated to another table (ex users, shown above)

  // tables that need to be linked will need a for/of loop such as the example below from 28-Stu_Mini-Project with changes to suit needs

  /* for (const project of projectData) {
    await Project.create({
      ...project,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }*/

  process.exit(0);
};

seedDatabase();
