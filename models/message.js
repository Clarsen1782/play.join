module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    User.associate = function(models) {
        User.hasMany(models.Message, {
            foreignKey: 'senderId',
            as: 'sentMessages'
        });
        User.hasMany(models.Message, {
            foreignKey: 'receiverId',
            as: 'receivedMessages'
        });
    };
    return Message;
};