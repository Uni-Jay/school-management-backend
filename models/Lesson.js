'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    day: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday'),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    school_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Lesson.associate = function(models) {
    Lesson.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject'
    });

    Lesson.belongsTo(models.Class, {
      foreignKey: 'class_id',
      as: 'class'
    });

    Lesson.belongsTo(models.Teacher, {
      foreignKey: 'teacher_id',
      as: 'teacher'
    });

    // Add these if you have Exam, Assignment, Attendance models
    // Lesson.hasMany(models.Exam, {
    //   foreignKey: 'lesson_id',
    //   as: 'exams'
    // });

    // Lesson.hasMany(models.Assignment, {
    //   foreignKey: 'lesson_id',
    //   as: 'assignments'
    // });

    // Lesson.hasMany(models.Attendance, {
    //   foreignKey: 'lesson_id',
    //   as: 'attendances'
    // });
  };

  return Lesson;
};
