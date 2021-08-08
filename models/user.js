const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            device_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            display_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            profile_image_url: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: false,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Chat, { foreignKey: 'user_id', sourceKey: 'id'});
    }
};