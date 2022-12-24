const express=require('express');
const router=express.Router();
const Lobby = require("../model/lobby")
const Poll = require("../model/poll");
const Voters = require("../model/voters");
router.post("/ross",(req, res) => {
	Lobby.find({lobbyId: req.body.data })  
	  .populate("lobbyId")
	  .then((myitem) => {
		res.json({ myitem });	
	  })
	  .catch((err) => {
		//console.log(err);
	  });
  });


router.post("/bobs",(req, res) => {
	Poll.find({lobbyUniqueId: req.body.data })	  
	  .populate("lobbyUniqueId")
	  .then((myitem) => {
		res.json({ myitem });
	  })
	  .catch((err) => {
		//console.log(err);
	  });
});

router.post("/pollCount",(req,res)=>{
	let pollCt =0;
	Lobby.find({userId: req.body.user_id })  
	  .populate("lobbyId")
	  .then((myitem) => {
		console.log(myitem);
		res.json({ myitem });	
	  })
	  .catch((err) => {
		//console.log(err);
	  });
})
router.post("/mailName",async (req,res)=>{
	let mailArray = req.body.data;
	let DetsTOSend=[];
	for(var i =0;i<mailArray.length;i++){
		if(mailArray[i].optionValue!=0 && mailArray[i].optionArray.length>0){
			let userArray = [];
			for(var z=0;z<mailArray[i].optionArray.length;z++){
				await Voters.find({mail:mailArray[i].optionArray[z]}).populate("mail").then((userName)=>{
					userArray.push(userName[0].name);
				})
			}
			DetsTOSend.push({voters:userArray,value:mailArray[i].optionValue,correct:mailArray[i].optionCorrect})
		}
	}
	let Data = DetsTOSend;
	res.json({Data});
})
router.put("/close",(req, res) => {
	Lobby.updateOne( {lobbyId: req.body.stuid},{$set: {
	  close: req.body.close,
	},
	},
	{ new: true },
	(err, result) => {
	  if (err) {
		return res.status(422).json({ error: "update unsuccesful" });
	  }
	  else{
		return res.status(200).json({success:'closed'});
	  }
	}
	)
})

router.post("/check", (req, res) =>{
	Lobby.find({lobbyId: req.body.data})  
	  .populate("lobbyId")
	  .then((myitem) => {
		res.json({ myitem });
	})
	  .catch((err) => {
		//console.log(err);
	  });
});

router.post("/subjectpolladd",(req, res)=>{
	const { mail, subject, luuid } = req.body;
	//console.log("subjectadd",req.body.mail,subject,luuid)
	Voters.findOneAndUpdate({mail:mail,"Subject.SubjectValue": subject,'Subject.Marks.SubLobid':{$ne:luuid}},{$addToSet:{'Subject.$.Marks':{StuMarks:0,SubLobid:luuid}}}).then((saveditem)=>{
		if(saveditem){
			//console.log("attendence added to sub")
			return res.json({data:"attendence marked"});
		}
		else{
			Voters.findOneAndUpdate({mail:mail,"Subject.SubjectValue": {$ne:subject}},{$addToSet:{Subject:{SubjectValue:subject,Marks:[{StuMarks:0,SubLobid:luuid}]}}}).then((saveditem)=>{
				if(saveditem){
					//console.log("attendence added to sub and sub created")
					return res.json({data:"attendence marked"});
				}
			}
			)
		}
	})
})

router.put("/select",(req, res) => {

	Poll.findOneAndUpdate({_id: req.body.puid,'pollOption.optionArray': req.body.mer },{$pull:{'pollOption.$.optionArray': req.body.mer}},{projection:{pollOption:{'$elemMatch':{optionArray:req.body.mer}}}}).then((saveditem)=>{
		if(saveditem){
			//console.log("Yeo",saveditem);
			var hehe = saveditem.pollOption[0].optionCorrect;
			//console.log("deleted one entry",hehe);
			if(hehe){
				//console.log("okku",req.body);
			    Voters.findOneAndUpdate({mail:req.body.mer,'Subject.Marks.SubLobid':req.body.data},{$inc:{'Subject.$[outer].Marks.$[inner].StuMarks':-1}},{ arrayFilters: [{ "inner.SubLobid": req.body.data },{"outer.SubjectValue":req.body.subject}], new: true },).then((savedtitem)=>{

				    //console.log("finupdatereduce",savedtitem); 
			    }
				)
			 	//console.log("-1"); 
			}
		}
		
		Poll.findOneAndUpdate({_id: req.body.puid, 'pollOption._id': req.body.opuid},{$push: {'pollOption.$.optionArray': req.body.mer}},{projection:{pollOption:{'$elemMatch':{_id:req.body.opuid}}}}).then((saveditem)=>{
			if(saveditem){
				var hehe = saveditem.pollOption[0].optionCorrect;
				//console.log("selected one entry",hehe);
				if(hehe){
					Voters.findOneAndUpdate({mail:req.body.mer,'Subject.Marks.SubLobid':req.body.data},{$inc:{'Subject.$[outer].Marks.$[inner].StuMarks':+1}},{ arrayFilters: [{ "inner.SubLobid": req.body.data },{"outer.SubjectValue":req.body.subject}], new: true },).then((savedtitem)=>{
						//console.log("finupdateincrease",savedtitem); 
					}
					    )	
					//console.log("+1"); 
				}
			}
		})
		Lobby.updateOne( {lobbyId: req.body.data},{$addToSet: {studentformId: req.body.mer,},},{ new: true }).then((saveditem)=>{
		if(saveditem){
			//console.log("added the name into studentformId");
		}
	})
	})
})


module.exports = router;