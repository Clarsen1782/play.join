const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class AccessToken extends Model { }

AccessToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'accesstoken',
    },
);

module.exports = AccessToken;

