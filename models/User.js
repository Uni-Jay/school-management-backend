'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    full_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.ENUM(
      'super_admin',
      'school_super_admin',
      'school_admin',
      'teacher',
      'student',
      'parent'
    ),
    school_id: DataTypes.INTEGER,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });

  User.associate = function(models) {
    // All associations go here
    User.hasOne(models.Student, { foreignKey: 'user_id', as: 'studentProfile' });
    User.hasOne(models.SuperAdmin, { foreignKey: 'user_id', as: 'superAdminProfile' });
    User.hasOne(models.SchoolAdmin, { foreignKey: 'user_id', as: 'schoolAdminProfile' });
    User.hasOne(models.SchoolSuperAdmin, { foreignKey: 'user_id', as: 'schoolSuperAdminProfile' });
    User.hasOne(models.Teacher, { foreignKey: 'user_id', as: 'teacherProfile' });
    User.hasOne(models.Parent, { foreignKey: 'user_id', as: 'parentProfile' });

    User.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  };

  return User;
};
