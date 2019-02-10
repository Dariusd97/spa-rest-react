module.exports = (sequelize, DataType) => {
    const Painting = sequelize.define("Paintings", {
        idPainting: {type:DataType.INTEGER, primaryKey:true, allowNull: false, autoIncrement: true, unique: true},
        name: {type:DataType.STRING, allowNull: false},
    });
    
    return Painting;
}