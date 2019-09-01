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
        hp: {
            type: DataTypes.INTEGER,
        }
    }, {timestamps: false})

    return CompCharacter;
}