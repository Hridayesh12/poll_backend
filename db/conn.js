const mongoose =require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const db=process.env.CONN_STRING;
mongoose.connect(db).then(()=> {
    console.log('Connected to mongo!!!!!!!')
}).catch((err)=> 
    console.log(err));
module.exports={db};