module.exports = (sequelize, DataType) => {
    const Artist = sequelize.define("Artists", {
        idArtist: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true},
        name: {type: DataType.STRING(30), allowNull: false},
        link: {type:DataType.STRING, allowNull:false}
    });
    
    return Artist;
}

