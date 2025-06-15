'use stricts'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    type: DataTypes.ENUM('announcement', 'assignment', 'event', 'exam', 'attendance', 'other'),
  }, {
    timestamps: true // includes createdAt and updatedAt
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return Notification;
};