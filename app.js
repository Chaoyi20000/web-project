const express = require("express");
const app = express();
// require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(express.json());

// root
app.get("/", (req, res) => {
  // res.send("you can choose to go to patient page or clinician page");
  res.sendFile(__dirname + "/Static Page/start_page.html")
});

// middleware
const clinicianRouter = require("./routes/Router.js");

app.use("/clinician", clinicianRouter);

app.listen(port, () =>
  console.log("> Server is up and running on http://localhost:" + port)
);
