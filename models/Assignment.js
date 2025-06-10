'use strict';
module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Assignment.associate = function(models) {
    Assignment.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

    Assignment.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  };

  return Assignment;
};
