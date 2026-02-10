const mysql = require('mysql2');

// Linux EC2 pe host.docker.internal ka support nahi hota; 
// default docker bridge IP 172.17.0.1 use hota hai (common case).
// Agar alag IP mili toh docker0 interface se check karo.
const pool = mysql.createPool({
  host: '172.17.0.1',
  user: 'user',
  password: 'user123',
  database: 'userdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
