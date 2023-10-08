const express = require('express');
const app = express();
const serverConfig = require('./configs/server.config')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./configs/db.config');
const User = require("./models/user.model")
const bcrypt = require("bcryptjs")
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
  

var corsOptions = {
    origin: true
};
app.use(cors(corsOptions));
  

// app.use(express.static(__dirname));

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", ()=>{
    console.log("#### Error while connecting to mongoDB ####");
});
db.once("open",()=>{
    console.log("#### Connected to mongoDB ####");  
});

require("./routes/home.route")(app);
require("./routes/students.route")(app)
require("./routes/auth.routes")(app)
require("./routes/expenditure.route")(app)
require("./routes/pettyCash.route")(app);
require("./routes/installment.route")(app);


app.listen(serverConfig.PORT,()=>{
    console.log(`#### connected to server at port no.: ${serverConfig.PORT} ####`);
})


