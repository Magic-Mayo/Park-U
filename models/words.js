module.exports = (sequelize, DataTypes)=>{
    const Word = sequelize.define('Word', {
        pass: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Word.associate = (models) =>{
        Word.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Word;
}