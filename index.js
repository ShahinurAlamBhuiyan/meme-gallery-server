const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7wr7p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
  res.send("Welcome to meme gallery.")
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const memesCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_NAME}`);

  console.log('db connected')

  app.post('/addMeme', (req, res) => {
    console.log('hitted')
    const meme = req.body;
    memesCollection.insertOne(meme)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/allMemes', (req, res) => {
    memesCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.delete('/deleteMeme/:id', (req, res) => {
    memesCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result)
      })
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});