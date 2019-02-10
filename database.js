const Sequelize = require('sequelize');

const database = process.env.database || 'c9';
const username = process.env.username || 'darius';
const password = process.env.password || 'loaded';
const hostname = process.env.hostname || 'localhost';


const sequelize = new Sequelize(database, username, password, {
    host: hostname,
    dialect: 'mysql',
    define : {
		timestamps : false
	}
});

const db = {
    User: sequelize.import('models' + '/User'),
    Favorite: sequelize.import('models' + '/Favorite'),
    Painting: sequelize.import('models' + '/Painting'),
    Artist: sequelize.import('models' + '/Artist'),
    AccessToken : sequelize.import('models' +'/AccessToken')
};

db['User'].hasOne(db['Favorite']);
db['Favorite'].hasMany(db['Artist']);
db['Artist'].hasMany(db['Painting']);


sequelize.sync()
    .then()
    .catch((error) => console.log(error));

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully,');
    })
    .catch(err => {
        console.log('Unable to connect to the database: ', err);
    });
    

module.exports = db;
