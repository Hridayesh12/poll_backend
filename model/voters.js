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
    lobbyUId:{
        type:String,
    },
    Subject:{
        type:[{SubjectValue:{type:String},Marks:{type:[{StuMarks: {type:Number,default:0},SubLobid: {type:String}}]}}],
    }

})


const Voters=mongoose.model('VOTERS',userSchema);

module.exports=Voters