import { connection } from "./db";
import express, { Request, Response } from 'express'
const cors = require('cors');
var bodyParser = require('body-parser')
const app = express();
const port = 3001;

app.use(bodyParser.json())

type Car = {
  id: number;
  img: string;
  brand: string;
  model: string;
  color: string;
  price: string;
  createdAt: string;
};

app.use(cors({
  origin: '*'
}));

app.get('/cars', async (req, res) => {
  // Execute the query to get all cars
  connection.query('SELECT * FROM cars', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the cars as a JSON response
    res.json({ cars: results });
  });
});

app.post('/car', async (req: Request<{}, {}, Car>, res) => {
  const { brand, color, createdAt, id, img, model, price } = req.body;
  
  if (!brand || !color || !createdAt || !img || !model || !price) {
    res.status(400).send('Invalid data');
    return;
  }

  connection.query(`
    INSERT INTO cars (brand, color, createdAt, img, model, price) 
    VALUES ('${brand}', '${color}', '${createdAt}', '${img}', '${model}', '${price}')
    `, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({cars: results})
  })
})

app.delete('/cars/:id', async (req, res) => {

  connection.query(`
    DELETE FROM cars 
    WHERE id='${req.params.id}'
    `, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json('Data deleted succesfully')
  })
})

app.put('/cars/:id', async (req, res) => {
  const { brand, color, id, model, price } = req.body;

  console.log(req.params.id)
  console.log(brand)


  connection.query(`
    UPDATE cars SET brand = '${brand}', model = '${model}', color = '${color}', price = '${price}' WHERE id = '${req.params.id}'
  `, (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log(result)
    res.json('Data updated')
  })
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
