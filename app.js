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



app.get("/", (req, res) => {
  // res.send("you can choose to go to patient page or clinician page");
  res.sendFile(__dirname + "/static/start_page.html")
});

// app.get('/', (req,res) => { 
//   res.render('start_page.html')
// });

app.get("/login_patient", (req,res) => { 
  res.render('login_portal_patient.hbs')
});

app.get("/login_clinician", (req,res) => { 
  res.render('login_portal_clinician.hbs')
});

// middleware
const clinicianRouter = require("./routes/Router.js");

app.use("/login_patient", clinicianRouter);

app.listen(port, () =>
  console.log("> Server is up and running on http://localhost:" + port)
);
