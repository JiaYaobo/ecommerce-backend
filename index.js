const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const sqldb = require('./sqldb');

dotenv.config()

const authRoute = require('./routes/auth');

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));


app.use("/api/auth", authRoute);

app.listen(8800, ()=>{
    console.log("Backend server is running");
});




