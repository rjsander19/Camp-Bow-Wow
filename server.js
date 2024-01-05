const express = require("express")
const mongoose = require("mongoose")
const List = require('./models/list')
const methodOverride = require("method-override")
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

const app = express()

const path = require('path');

app.use(express.static('public'));

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

//Configure ejs:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 


//INDUCES

//I
app.get('/', async (req, res) => {
    const allLists = await List.find({}). exec();
    res.render('index.ejs', {
        lists: allLists,
    });
});

//N
app.get('/new', (req, res) => {
    res.render('new.ejs', { list: {} });
});

//D
app.delete('/:id', async (req, res) => {
    await List.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

//U
app.put('/:id', async (req, res) => {
    const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new:true }
    );
    res.redirect(`/${updatedList.id}`);
});

//C
app.post('/', (req,res) => {
    const createdList = new List(req.body)
    createdList.save().then(res.redirect('/'))
});

//Edit
app.get('/:id/edit', async (req, res) => {
    const foundList = await List.findById(req.params.id).exec();
    if (!foundList) {
      res.send('List not found');
      return;
    }
    res.render('edit.ejs', { list: foundList });
  });

// Show
app.get('/:id', async (req, res) => {
  const foundList = await List.findById(req.params.id).exec();
  if (!foundList) {
    res.send('List not found');
    return;
  }
  res.render('show.ejs', {
    list: foundList,
  });
});






//Listener
const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`This is ${PORT}`)
    });