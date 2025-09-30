const Mongoose = require("mongoose");
const {Schema} = Mongoose;

const schema = new Schema({
  title : {
    type: String,
    require: true
  },
  author: {
    type : String,
    require: true
  },
  imgurl: {
    type: String,
    require: true
  }
},{timestamps: true});


const user = Mongoose.model("book", schema);

module.exports ={user};