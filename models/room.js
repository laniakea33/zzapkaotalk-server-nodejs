const Sequelize = require('sequelize');

module.exports = class Room extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            image_src: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "제목 없음"
            },
            last_chat: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            created_date_time: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            unread_count: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            owner: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "",
            },
        }, {
            sequelize,
            modelName: 'Room',
            tableName: 'rooms',
            timestamps: false,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Room.hasMany(db.Chat, { foreignKey: 'room_no', sourceKey: 'id'});
    }
};