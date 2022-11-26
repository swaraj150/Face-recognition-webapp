const connectToMongo=require('./db');
connectToMongo();

const express = require('express')
const app = express()
const port = 8000
var cors=require("cors");
app.use(cors());
app.use(express.json());
app.use("/api/create",require("./routes/Create"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port at http://localhost:${port}`)
})