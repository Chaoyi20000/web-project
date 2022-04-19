const express = require("express");
var path = require('path');
const exphbs = require('express-handlebars');
// const patient = require("models/patient.js");

const app = express();
// require('dotenv').config()
const port = process.env.PORT || 5000;

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost",{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    dbName:"info30005-g39",
  }) 
  .then(()=>console.log("connect to Mongo"))
  .catch((err)=>console.log(err,"\nfailed to connect to Mongo"));



app.engine('hbs', exphbs.engine({      // configure Handlebars 
  defaultlayout: 'main',
  extname: 'hbs' ,
  helpers: require("./public/js/helpers.js").helpers,
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
const router = require("./routes/Router.js");
app.use("/login_patient", router);


// app.post('/login_portal_patient', function(request, response) {
// 	// Capture the input fields
// 	let username = request.body.user_id;
// 	let password = request.body.password;
// 	// Ensure the input fields exists and are not empty
// 	if (username && password) {
// 		// Execute SQL query that'll select the account from the database based on the specified username and password

//     const user = patient.findOne({email:username})
//     if( (user!=null)){
//       if(user.password != password){
//         response.send('Incorrect Username and/or Password!');
//       }else{
//         response.redirect('/patient_dashboard');
//       }
//     }else{
//       response.send('Incorrect Username and/or Password!');
//     }
//     response.end();
  
// 	} else {
// 		response.send('Please enter Username and Password!');
// 		response.end();
// 	}
// });


app.listen(port, () =>
  console.log("> Server is up and running on http://localhost:" + port)
);