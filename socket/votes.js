const votes = [{Lobby:String,poll:{question:String ,option:{value:String,votes:Number,user:Array}}}];

const addpoll = ({ Lobby, question, value}) => {
    question = question.trim().toLowerCase();
    Lobby = Lobby.trim().toLowerCase();
    value = value.trim().toLowerCase();
    const option = {value:value,votes:0,user:[]}
    const Lindex = votes.findIndex((votes) => votes.Lobby === Lobby )
      if(Lindex !== -1){
        const Qindex = votes[Lindex].poll.findIndex((poll)=>poll.question==question)
        if(Qindex !== -1){
          const Opindex = votes[Lindex].poll[Qindex].option.findIndex((option)=>option.value==value)
          if(Opindex !== -1){
            if(votes[Lindex].poll[Qindex].option.length<5){
              votes[Lindex].poll[Qindex].option.push(option)
              return {votes};
            }
            console.log("all is well");
            return {votes};
          }
          else{
            votes[Lindex].poll[Qindex].option.push(option)
            return {votes}
          }
        }
        else{
          const Quest = { question:question , option:[option]};
          votes[Lindex].poll.push(Quest);
          return {votes}
        }
      }
      else{
        console.log("pushed a lobby")
        votes.pop;
        const Vter = { Lobby:Lobby ,poll:[{question:question , option:[option]  }] };
        votes.push(Vter);
        return { Vter };
      }
  }  

const increment = ({Lobby, question, value, name})=>{
    question = question.trim().toLowerCase();
    Lobby = Lobby.trim().toLowerCase();
    value = value.trim().toLowerCase();
    const Lindex = votes.findIndex((votes) => votes.Lobby === Lobby )
      if(Lindex !== -1){
        const Qindex = votes[Lindex].poll.findIndex((poll)=>poll.question==question)
        if(Qindex !== -1){
          for(i=0;i<5;i++){
            const unindex = votes[Lindex].poll[Qindex].option[i].user.findIndex((user)=>user===name)
            if(unindex !== -1){
              console.log("opp",i);
              console.log("uni",unindex);
              console.log(votes[Lindex].poll[Qindex].option[i].user[unindex]);
              votes[Lindex].poll[Qindex].option[i].user.splice(unindex, 1)[0];
              votes[Lindex].poll[Qindex].option[i].votes--;
              break;
            }  
          }
          const Opindex = votes[Lindex].poll[Qindex].option.findIndex((option)=>option.value==value)
          if(Opindex !== -1){
            votes[Lindex].poll[Qindex].option[Opindex].votes++;
            votes[Lindex].poll[Qindex].option[Opindex].user.push(name);
            console.log(votes[Lindex].poll[Qindex].option)
            return (votes[Lindex])
          }
        }
      }
}

// const decrement = ({Lobby, question, value})=>{
//     question = question.trim().toLowerCase();
//     Lobby = Lobby.trim().toLowerCase();
//     value = value.trim().toLowerCase();
//     const Lindex = votes.findIndex((votes) => votes.Lobby === Lobby )
//       if(Lindex !== -1){
//         const Qindex = votes[Lindex].poll.findIndex((poll)=>poll.question==question)
//         if(Qindex !== -1){
//           const Opindex = votes[Lindex].poll[Qindex].option.findIndex((option)=>option.value==value)
//           if(Opindex !== -1){
//             votes[Lindex].poll[Qindex].option[Opindex].votes--;
//             return {votes}
//           }
//         }
//       }
// }

const getVotes = ({Lobby}) => {vtr=votes.find((votes) => votes.Lobby === Lobby.trim().toLowerCase());

  console.log(Lobby);
  return (vtr)
}

const removeLobby = ({Lobby})=>{
  const index = votes.findIndex((votes) => votes.Lobby === Lobby);

  if(index !== -1) return votes.splice(index, 1)[0];
  console.log("removed a lobby")
}

const removepoll = ({Lobby,poll,pollId})=>{

  for(w=0;w<poll.length;w++){
    if(poll[w]._id==pollId){
      const index = votes.findIndex((votes) => votes.Lobby === Lobby)
      if(index !== -1){
      console.log("removepoll",votes[index].poll,"wuestion",poll[w].pollQuestion)
      const questi = poll[w].pollQuestion;
      console.log(questi)
      const pinred = votes[index].poll.findIndex((poll)=>poll.question==questi)
      console.log("outside",pinred)
      if(pinred !== -1){
      console.log("this is what to pop",votes[index].poll[pinred])
      console.log("inside",pinred)
      votes[index].poll.splice(pinred, 1);
      return votes[index];
      } 
    }
    }
  }
}


  module.exports = { addpoll, increment, getVotes, removeLobby, removepoll};