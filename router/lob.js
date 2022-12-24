const express=require('express');
const router=express.Router();
var MongoClient=require('mongodb').MongoClient;
const Lobby = require("../model/lobby")
const Poll = require("../model/poll");
const Users = require("../model/usr");
const database = require('../db/conn');
const db = database.db;
const object=require('mongodb').ObjectId;

router.post("/createnewlobby", async (req, res) => {
	const {lobbyId,lobbyName,lobbyDescription,studentformId,pollId,userId} = req.body;
    try {
		const lobby = new Lobby({lobbyId,lobbyName,lobbyDescription,studentformId,pollId,userId});
		lobby.save().then(() => {
				Users.updateOne( {_id: userId},{$addToSet: {Lobbys: lobbyId},},{ new: true },
				(err) => {
				  if (err) {
					return res.status(422).json({ error: "user update unsuccesful" });
				  }
				  //console.log("Added a Lobby to user");
				}
				)
				if(req.body.subject){
					Users.updateOne({_id: userId,'Subject.SubjectValue':req.body.subject},{$addToSet:{'Subject.$.SubPollid': lobbyId}},{new:true},(err) => {
						if (err) {
						  return res.status(422).json({ error: "user update unsuccesful" });
						}
						//console.log("Added a Lobby to Subject");
					  }
					  )
				}
				return res.status(200).json({ Success: "Lobby  Created" });
			}).catch((err) => {
				//console.log("Hi",err);
				return res.status(400).json({ Error: "Error creating lobby" });
			});
	}catch (error) {
		//console.log("Hello",error);
		return res.status(400).json({ Error: "Error creating lobby 1" });
	}
});
router.post("/createnewpoll", async (req, res) => {
	const {id,pollOption,pollQuestion,userId} = req.body;
	const lobbyUniqueId = id;
    try {
		const poll = new Poll({lobbyUniqueId,pollOption,pollQuestion,userId});
		var questId = poll._id;
		var questionId = questId.toString();
		MongoClient.connect(db, function (err, client) {
			var db = client.db("pollapp");
			let project = db.collection("lobbies").findOne({lobbyId:lobbyUniqueId});
			if (project === null) {
				//console.log('Not found!');
			}
			else {
				project.then(function(result) {
					let questionArray = result.pollId;
					questionArray.push(poll._id);
					var update_id = { lobbyId:lobbyUniqueId };
					var update_arr = { $set: { pollId: questionArray } };
					db.collection("lobbies").updateOne(update_id,update_arr,function (err, res) {
						if (err) throw err;
					});
				});
			}
		});
		poll.save().then(() => {
				return res.status(200).json({ Success: "Poll  Created" });
		}).catch((err) => {
			//console.log(err);
			return res.status(400).json({ Error: "Error creating lobby" });
		});
	}
	catch (error) {
		//console.log(error);
		return res.status(400).json({ Error: "Error creating lobby 1" });
	}
});

router.post("/usrlobbies", (req, res) =>{
	MongoClient.connect(db, function (err, client) {
	var db = client.db("pollapp");
    if (err) throw err;
	else if(req.body.sub!=null){
		let subject = req.body.sub;
		let lobbyArray = subject.SubPollid;
		let result = [];
		//console.log(lobbyArray);
		db.collection("lobbies").find({userId:req.body.tata,close:false}).toArray(
			(err, newRes) => {
				if (err) {throw err}
				else {
					//console.log(newRes.length);
					//console.log(typeof(newRes));
					for(let i=0;i<newRes.length;i++){
					
						if(lobbyArray.includes(newRes[i].lobbyId)){
							//console.log("Hello",newRes[i].lobbyId);
							//console.log(newRes[i]);
							result.push(newRes[i]);
						}
					}
					res.send(result);
				}
			});
	}
	else{
		//console.log("Miracle");
		db.collection("lobbies").find({userId: req.body.tata,close:false}).toArray((err, result) => {
			if (err) throw err;
			res.send(result);
		});
	}
	});
});


router.post("/clsrlobbies", (req, res) =>{
	MongoClient.connect(db, function (err, client) {
		var db = client.db("pollapp");
		if (err) throw err;
		else if(req.body.sub!=null){
			let subject = req.body.sub;
			let lobbyArray = subject.SubPollid;
			let result = [];
			//console.log(lobbyArray);
			db.collection("lobbies").find({userId:req.body.tata,close:true}).toArray(
				(err, newRes) => {
					if (err) {throw err}
					else {
						//console.log(newRes.length);
						//console.log(typeof(newRes));
						for(let i=0;i<newRes.length;i++){
						
							if(lobbyArray.includes(newRes[i].lobbyId)){
								//console.log("Hello",newRes[i].lobbyId);
								//console.log(newRes[i]);
								result.push(newRes[i]);
							}
						}
						res.send(result);
					}
				});
		}
		else{
			//console.log("Miracle");
			db.collection("lobbies").find({userId: req.body.tata,close:true}).toArray((err, result) => {
				if (err) throw err;
				res.send(result);
			});
		}
		});
});

router.post("/usrpolls", (req, res) =>{
	MongoClient.connect(db, function (err, client) {
		var db = client.db("pollapp");
		if (err) throw err;
		
		else{
				db.collection("polls").find({userId: req.body.tata}).toArray((err, newRes) => {
					if (err) throw err;
					res.send(newRes);
				});
		}
		});
});








router.post("/delete",(req, res) => {
	//console.log(req.body.deletelobid);
	Poll.deleteMany({lobbyUniqueId: req.body.deletelobid }).populate("lobbyUniqueId").then((myitem) => {
		//console.log(myitem);
	})
	Lobby.deleteOne({lobbyId:req.body.deletelobid}).populate("lobbyId").then((myitem) => {
		//console.log(myitem);
		return res.status(200).json({ Success: "Lobby Deleted" });
	})
	//add a method to delete from SubPollId
});

router.post("/deletePoll",(req, res) => {
    // {_id: req.body.puid,'pollOption.optionArray': req.body.usern },{$pull:{'pollOption.$.optionArray': req.body.usern}}
    // //console.log(req.body.pollId);
    // let _id = req.body.lobbyId;
    // let uuidd = object(req.body.pollId);
    // //console.log(uuidd);
  Poll.deleteOne({_id: req.body.pollId }).populate("_id").then((myitem) => {
    //console.log(myitem);
    Lobby.findOneAndUpdate({_id:req.body.lobbyId},{$pull:{pollId:object(req.body.pollId)}}).then((katrina)=>{
        //console.log(katrina);
		return res.status(200).json({ Success: "Lobby Deleted" });
    });  
  })
});

router.post("/createNewSubject",(req, res) => {
	const {subjectName,emailArray,mailid} = req.body;
	//console.log(subjectName);
	//console.log(emailArray);
	//console.log(mailid);
	const subs = {SubjectValue:subjectName,StuMail:emailArray,SubPollid:[]}
	Users.updateOne( {mail: req.body.mailid},{$push: {'Subject': subs},},{ new: true },
		(err, result) => {
		  if (err) {
			return res.status(400).json({ Success: "Subject Failed" });
		  }
		  else{
			return res.status(200).json({ Success: "Subject Success" });
		  }
		}
	)
})

module.exports = router;