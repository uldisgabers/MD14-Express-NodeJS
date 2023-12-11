const mysql = require('mysql2');
const DB_NAME = 'my_first_database'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'example',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(createDatabaseQuery, (createDatabaseError, createDatabaseResults) => {
    if (createDatabaseError) {
      console.error('Error creating database:', createDatabaseError);
      connection.end();
      return;
    }

    console.log(`Database "${DB_NAME}" created or already exists`);

    // Switch to the created database
    connection.changeUser({ database: DB_NAME }, (changeUserError) => {
      if (changeUserError) {
        console.error('Error switching to database:', changeUserError);
        connection.end();
        return;
      }

      console.log(`Switched to database "${DB_NAME}"`);

      // Define the SQL query to create a table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cars (
          id INT AUTO_INCREMENT PRIMARY KEY,
          brand VARCHAR(255) NOT NULL,
          model VARCHAR(255) NOT NULL,
          color VARCHAR(255) NOT NULL,
          price VARCHAR(255) NOT NULL,
          createdAt VARCHAR(255) NOT NULL,
          img VARCHAR(255) NOT NULL
        )
      `;

      // Execute the query to create the table
      connection.query(createTableQuery, (createTableError, createTableResults) => {
        if (createTableError) {
          console.error('Error creating table:', createTableError);
          connection.end();
          return;
        }

        console.log('Table "cars" created or already exists');

        // Define the SQL query to insert data into the table
        const insertDataQuery = `
          INSERT INTO cars (brand, model, color, price, createdAt, img) VALUES
            ('VOLVO', 'S80', 'White', '8000', '2023-11-21T20:31:46.480Z', 'volvo.png'),
            ('FIAT', 'Multipla', 'Purva-dirsiens', '1', '2023-11-21T20:32:45.273Z', 'ford.png'),
            ('OPEL', 'Pirmais', 'Jāņunakts', '100', '2023-11-21T20:33:09.626Z', 'mercedes.png')
        `;

        // Execute the query to insert data
        connection.query(insertDataQuery, (insertDataError, insertDataResults) => {
          if (insertDataError) {
            console.error('Error inserting data:', insertDataError);
          } else {
            console.log('Data inserted or already exists');
          }

          // Close the connection
          connection.end();
        });
      });
    });
  });
});
