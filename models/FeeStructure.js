module.exports = (sequelize, DataTypes) => {
    const FeeStructure = sequelize.define('FeeStructure', {
      class_id: DataTypes.INTEGER,
      term: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      description: DataTypes.STRING,
      school_id: { type: DataTypes.INTEGER, allowNull: false }
    });
  
    FeeStructure.associate = models => {
      FeeStructure.belongsTo(models.Class, { foreignKey: 'class_id' });
      FeeStructure.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return FeeStructure;
  };
  