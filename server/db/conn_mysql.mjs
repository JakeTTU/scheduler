import "../loadEnvironment.mjs";
import mysql from 'mysql2'

// const db = mysql.createConnection({
//   host: process.env.MYSQL_HOST ,
//   user: process.env.MYSQL_USER ,
//   password: process.env.MYSQL_PASSWORD ,
//   database: process.env.MYSQL_DATABASE ,
//   port: process.env.MYSQL_PORT,
//   authPlugins: {
//     mysql_clear_password: () => () => Buffer.from(process.env.MYSQL_PASSWORD), // For 'caching_sha2_password'
//   },
// });



// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     console.log('retrying')
//   }
//   console.log('Connected to MySQL');
// });

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.MYSQL_PASSWORD), // For 'caching_sha2_password'
  },
};

async function connectWithRetry() {
  const MAX_RETRIES = 15;
  const RETRY_INTERVAL_MS = 5000;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    const connection = mysql.createConnection(dbConfig);

    try {
      await new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            console.error('Connection failed. Retrying...');
            retries++;
            setTimeout(reject, RETRY_INTERVAL_MS);
          } else {
            console.log('Connected to MySQL database');
            resolve(connection);
          }
        });

        connection.on('error', (err) => {
          console.error('Database error:', err.message);
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            reject();
          }
        });
      });

      return connection;

    } catch (error) {
      if (retries >= MAX_RETRIES) {
        console.error('Max connection retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
}

const db = await connectWithRetry();


export default db;

