module.exports = (sequelize, DataTypes)=>{
    const Character = sequelize.define('Character', {
        charName: {
            type: DataTypes.STRING,
            underscored: true,
            allowNull: false
        },
        class: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        defense: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        luck: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxHP: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        currentHP: {
            type: DataTypes.INTEGER
        }
    });

    Character.associate = (models) => {
        Character.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            },
            constraints: false
        });
        Character.belongsTo(models.Attack, {
            foreignKey: {
                allowNull: false
            },
            constraints: false
        })
    }
    
    return Character;
}