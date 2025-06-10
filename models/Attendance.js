'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      defaultValue: 'present'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Attendance.associate = function(models) {
    Attendance.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });

    Attendance.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

    Attendance.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  };

  return Attendance;
};
