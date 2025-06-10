'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeacherClasses = sequelize.define('TeacherClasses', {
    teacher_id: DataTypes.INTEGER,
    class_id: DataTypes.INTEGER,
    school_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  return TeacherClasses;
};
