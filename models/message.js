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

    Message.associate = function(models) {
        Message.belongsTo(models.User, {
            foreignKey: 'senderId',
            as: 'sender'
        });
        Message.belongsTo(models.User, {
            foreignKey: 'receiverId',
            as: 'receiver'
        });
    };

    return Message;
};