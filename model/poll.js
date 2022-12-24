const mongoose=require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const pollSchema=new mongoose.Schema({
    lobbyUniqueId:{
        type:String,
    },
    pollQuestion:{
        type:String,
    },
    pollOption:{
        type:[{optionValue:{type:String},optionArray: {type:Array, default:[]},optionCorrect:{type:Boolean, default: false}}],
    },
    userId:{
        type: String
    },
})
const Poll=mongoose.model('POLL',pollSchema);
module.exports=Poll