'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentAnswer = sequelize.define('StudentAnswer', {
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    selected_option_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    short_answer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  StudentAnswer.associate = function(models) {
    StudentAnswer.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    StudentAnswer.belongsTo(models.Exam, { foreignKey: 'exam_id', as: 'exam' });
    StudentAnswer.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
    StudentAnswer.belongsTo(models.Option, { foreignKey: 'selected_option_id', as: 'selectedOption' });
    StudentAnswer.belongsTo(models.School, { foreignKey: 'school_id' });
  };

  return StudentAnswer;
};
