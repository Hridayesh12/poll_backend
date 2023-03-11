const express = require("express");
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require("path");
const database = require('./db/conn');
const xlsx = require('xlsx');
const port = process.env.PORT || 2000;
const dotenv = require('dotenv');
const { addUser, removeUser, getUser, getUsersInLobby, addVotes } = require('./socket/users');
const { addpoll, getVotes, removeLobby, removepoll } = require('./socket/votes');
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("./router/auth"));
app.use(require("./router/lob"));
app.use(require("./router/polls"));
app.use(require("./router/excel"));
var io = require("socket.io")(server, {
  cors: {
    methods: ["GET", "POST", "PUT"],
    credentials: true,
    origin: true,
  }
});

database.connectDb()
  .then((result) => { return server.listen(port, () => { console.log(`The server is up and running on port ${port}`) }) })
  .catch((error) => { return error });


io.on('connection', (socket) => {
  console.log("Sussy imposter is amongus")

  socket.on('polls', ({ ret, lobbyuuid }) => {

    for (var i = 0; i < ret.myitem.length; i++) {
      var question = ret.myitem[i].pollQuestion;
      for (var j = 0; j < ret.myitem[i].pollOption.length; j++) {
        var value = ret.myitem[i].pollOption[j].optionValue;
        const { error, votes } = addpoll({ Lobby: lobbyuuid, question: question, value: value });
        if (error) return callback(error);
      }
    }
    const votes = getVotes({ Lobby: lobbyuuid });
    io.to(votes.Lobby).emit('PollData', { Lobby: votes.Lobby, poll: votes.poll });
  });

  socket.on('closepoll', ({ lobbyuuid }) => {
    const votes = removeLobby({ Lobby: lobbyuuid });
  });

  socket.on('deletepoll', ({ lobbyuuid, poll, pollId }) => {
    // console.log("this is delete poll", lobbyuuid);
    // console.log("this is polll", poll);
    // console.log("this is pollid", pollId)
    const pora = removepoll({ Lobby: lobbyuuid, poll: poll, pollId: pollId })
    const votes = removeLobby({ Lobby: lobbyuuid });
    // console.log("removed", pora);
  });

  socket.on('join', ({ data, lobbyuuid }, callback) => {
    const { error, user } = addUser({ id: socket.id, name: data.name, Lobby: lobbyuuid });

    if (error) return callback(error);

    socket.join(user.Lobby);
    // console.log(getUsersInLobby(user.Lobby));
    io.to(user.Lobby).emit('LobbyData', { Lobby: user.Lobby, users: getUsersInLobby(user.Lobby) });

  });

  socket.on('sendPoll', ({ lobbyuuid, question, option, userduck }, callback) => {
    console.log("this is send poll", lobbyuuid, question, option, userduck);
    const { error, pain, votes } = addVotes({ id: socket.id, question: question, option: option, Lobby: lobbyuuid, name: userduck });

    if (error) return callback(error);
    // console.log("users, sendPoll", pain)
    // console.log("votes, sendPoll", votes)
    io.to(pain.Lobby).emit('LobbyData', { Lobby: pain.Lobby, users: getUsersInLobby(pain.Lobby) });

    io.to(votes.Lobby).emit('PollData', { Lobby: votes.Lobby, poll: votes.poll });
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.Lobby).emit('LobbyData', { Lobby: user.Lobby, users: getUsersInLobby(user.Lobby) });
    }
  })
});

