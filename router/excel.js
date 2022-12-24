const express=require('express');
const router=express.Router();
var object = require("mongodb").ObjectId;
var MongoClient=require('mongodb').MongoClient;
const Lobby = require("../model/lobby")
const Poll = require("../model/poll");
const Users = require("../model/usr");
const Voters = require("../model/voters")
const database = require('../db/conn');
const db = database.db;
const Excel=require('exceljs');
const fs = require('fs');
const AdmZip = require('adm-zip');

router.post('/excel', async(req,res)=>{
    const {giorno,dio}=  req.body;
    var r=false;
    var uuid = dio.lobbyId;
    excelmaker(giorno,dio,uuid,r)
    setTimeout(()=>{
        return res.status(200).json({Success:'file created succesfully'});
    },2000)
})

// router.post('/excel',  async (req,res)=>{
//     const {giorno,dio}=  req.body;
//     let l=giorno.length;
//     var diego=dio.studentformId.length;
//     let workbook=new Excel.Workbook();
//         for (j=0;j<l;j++){
//             var gio=giorno[j];
//             var ger=gio.pollOption.length;
//             var question=gio.pollQuestion;
//             for(d=0;d<j;d++){
//                 if(question==giorno[d].pollQuestion){
//                     question= j+question;
//                 }
//             }
//             var noitseuq="";
//             for(a=0;a<question.length;a++){
//                 if(question[a]=='?'||question[a]=='*'||question[a]=='/'||question[a]=='\\' ||question[a]==','||question[a]=='['||question[a]==']'||question[a]==':'){
//                     continue;
//                 }
//                 else{
//                     noitseuq=noitseuq+question[a];
//                     console.log(noitseuq);
//                 }
//             }
//             let worksheet=workbook.addWorksheet(`${noitseuq}`);
//             for(x=0;x<ger;x++)
//             {
//                 var pu=gio.pollOption[x].optionArray.length;
//                 var doppio=gio.pollOption[x].optionArray
//                 var option=gio.pollOption[x].optionValue;
//                 if (option == '')
//                 {					
//                     continue;
//                 }
//                 var roption=gio.pollOption[x].optionCorrect
//                 if(roption == true)
//                 {
//                     var choice="Right";
//                 }
//                 else
//                 {
//                     var choice="Wrong";
//                 }
//                 for (y=0;y<pu;y++)
//                 {
//                     var found=doppio[y];
//                     for (s=0;s<diego;s++)
//                     {
//                         var student = dio.studentformId[s];
//                         if (found==student)
//                         {
//                             worksheet.columns=[
//                                     {header:'Name',key:'name',width:20},
//                                  {header:'StudentAns',key:'studentans',width:20},
//                                 {header:'COption',key:'rightop',width:20},
                            
//                                 ];
//                                  worksheet.addRow({name:found,studentans:option,rightop:choice});
//                                  worksheet.getRow(1).eachCell((cell)=>{
//                                         cell.font={bold:true};
//                                       });
//                                   workbook.xlsx.writeFile(`excellent.xlsx`)
//                                   console.log('done')
//                         }
//                     }
//                 }
//             }
//         }
//         var participants = dio.studentformId
//         let worksheet=workbook.addWorksheet(`Participants`);
//         for(var w=0;w<diego;w++){
//             worksheet.columns=[
//                 {header:'Name',key:'name',width:20},
//             ];
//             worksheet.addRow({name:participants[w]});
//             worksheet.getRow(1).eachCell((cell)=>{
//                 cell.font={bold:true};
//             });
//             workbook.xlsx.writeFile(`excellent.xlsx`)
//             console.log('participants added')
//         }
//     setTimeout(()=>{	     
//     fs.unlinkSync(`excellent.xlsx`, function (err) {
//         if (err)
//             throw err;
//         console.log("deleted lol file")		
//     });},1000);			
//     return res.status(200).json({Success:'file created succesfully'});
// });

router.get('/download/:stuid/:name',function(req,res){
    console.log(req.params.stuid)
	console.log(req.params.name)
	var name=req.params.name.substr(0,12)
	var lname = req.params.stuid;
	var date=lname.substr(0,lname.indexOf('t'))
	const subexist=lname.includes('s')
    let subject = '';
    if(subexist){
        subject = lname.slice(lname.indexOf('s')+1);
        console.log(subject);
    }
	console.log(date)
	console.log(name)
	var f=name+date+subject
    var uploadDir = fs.readdirSync('./excel');

    if (fs.existsSync(`./excel/${uploadDir}`)){	     
        res.download(`./excel/${uploadDir}`,`${f}.xlsx`,(err)=>{
            if(err)
            {
                console.log(err);
            }
        });
    }
	
	console.log("your file has been downloaded");
})

// router.post('/downloadExcel',async (req,res)=>{
// 	let arr = req.body.finalizedArray;
// 	const zip = new AdmZip();
// 	for(let g=0;g<arr.length;g++){
// 	  Lobby.find({lobbyId: arr[g] })  
// 	  .populate("lobbyId")
// 	  .then((myitem) => {
// 	  const dio=myitem[0];
// 		Poll.find({lobbyUniqueId: arr[g] })	  
// 	  	.populate("lobbyUniqueId")
// 	  	.then((myitem) => {
// 		const giorno=myitem;
// 		let l=giorno.length;
// 		var lname = arr[g];
// 		var date=lname.substr(0,lname.indexOf('t'));
// 		const subexist=lname.includes('s')
// 		let subject = '';
// 		if(subexist){
// 			subject = lname.slice(19);
// 			console.log(subject);
// 		}
// 		var f=dio.lobbyName+date+subject
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
// 						console.log(noitseuq);
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
									
// 								 	workbook.xlsx.writeFile(`./excel/${f}.xlsx`)
// 								 	console.log('done')
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
// 			  workbook.xlsx.writeFile(`./excel/${f}.xlsx`)
// 			  console.log('participants added')
// 		}
// 		if (g==arr.length-1){
//             const downloadName = `${subject}-lobbies-${arr.length}.zip`;
// 			setTimeout(()=>{
// 				var uploadDir = fs.readdirSync('./excel');
// 			console.log(uploadDir) 
// 			console.log("ungabunga",g,"aararar",arr.length)
// 				for(var v = 0; v < arr.length;v++){
// 					zip.addLocalFile(`./excel/`+uploadDir[v]);
// 				}
// 			const data = zip.toBuffer();
// 			zip.writeZip("./"+downloadName);
// 			},300);
//             setTimeout(()=>{	     
//                 fs.unlinkSync("./"+downloadName, function (err) {
//                     if (err)
//                         throw err;
//                     console.log("deleted lol zipfile")		
//                 });
//                 },2000)
// 			}
// 		setTimeout(()=>{	     
// 		fs.unlinkSync(`./excel/${f}.xlsx`, function (err) {
// 			if (err)
// 				throw err;
// 			console.log("deleted lol file")		
// 		});
// 		},500);
// 		})	
// 	  })
// 	}
// 	return res.status(200).json({Success:'file created succesfully'});
// })

router.get('/downloadzip/:length/:subject',function(req,res){
    console.log(req.params.length)
	console.log(req.params.subject)
    const downloadName = `${req.params.subject}-lobbies-${req.params.length}.zip`;

    if (fs.existsSync(`${downloadName}`)){	     
        res.download(downloadName,`${downloadName}`,(err)=>{
            if(err)
            {
                console.log(err);
            }
        });
    }
	// res.download(downloadName,`${downloadName}`,(err)=>{
	// 	if(err)
	// 	{
	// 		console.log(err);
	// 	}
	// });
	console.log("your file has been downloaded");
})

router.post('/downloadExcel',async (req,res)=>{
	let arr = req.body.finalizedArray;
    let studata = req.body.studata;
    var r=false;
	for(let g=0;g<arr.length;g++){
        if(g==arr.length-1){r=true}
	    Lobby.find({lobbyId: arr[g] }).populate("lobbyId").then((myitem) => {
	        const dio=myitem[0];
		    Poll.find({lobbyUniqueId: arr[g] }).populate("lobbyUniqueId").then((myitem) => {
                excelmaker(myitem,dio,arr[g],r,arr.length,studata)
            })
        })
    }
    kotafactory(studata.saveditem,arr);
    setTimeout(()=>{
        return res.status(200).json({Success:'file created succesfully'});
    },4000)
})

router.post('/getMarks',async (req,res)=>{
    console.log ("it works");
    Voters.find({'Subject.SubjectValue':req.body.subject},{Subject:{$elemMatch:{SubjectValue:req.body.subject}},mail:1,name:1}).then((saveditem)=>{
        if(saveditem){
            console.log("aa",saveditem)
            return res.status(200).json({saveditem});
        }
        else{
            console.log('no');
        }
    })
})

const kotafactory=(students,questions)=>{
    console.log("students",students);
    console.log("questions",questions);
    let workbook=new Excel.Workbook();
    let subject = questions[0].slice(questions[0].indexOf('s')+1);
    console.log("subject",subject)
    let worksheet=workbook.addWorksheet(subject);
    for(a=0;a<students.length;a++){
        let name= students[a].name;
        let lobs=students[a].Subject[0].Marks
        console.log("inside",lobs)
        let count = 0;
        for(c=0;c<questions.length;c++){
            let date= questions[c].substr(0,questions[c].indexOf('t'));
            console.log(date);
            for(b=0;b<lobs.length;b++){
                if(questions[c]==lobs[b].SubLobid){
                    console.log("insiderer",lobs[b]);
                    worksheet.columns=[
                        {header:'Name',key:'name',width:20},
                    ];
                    const quest = worksheet.getColumn(c+2)
                    quest.header = `${date}`
                    quest.width = 15;
                    var row = worksheet.getRow(a+2);
                    row.getCell(c+2).value=lobs[b].StuMarks;
                    row.getCell('name').value = name;
                    row.commit();
                    worksheet.getRow(1).eachCell((cell)=>{
                        cell.font={bold:true};
                    });
                    workbook.xlsx.writeFile(`./excel/workerbee.xlsx`)
                    console.log(' if done ');
                    count = count+lobs[b].StuMarks;
                    break;
                }
                else{
                    worksheet.columns=[
                        {header:'Name',key:'name',width:20},
                    ];
                    const quest = worksheet.getColumn(c+2)
                    quest.header = `${date}`
                    quest.width = 15;
                    var row = worksheet.getRow(a+2);
                    row.getCell(c+2).value='Absent';
                    row.commit();
                    worksheet.getRow(1).eachCell((cell)=>{
                        cell.font={bold:true};
                    });
                    workbook.xlsx.writeFile(`./excel/workerbee.xlsx`)
                    console.log(' else done ')
                }
            }
            if(c==questions.length-1){
                worksheet.columns=[
                    {header:'Name',key:'name',width:20},
                ];
                const quest = worksheet.getColumn(c+3)
                quest.header = `Total Marks`
                quest.width = 15;
                var row = worksheet.getRow(a+2);
                row.getCell(c+3).value=count;
                row.getCell('name').value = name;
                row.commit();
                // worksheet.addRow({name:name,:lobs[b].StuMarks});
                worksheet.getRow(1).eachCell((cell)=>{
                    cell.font={bold:true};
                });
                workbook.xlsx.writeFile(`./excel/workerbee.xlsx`)
                console.log(' if done 44');
                break;
            }
        }
    }
    setTimeout(()=>{
        if (fs.existsSync(`./excel/workerbee.xlsx`)){	     
            fs.unlinkSync(`./excel/workerbee.xlsx`, function (err) {
                if (err)
                    throw err;
                console.log("deleted lol file")
            });
        }
    },7000);
}

const excelmaker=(giorno,dio,uuid,r,leng) =>{
    let l=giorno.length;
    var lname = uuid;
		var date=lname.substr(0,lname.indexOf('t'));
		const subexist=lname.includes('s')
		let subject = '';
		if(subexist){
			subject = lname.slice(lname.indexOf('s')+1);
			console.log("subjugation ",subject);
		}
		var f=dio.lobbyName.substr(0,12)+date+subject
        var diego=dio.studentformId.length;
        let workbook=new Excel.Workbook();
        for (j=0;j<l;j++){
            var gio=giorno[j];
            var ger=gio.pollOption.length;
            var question=gio.pollQuestion;
            for(d=0;d<j;d++){
                if(question==giorno[d].pollQuestion){
                    question= j+question;
                }
            }
            var noitseuq="";
            for(a=0;a<question.length;a++){
                if(question[a]=='?'||question[a]=='*'||question[a]=='/'||question[a]=='\\' ||question[a]==','||question[a]=='['||question[a]==']'||question[a]==':'){
                    continue;
                }
                else{
                    noitseuq=noitseuq+question[a];
                    console.log(noitseuq);
                }
            }
            let worksheet=workbook.addWorksheet(`${noitseuq}`);
            for(x=0;x<ger;x++)
            {
                var pu=gio.pollOption[x].optionArray.length;
                var doppio=gio.pollOption[x].optionArray
                var option=gio.pollOption[x].optionValue;
                if (option == '')
                {					
                    continue;
                }
                var roption=gio.pollOption[x].optionCorrect
                if(roption == true)
                {
                    var choice="Right";
                }
                else
                {
                    var choice="Wrong";
                }
                for (y=0;y<pu;y++)
                {
                    var found=doppio[y];
                    for (s=0;s<diego;s++)
                    {
                        var student = dio.studentformId[s];
                        if (found==student)
                        {
                            worksheet.columns=[
                                    {header:'Name',key:'name',width:20},
                                 {header:'StudentAns',key:'studentans',width:20},
                                {header:'COption',key:'rightop',width:20},
                            
                                ];
                                 worksheet.addRow({name:found,studentans:option,rightop:choice});
                                 worksheet.getRow(1).eachCell((cell)=>{
                                        cell.font={bold:true};
                                      });
                                 workbook.xlsx.writeFile(`./excel/${f}.xlsx`)
                                 console.log('done')
                        }
                    }
                }
            }
        }
        var participants = dio.studentformId
        let worksheet=workbook.addWorksheet(`Participants`);
        for(var w=0;w<diego;w++){
            worksheet.columns=[
                {header:'Name',key:'name',width:20},
            ];
            worksheet.addRow({name:participants[w]});
            worksheet.getRow(1).eachCell((cell)=>{
                cell.font={bold:true};
            });
            workbook.xlsx.writeFile(`./excel/${f}.xlsx`)
            console.log('participants added')
        }
        if (r){
            const zip = new AdmZip();
            const downloadName = `${subject}-lobbies-${leng}.zip`;

			setTimeout(()=>{
				var uploadDir = fs.readdirSync('./excel');
			    console.log("nice ",uploadDir) 
				for(var v = 0; v <= leng;v++){
                    console.log("folder",uploadDir[v]);
					zip.addLocalFile(`./excel/`+uploadDir[v]);
				}
			    const data = zip.toBuffer();
			    zip.writeZip("./"+downloadName);
			},2000);
            setTimeout(()=>{
                if (fs.existsSync("./"+downloadName)){	     
                    fs.unlinkSync("./"+downloadName, function (err) {
                        if (err)
                            throw err;
                        console.log("deleted lol zipfile")		
                    });
                }
            },6000);
		}
    setTimeout(()=>{
        if (fs.existsSync(`./excel/${f}.xlsx`)){	     
            fs.unlinkSync(`./excel/${f}.xlsx`, function (err) {
                if (err)
                    throw err;
                console.log("deleted lol file")
            });
        }
    },5000);
}
module.exports = router;