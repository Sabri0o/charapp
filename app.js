const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using the set method to assign pug as the view engine property's value of express
app.set("view engine", "pug");

// serving static assets
app.use('/public', express.static(__dirname + '/public'));

//rendering the home page from the response.
app.get("/", function (req, res) {
  // console.log(__dirname)
  res.render(__dirname + "/views/pug/home.pug",{message_1:'Hello there',message_2:'nice to meet you'});
});

app.listen(8000, () => {
  console.log("Listening on port 3000");
});
