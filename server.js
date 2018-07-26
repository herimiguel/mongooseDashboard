var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));


// app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//create connections to db
mongoose.connect('mongodb://localhost/animal');

// Create Schema
var animalSchema = new mongoose.Schema({
 name: String,
 description: String,
 food: String,
 created: Date
})
mongoose.model('animal', animalSchema); // We are setting this Schema in our Models as 'animal'
var animal = mongoose.model('animal') // We are retrieving this Schema from our Models, named 'animal'


// Routes go here!

app.get('/', function(req, res) {
  
  // Make call to DB to get all quote
  animal.find({}, function(err, animal) {
    if(err) {
      console.log(err);
      res.render('index', {'error': "Things messed up"});
    } else {
      console.log(animal);

      console.log("at render");
      res.render('index', {'animal': animal});
    }
  });
})

// Add quote Request 
//taking to create.ejs
app.get('/createPage', function(req, res){
    res.render('create');

});
//add posting new animal and redirect it to '/' where itll be render to index
app.post('/addAnimal', function(req, res) {
    console.log("POST DATA", req.body);

    var newAnimal = new animal({name: req.body.name, description: req.body.description, food: req.body.food, created: req.body.created});
   
    newAnimal.save(function(err) {
      if(err) {
        console.log(name, description, food, created);
        
      } else {        
      
        res.redirect('/');
      }
    });    
});

//edit the anima and rendering page with animal id 
app.get('/:id/edit/', function(req, res){
    animal.find({ _id: req.params.id }, function(err, animal) {
    if (err) { console.log(err);}
    res.render('edit', {'animal': animal });
  })
});

//rendering to show animal on showAnimal.ejs
app.get('/:id', function(req, res){
    animal.find({ _id: req.params.id }, function(err, animal){
    if (err) {console.log(err); }
    res.render('showAnimal', {'animal': animal});
    });

});

//editing the animal on the POST form. it'll redirect to '/' >>index
app.post('/:id', function(req, res){
  animal.update({ _id: req.params.id }, req.body, function(err, result){
    if (err) { console.log(err); }
    res.redirect('/');
  });
});
// deleting animal with id. redirect to '/' >>index!
app.get('/:id/delete/', function(req, res){
    animal.remove({ _id: req.params.id }, function(err, animal) {
    if (err) { console.log(err); }
    res.redirect('/');
  })
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})

