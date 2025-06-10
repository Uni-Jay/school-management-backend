'use strict';
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grade_level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Class.associate = function(models) {
    Class.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });

    Class.hasMany(models.Student, { foreignKey: 'class_id', as: 'students' });

    Class.hasMany(models.Lesson, { foreignKey: 'class_id', as: 'lessons' });

    Class.hasMany(models.Exam, { foreignKey: 'class_id', as: 'exams' });
  };

  return Class;
};
