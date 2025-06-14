'use strict';
module.exports = (sequelize, DataTypes) => {
  const CallHistory = sequelize.define('CallHistory', {
    caller_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('audio', 'video'),
    duration: DataTypes.INTEGER, // in seconds
    status: DataTypes.ENUM('missed', 'completed'),
    is_group: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, // Unique identifier for the call in the streaming service
    school_id: DataTypes.INTEGER
  });

  CallHistory.associate = function(models) {
    CallHistory.belongsTo(models.User, { foreignKey: 'caller_id', as: 'caller' });
    CallHistory.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
  };

  return CallHistory;
};
