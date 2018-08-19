const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('view engine', 'ejs')

var db;

MongoClient.connect('mongodb://<username>:<password>@ds225442.mlab.com:25442/todo-app-mq', (err, client) => {
    if (err) return console.log(err)
    db = client.db('todo-app-mq')
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
})

app.get('/', (req, res) => {
    db.collection('todo').find().toArray((err, result) => {
        if (err) return console.log(err)
        
        res.render('index.ejs', {
            todo: result
        })
    })
})

app.post('/todo', (req, res) => {
    db.collection('todo').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})

app.post('/todo/done', (req, res) => {
    db.collection('todo').findOneAndDelete({text: req.body.text},
        (err, result) => {
          if (err) return res.send(500, err)
          res.redirect('/')
        })
})