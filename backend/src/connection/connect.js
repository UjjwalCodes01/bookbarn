const mongoose = require('mongoose');
function connection(url) {
    mongoose.connect(url).then(
        ()=>{console.log("mongoose connected")
        }
    ).catch((err)=>{ console.log("mongoose error",err)})}
    
    module.exports = {connection}