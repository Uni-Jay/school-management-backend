module.exports = (sequelize, DataTypes) => {
    const GradeScheme = sequelize.define('GradeScheme', {
      school_id: { type: DataTypes.INTEGER, allowNull: false },
      grade: DataTypes.STRING, // e.g., A, B, C
      min_score: DataTypes.INTEGER,
      max_score: DataTypes.INTEGER,
      remarks: DataTypes.STRING
    });
  
    GradeScheme.associate = models => {
      GradeScheme.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return GradeScheme;
  };
  