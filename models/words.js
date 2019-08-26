module.exports = (sequelize, DataTypes)=>{
    const Word = sequelize.define('Word', {
        pass: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 20],
                isAplhanumeric: true
            }
        }
    });

    Word.associate = (models) =>{
        Word.hasOne(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Word;
}