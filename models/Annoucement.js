module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define('Announcement', {
      title: DataTypes.STRING,
      message: DataTypes.TEXT,
      posted_by: DataTypes.INTEGER, // user_id
      school_id: { type: DataTypes.INTEGER, allowNull: false }
    });
  
    Announcement.associate = models => {
      Announcement.belongsTo(models.User, { foreignKey: 'posted_by', as: 'author' });
      Announcement.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return Announcement;
  };
  