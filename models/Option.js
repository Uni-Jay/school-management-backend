'use strict';
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    option_text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  Option.associate = function(models) {
    Option.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
    Option.belongsTo(models.School, { foreignKey: 'school_id' });
  };

  return Option;
};
