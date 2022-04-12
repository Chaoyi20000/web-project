const express = require("express");
var path = require('path');
const exphbs = require('express-handlebars');



const app = express();
// require('dotenv').config()
const port = process.env.PORT || 5000;

app.engine('hbs', exphbs.engine({      // configure Handlebars 
  defaultlayout: 'main',
  extname: 'hbs' 
})) ;
 
app.set('view engine', 'hbs')  ; // set Handlebars view engine


app.use(express.json());

app.use(express.static(__dirname + '/'));


// root
// app.get("/", (req, res) => {
//   // res.send("you can choose to go to patient page or clinician page");
//   res.sendFile(__dirname + "/static/start_page.html")
// });

app.get('/', (req,res) => { 
  res.render('clinician-comment.hbs')
});


// middleware
const clinicianRouter = require("./routes/Router.js");

app.use("/clinician", clinicianRouter);

app.listen(port, () =>
  console.log("> Server is up and running on http://localhost:" + port)
);
