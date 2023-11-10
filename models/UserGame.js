const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');
const Game = require('./Game');
const User = require('./User');
const GamerTag = require('./GamerTag');

class UserGame extends Model { }

UserGame.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        game_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Game,
                key: 'id',
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            }
        },
        gamertag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: GamerTag,
                key: 'id',
            }
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'userGame',
    },
);

module.exports = UserGame;