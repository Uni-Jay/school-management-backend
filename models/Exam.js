'use strict';
module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,

    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },

    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },

    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    type: {
      type: DataTypes.ENUM('cbt', 'written'),
      defaultValue: 'cbt'
    },

    total_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    pass_mark: {
      type: DataTypes.INTEGER,
      defaultValue: 40
    }
  }, {});

  Exam.associate = function(models) {
    Exam.belongsTo(models.School, { foreignKey: 'school_id' });
    Exam.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    Exam.belongsTo(models.Subject, { foreignKey: 'subject_id', as: 'subject' });
    Exam.belongsTo(models.Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

    Exam.hasMany(models.Question, { foreignKey: 'exam_id', as: 'questions' });
    Exam.hasMany(models.StudentAnswer, { foreignKey: 'exam_id', as: 'answers' });
  };

  return Exam;
};
