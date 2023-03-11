const { increment } = require('./votes');


const users = [{ id: String, name: String, Lobby: String, poll: { question: String, option: String } }];

const addUser = ({ id, name, Lobby }) => {
  console.log(id, name, Lobby);
  name = name.trim().toLowerCase();
  Lobby = Lobby.trim().toLowerCase();
  const existingUser = users.find((user) => user.name === name && user.Lobby === Lobby);

  if (existingUser) return { error: 'Please reload the page' };
  const user = { id, name, Lobby, poll: [] };
  users.push(user);
  console.log(users);
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInLobby = (Lobby) => users.filter((user) => user.Lobby === Lobby && user.name !== "teacher");

const addVotes = ({ id, question, option, Lobby, name }) => {
  console.log("Suck", name);
  const poll = { question, option }
  console.log("F", id);
  const index = users.findIndex((user) => user.id === id);
  console.log(users);
  console.log("Ok", index);
  const pain = users[index];
  console.log("Luck", users);
  console.log("Shit", pain);
  const inrex = users[index].poll.findIndex((poll) => poll.question === question);
  if (inrex !== -1) {
    value = users[index].poll[inrex].option
    users[index].poll[inrex].option = option;
    //decrement({Lobby:Lobby,question:question, value:value})
    votes = increment({ Lobby: Lobby, question: question, value: option, name: name })
    return { pain, votes }
  }
  else {
    users[index].poll.push(poll);
    votes = increment({ Lobby: Lobby, question: question, value: option, name: name })//if user chose this option, reload and increment function, then no increment and return
    return { pain, votes }
  }
}


module.exports = { addUser, removeUser, getUser, getUsersInLobby, addVotes };