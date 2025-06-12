'use strict';
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    timestamps: true,
    tableName: 'otps',
  });

  OTP.associate = function(models) {
    OTP.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return OTP;
};
