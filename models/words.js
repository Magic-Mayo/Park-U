module.exports = (sequelize, DataTypes)=>{
    const Word = sequelize.define('Word', {
        pass: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Word.associate = (models) =>{
        Word.hasOne(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
    return Word
}