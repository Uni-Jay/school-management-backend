module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      school_id: { type: DataTypes.INTEGER, allowNull: false }
    });
  
    Event.associate = models => {
      Event.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return Event;
  };
  