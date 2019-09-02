module.exports = (sequelize, DataTypes) => {
    const CompCharacter = sequelize.define('CompCharacter', {
        charName: {
            type: DataTypes.STRING
        },
        defense: {
            type: DataTypes.INTEGER,
        },
        luck: {
            type: DataTypes.INTEGER,
        },
        maxHP: {
            type: DataTypes.INTEGER,
        },
        currentHP: {
            type: DataTypes.INTEGER,
        }
    }, {timestamps: false})

    return CompCharacter;
}