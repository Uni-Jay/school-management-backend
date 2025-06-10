'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question_type: {
      type: DataTypes.ENUM('multiple_choice', 'true_false', 'short_answer'),
      defaultValue: 'multiple_choice'
    },
    mark: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {});

  Question.associate = function(models) {
    Question.belongsTo(models.Exam, { foreignKey: 'exam_id', as: 'exam' });
    Question.belongsTo(models.School, { foreignKey: 'school_id' });
    Question.hasMany(models.Option, { foreignKey: 'question_id', as: 'options' });
  };

  return Question;
};
