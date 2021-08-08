const Sequelize = require('sequelize');

module.exports = class Chat extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "메시지 없음",
            },
            date_time: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            modelName: 'Chat',
            tableName: 'chats',
            timestamps: false,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {        
        db.Chat.belongsTo(db.Room, { foreignKey: 'room_no', sourceKey: 'id'});
        db.Chat.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'id'});
    }
};