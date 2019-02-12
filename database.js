const Sequelize = require('sequelize');

const database = process.env.database || 'databse_name';
const username = process.env.username || 'username';
const password = process.env.password || 'password';
const hostname = process.env.hostname || 'hostname';

// connection to database
const sequelize = new Sequelize(database, username, password, {
    host: hostname,
    dialect: 'mysql',
    define : {
		timestamps : false
	}
});

// import models
const db = {
    User: sequelize.import('models' + '/User'),
    Favorite: sequelize.import('models' + '/Favorite'),
    Painting: sequelize.import('models' + '/Painting'),
    Artist: sequelize.import('models' + '/Artist'),
    AccessToken : sequelize.import('models' +'/AccessToken')
};
// establish relations between tables
db['User'].hasOne(db['Favorite']);
db['Favorite'].hasMany(db['Artist']);
db['Artist'].hasMany(db['Painting']);

// create tables
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
