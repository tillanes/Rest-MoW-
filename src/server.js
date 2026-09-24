const express = require('express');
const app = express();
require('dotenv').config()
const PORT = 3000;


// Tolkar inkommande JSON-data och lägger den i req.body
app.use(express.json());  

app.get('/', (req, res) => {
  res.send('Hello world');
});

const notesRouter = require('./routes/notes')
app.use('/notes', notesRouter)

const boardsRouter = require('./routes/boards')
app.use('/boards', boardsRouter)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});