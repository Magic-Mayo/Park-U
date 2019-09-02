module.exports = (sequelize, DataTypes)=>{
    const Token = sequelize.define('Token', {
        token: {
            type: DataTypes.STRING,
        }
    })

    Token.associate = (models) => {
        Token.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
    
    return Token;
}