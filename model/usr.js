const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    mail:
    {
        type: String,
        required:true

    },
    name:{
        type:String,
        required:true

    },
    givenName:{
        type:String,
        required:true

    },
    Lobbys:{
        type:Array,
    },
    Subject:{
        type:[{SubjectValue:{type:String},StuMail: {type:Array, default:[]},SubPollid: {type:Array, default:[]}}],
    }
})


const Users=mongoose.model('USERS',userSchema);

module.exports=Users