const express = require('express');
const cors = require('cors');
const userRouter = require("./router/index")
const bodyParser = require('body-parser');
const {connection} = require('./connection/connect')
const PORT = 3000;

function connectorBackend(){

    const app = express();
    connection('mongodb://127.0.0.1:27017/bookbarn')

    // CORS middleware
    app.use(cors({
        origin: 'http://localhost:5173', // Vite development server
        credentials: true
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    // API routes
    app.use("/api", userRouter)
    
    app.listen(PORT , ()=>{
        console.log(`Server Started at ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
    })

}

connectorBackend();