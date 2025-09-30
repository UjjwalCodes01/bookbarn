const express = require('express');
const userRouter = require("./router/index")
const bodyParser = require('body-parser');
const {connection} = require('./connection/connect')
const PORT = 3000;

function connectorBackend(){

    const app = express();
    connection('mongodb://127.0.0.1:27017/bookbarn')

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    app.use("/", userRouter)
    app.listen(PORT , ()=>{
        console.log(`Server Started at ${PORT}`);
    })

}

connectorBackend();