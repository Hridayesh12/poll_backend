const mongoose=require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const lobbySchema=new mongoose.Schema({
    lobbyId:{
        type:String,
    },
    lobbyName:{
        type:String,
    },
    lobbyDescription:{
        type:String,
    },
    studentformId:{
        type:Array, default:[],
    },
    pollId:{
        type:Array,
    },
    userId:{
        type: String
    },
    close:{
        type:Boolean,
        default: false
    }
})
const Lobby=mongoose.model('LOBBY',lobbySchema);
module.exports=Lobby