const express = require('express');
const router=express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;
const authenticate = require('../middleware/authenticate')
const sauthenticate = require('../middleware/sauthenticate')
const Excel=require('exceljs')
const Users = require("../model/usr");
const Voters = require("../model/voters")
var fs=require("fs");

router.get("/logout", (req, res) => {
	res.clearCookie("jwtoken", { path: "/"});
	return res.status(200).json({Success:"LOGGED OUT" });
})

router.get('/userdata',authenticate,(req,res)=>
{
	res.send(req.rootUser)
})

router.post('/userdata',(req,res)=>
{
	res.send(req.rootUser)
})

router.get('/suserdata',sauthenticate,(req,res)=>
{
	res.send(req.rootUser)
})



router.post('/suserdata',(req,res)=>
{
	res.send(req.rootUser)
})

router.post("/u", async (req, res) => {
	const {
		mail,
        name,
        givenName,
	} = req.body;
		// console.log("Oops",mail,givenName,name);
		const savedUser=await Users.findOne({
			mail:mail,name:name
		});
		// console.log(savedUser);
				if(!savedUser)
				{
					const users = new Users({
						mail,name,givenName
					});
						users
				.save()
				.then(() => {

					return res.status(200).json({ Success: "User  Created" });
				})
				.catch((err) => {
					// console.log("IOE",err);
					return res.status(400).json({ Error: "Error creating user" });				
			});

				}
				else
				{
					return res.status(422).json({Error: "User already exists" });
				}
});		

router.post("/su", async (req, res) => {
	const {
		mail,
        name,
        givenName,
	} = req.body;
	const Subject = [{SubjectValue:'general'}]
		const savedUser=await Voters.findOne({
			mail:mail,name:name
		});
				if(!savedUser)
				{
					const voters = new Voters({
						mail,name,givenName,Subject
					});
						voters
				.save()
				.then(() => {
					return res.status(200).json({ Success: "User  Created" });
				})
				.catch((err) => {
					// console.log(err);
					return res.status(400).json({ Error: "Error creating user" });				
				});
				}
				else
				{
					return res.status(422).json({Error: "User already exists" });
				}

});

router.post('/slogin',(req,res)=>
{
	const { mail, name, subject, luuid } = req.body;
  if (subject != 'general') {
    Voters.findOne({ mail: mail, name: name }).then((savedUser) => {
        if (!savedUser) {
          return res.status(422).json({ error: "Invalid email or password" });
        }
        //compare with Users schema in
        Users.findOne({Lobbys:luuid, "Subject.SubjectValue": subject},{Subject:{'$elemMatch':{StuMail:mail,SubjectValue:subject}}}).then((savedPuser) => {
			// console.log("auth",savedPuser,"subject",subject);
			if (savedPuser.Subject.length!=0) {
                    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                    res.cookie("sjwtoken", token, {
                        expires: new Date(Date.now() + 86400000),
                        httpOnly: true,
                    });
					//add a way to update voters with subject and poll
					//
                    return res.status(200).json({ message: "login successfull" });
                } else {
                    return  res.status(450).json({error:"You cannot vote for this poll"})
                }
			})
		})
		.catch((err) => {
		  // console.log(err);
		});
	}
	else{
	Voters.findOne({mail:mail,name:name}).then(savedUser=>
		{
			if(!savedUser)
			{
				return res.status(422).json({error:"Invalid email or password"})
			}
			if(savedUser.name==name)
				{
					const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
					res.cookie("sjwtoken",token,{
						expires: new Date(Date.now()+86400000),
						httpOnly:true,
					});
					return res.status(200).json({message:"login successfull"})
				}
				else
				{
					return res.status(422).json({error:"User not found"})
				}
			}).catch(err=>{
				// console.log(err);
			})
	}		
})

router.post('/login',(req,res)=>
{
	const {mail,name}=req.body;
	if (!mail || !name) {
		return res.status(
		{error:"pls fill all the fields"}
		)}
	Users.findOne({mail:mail,name:name}).then(savedUser=>
		{
			if(!savedUser)
			{
				return res.status(422).json({error:"Invalid email or password"})
			}
			if(savedUser.name==name)
				{
					const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
					res.cookie("jwtoken",token,{
						expires: new Date(Date.now()+86400000),
						httpOnly:true,
					});
					return res.status(200).json({message:"login successfull"})
				}
				else
				{
					return res.status(422).json({error:"User not found"})
				}
			}).catch(err=>{
				// console.log(err);
			})
})



// router.post('/excel',  async (req,res)=>{
// 		const {giorno,dio}=  req.body;
// 		let l=giorno.length;
// 		var diego=dio.studentformId.length;
// 		let workbook=new Excel.Workbook();
// 			for (j=0;j<l;j++){
// 				var gio=giorno[j];
// 				var ger=gio.pollOption.length;
// 				var question=gio.pollQuestion;
// 				for(d=0;d<j;d++){
// 					if(question==giorno[d].pollQuestion){
// 						question= j+question;
// 					}
// 				}
// 				var noitseuq="";
// 				for(a=0;a<question.length;a++){
// 					if(question[a]=='?'||question[a]=='*'||question[a]=='/'||question[a]=='\\' ||question[a]==','||question[a]=='['||question[a]==']'||question[a]==':'){
// 						continue;
// 					}
// 					else{
// 						noitseuq=noitseuq+question[a];
// 						// console.log(noitseuq);
// 					}
// 				}
// 				let worksheet=workbook.addWorksheet(`${noitseuq}`);
// 				for(x=0;x<ger;x++)
// 				{
// 					var pu=gio.pollOption[x].optionArray.length;
// 					var doppio=gio.pollOption[x].optionArray
// 					var option=gio.pollOption[x].optionValue;
// 					if (option == '')
// 					{					
// 						continue;
// 					}
// 					var roption=gio.pollOption[x].optionCorrect
// 					if(roption == true)
// 					{
// 						var choice="Right";
// 					}
// 					else
// 					{
// 						var choice="Wrong";
// 					}
// 					for (y=0;y<pu;y++)
// 					{
// 						var found=doppio[y];
// 						for (s=0;s<diego;s++)
// 						{
// 							var student = dio.studentformId[s];
// 							if (found==student)
// 							{
// 								worksheet.columns=[
// 										{header:'Name',key:'name',width:20},
// 								 	{header:'StudentAns',key:'studentans',width:20},
// 								    {header:'COption',key:'rightop',width:20},
								
// 								    ];
// 								 	worksheet.addRow({name:found,studentans:option,rightop:choice});
// 								 	worksheet.getRow(1).eachCell((cell)=>{
// 											cell.font={bold:true};
// 								 	 	});
// 								 	 workbook.xlsx.writeFile(`excellent.xlsx`)
// 								 	 // console.log('done')
// 							}
// 						}
// 					}
// 			}
// 		}
// 		var participants = dio.studentformId
// 		let worksheet=workbook.addWorksheet(`Participants`);
// 		for(var w=0;w<diego;w++){
// 			worksheet.columns=[
// 				{header:'Name',key:'name',width:20},
// 			];
// 			 worksheet.addRow({name:participants[w]});
// 			 worksheet.getRow(1).eachCell((cell)=>{
// 					cell.font={bold:true};
// 				  });
// 			  workbook.xlsx.writeFile(`excellent.xlsx`)
// 			  // console.log('participants added')
// 		}
// 		setTimeout(()=>{	     
// 		fs.unlinkSync(`excellent.xlsx`, function (err) {
// 			if (err)
// 				throw err;
// 			// console.log("deleted lol file")		
// 		});
// 	},1000);			
// 		return res.status(200).json({Success:'file created succesfully'});
// 	}
// );

// router.get('/download/:stuid/:name',function(req,res)
// {   // console.log(req.params.stuid)
// 	// console.log(req.params.name)
// 	var name=req.params.name.substr(0,12)
// 	var lname = req.params.stuid;
// 	//var temporal=lname.substr(36);
// 	var date=lname.substr(0,lname.indexOf('t'))
// 	const subexist=lname.includes('s')
//     let subject = '';
//     if(subexist){
//         subject = lname.slice(19);
//         // console.log(subject);
//     }
// 	// console.log(date)
// 	// console.log(name)
// 	var f=name+date+subject
// 	var fileName=`excellent.xlsx`;
// 	res.download(fileName,`${f}.xlsx`,(err)=>{
// 		if(err)
// 		{
// 			// console.log(err);
// 		}
// 	});
// 	// console.log("your file has been downloaded");
// })


module.exports = router;