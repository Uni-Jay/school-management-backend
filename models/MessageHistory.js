'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    stream_message_id: DataTypes.STRING,
    channel_id: DataTypes.STRING,
    school_id: DataTypes.INTEGER,
  });

  Message.associate = function(models) {
    Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    Message.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
  };

  return Message;
};
