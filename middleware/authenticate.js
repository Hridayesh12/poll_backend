const jwt = require("jsonwebtoken");
const Users = require("../model/usr");
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;



module.exports = async (req, res, next) => {
	const authorization = req.cookies.jwtoken;
    // console.log(authorization)
        if(!authorization)
        {
            return res.status(422).json({error:"login first"})           
        }
        else
        {
            const token=authorization.replace("Bearer","");
            const verifyToken=jwt.verify(token,JWT_SECRET);
            const rootUser = await Users.findOne({
                _id: verifyToken._id
            });
            if (!rootUser) {
                // console.log("user not found")
            }
            else
            {
                req.token = token;
                req.rootUser = rootUser;
                req.userID = rootUser._id;
                return res.status(200).send(rootUser)
            }
            next();
        }
};

