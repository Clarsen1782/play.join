const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class Game extends Model { }

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'game',
    },
);

module.exports = Game;

