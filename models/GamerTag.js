const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');
const User = require('./User');
const Platform = require('./Platform');

class GamerTag extends Model { }

GamerTag.init(
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
        platform_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Platform,
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
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'gamerTag',
    },
);

module.exports = GamerTag;