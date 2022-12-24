const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
const { addUser, removeUser, getUser, getUsersInLobby, addVotes } = require('./socket/users');
const { addpoll, getVotes, removeLobby, removepoll} = require('./socket/votes');
const port = process.env.PORT || 2000;
const dotenv = require('dotenv');
const xlsx=require('xlsx');
const mongoose = require("mongoose");
var MongoClient=require('mongodb').MongoClient;
const database=require('./db/conn');
require('./model/usr');
require('./model/voters');
app.use(cookieParser());
app.use(express.json())
app.use(require("./router/auth"));
app.use(require("./router/lob"));
app.use(require("./router/polls"));
app.use(require("./router/excel"));
const path = require("path");
const db = database.db;
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["https://pollapp-frontend.onrender.com"],
	  methods: ["GET", "POST","PUT","DELETE"],
	  credentials: true
  })
);
var io = require("socket.io")(server, {
	cors: {
	  origin: process.env.CORS_ORIGIN,
	  methods: ["GET", "POST","PUT"],
	  credentials: true
	}
  });


let uuid ="";
app.get("/lobbycreated", (req, res) => {
	res.send("CREATE EVENT");
});
app.get("/pollcreated", (req, res) => {
	res.send("done");
});

app.get("/event", (req, res) => {
	res.send("EVENTS:");
});
app.get("/",(req,res)=>{
	res.send("Chill");
})

// app.listen(process.env.PORT || 2000, () => {
// 	// console.log("server is running");
// });


server.listen(port, () =>  console.log(`Server has started.`));

io.on('connection',(socket)=>{
	// console.log("Sussy imposter is amongus")
    
    socket.on('polls',({ret,lobbyuuid})=>{

		for(var i=0;i <ret.myitem.length;i++){
		    var question =ret.myitem[i].pollQuestion;
			for(var j=0;j<ret.myitem[i].pollOption.length;j++){
				var value =ret.myitem[i].pollOption[j].optionValue;
                const { error, votes } = addpoll({ Lobby: lobbyuuid, question: question , value: value});
		        if(error) return callback(error);
			}
		}
		const votes = getVotes({Lobby:lobbyuuid});
		// console.log(votes.poll[0].option)
		io.to(votes.Lobby).emit('PollData', { Lobby: votes.Lobby, poll: votes.poll });
	});

	socket.on('closepoll',({lobbyuuid})=>{
		// console.log("this is close poll",lobbyuuid);
		const votes = removeLobby({Lobby:lobbyuuid});
		// console.log("removed",votes);
	});

	socket.on('deletepoll',({lobbyuuid,poll,pollId})=>{
		// console.log("this is delete poll",lobbyuuid);
		// console.log("this is polll",poll);
		// console.log("this is pollid",pollId)
		const pora = removepoll({Lobby:lobbyuuid,poll:poll,pollId:pollId})
		//const votes = removeLobby({Lobby:lobbyuuid});
		// console.log("removed",pora);
	});

	socket.on('join',({data,lobbyuuid},callback)=>{
		const { error, user } = addUser({ id: socket.id,name: data.name ,Lobby: lobbyuuid });

    	if(error) return callback(error);

    	socket.join(user.Lobby);
		// console.log(getUsersInLobby(user.Lobby));
		io.to(user.Lobby).emit('LobbyData', { Lobby: user.Lobby, users: getUsersInLobby(user.Lobby) });

	});

	socket.on('sendPoll',({lobbyuuid,question,option,usern},callback)=>{
		const { error, pain, votes } = addVotes({ id: socket.id,question: question ,option: option, Lobby: lobbyuuid, name: usern});

    	if(error) return callback(error);
		// console.log("users, sendPoll",pain)
		// console.log("votes, sendPoll",votes)
		io.to(pain.Lobby).emit('LobbyData', { Lobby: pain.Lobby, users: getUsersInLobby(pain.Lobby)});
		
		io.to(votes.Lobby).emit('PollData', { Lobby: votes.Lobby, poll: votes.poll });
	});

	socket.on('disconnect',()=>{
		const user = removeUser(socket.id);
		// console.log('Sussy is no more');
		if(user) {
			io.to(user.Lobby).emit('LobbyData', { Lobby: user.Lobby, users: getUsersInLobby(user.Lobby)});
		  }
	})
});

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});
