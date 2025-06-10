'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    admission_number: DataTypes.STRING,
    class_id: DataTypes.INTEGER,
    date_of_birth: DataTypes.DATEONLY,
    parent_id: DataTypes.INTEGER,
    img: { type: DataTypes.STRING, allowNull: true },
    blood_type: DataTypes.STRING,
    phone: { type: DataTypes.STRING, unique: true, allowNull: true },
    address: DataTypes.STRING,
    school_id: DataTypes.INTEGER,
    gender: DataTypes.ENUM('male', 'female', 'other'),
    birthday: DataTypes.DATEONLY
  }, {
    timestamps: true, // Includes createdAt and updatedAt automatically
  });

  Student.associate = function(models) {
    Student.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Student.belongsTo(models.Parent, { foreignKey: 'parent_id', as: 'parent' });
    Student.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    Student.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });

    // Many-to-Many: Student <-> Subject
    Student.belongsToMany(models.Subject, {
      through: 'StudentSubjects',
      foreignKey: 'student_id',
      otherKey: 'subject_id',
      as: 'subjects'
    });

    // Many-to-Many: Student <-> Lesson
    Student.belongsToMany(models.Lesson, {
      through: 'StudentLessons',
      foreignKey: 'student_id',
      otherKey: 'lesson_id',
      as: 'lessons'
    });

    // Many-to-Many: Student <-> Class (if student can be in multiple classes)
    // Student.belongsToMany(models.Class, {
    //   through: 'StudentClasses',
    //   foreignKey: 'student_id',
    //   otherKey: 'class_id',
    //   as: 'classes'
    // });
  };

  return Student;
};
