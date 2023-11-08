const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');
const User = require('./User');

class Friends extends Model { }

Friends.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        user_id: { // The one that sends the friend request
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            }
        },
        friend_id: { // The one that receives the request
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'friends',
    },
);

module.exports = Friends;