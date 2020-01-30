const util = require('util');
const mysql = require('mysql');

//creates connection pool
const pool = mysql.createPool({
	connectionLimit: 100,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
	if(err){
		console.log("Err0r : " + err);
	}

	if(connection){
		connection.release();
	}

	return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;