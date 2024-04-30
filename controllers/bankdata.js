const {addUserRole, saveUser,getAllUsers, loginUser, getBankData,getFD1Balance} =require("../models/bankdata");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey ="secretKey";


async function getAllUsersController(req,res) {
    try{
        const user=await getAllUsers();
        const token = jwt.sign({ userId: user.Id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({msg:"success", data:user,token:token})


    }
    catch(err){
        console.log("err :",err);
        res.status(401).json({msg:"Internal Server Error"})
    }
}

async function getBankDataController(req,res) {
    try{
        const user=await getBankData();
        res.status(200).json({msg:"success", data :user})
    }
    catch(err){
        console.log("err :",err);
        res.status(401).json({msg:"Internal Server Error"})
    }
}

async function saveUserController(req,res){
    try{
        // const { Id  } = authenticateUser(req.body.emailId, req.body.password);
        // if (!Id) {
        //     return res.status(401).json({ msg: "Invalid credentials" });
        // }
        // const token = jwt.sign({ Id },secretKey, { expiresIn: '1h' });
        // return(
        //     res.status(200).json({ token })          
        // ) 
              
        const {name,CreatedAt,emailId,pasword,userType,userToken,contactNo}=req.body
        if(!name ||!CreatedAt ||!emailId  || !pasword  || !userType || !userToken || !contactNo){
            return res.status(400).json({msg:"All fields required"});
        }
        const user= await saveUser(name,CreatedAt,emailId,pasword,userType,userToken,contactNo);
        const token = jwt.sign({ userId: user.Id }, secretKey, { expiresIn: '1h' });

        return res.status(201).json({msg:"Success",data:user,token:token}) 
    }
    catch(err){
        console.log("error : ",err);
        res.status(500).json({msg:"internal server error"})
    }
}

async function addUserRoleController(req, res) {
    try {
        const { roleId, userId, roleName, createdAt } = req.body;
        if (!roleId || !userId || !roleName || !createdAt) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        await addUserRole(userId, roleId, roleName, createdAt,res);
        return res.status(200).json({ msg: "Success"});
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

async function loginUserController(req,res){
    try{
        const {emailId,pasword} = req.body;
        if(!emailId || !pasword){
            console.log("emailId and Password required");
            res.status(400).json({msg:"All Fields are required"});
        }
        
        const user=  await loginUser(emailId,pasword);
        
        const token = jwt.sign({ userId: user.Id }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({msg:" login successfull",data:user,token:token})
    }
    catch(err){
        console.log("err",err);
        res.status(500).send({msg:"Internal Server Error"})
    }
}

async function getFD1BalanceController(req,res){
     try{
       const result = await getFD1Balance();
       if(!result){
         console.log("FB1Balance not found");
         res.status(404).json({msg:"not found"})
       }
       else
       res.status(200).json({msg:"success",data:result});
     }
     catch(err){
        console.log("error",err);
        res.status(401).json({msg:"Internal server error"})
     }
}


module.exports = {
    addUserRoleController,
    saveUserController,
    loginUserController,
    getAllUsersController,
    getBankDataController,
    getFD1BalanceController
};

// async function holdUser(req,res){         //// Correction Needed
//     try{
//           const {userId}=req.body;
//           if(!userId){
//             return res.status(400).json({message: "uid required"})

//           }
//           await addUserHold(userId);
//           return(res.status(200).json({message:"success"}))
//     }     
//     catch(error){
//         console.log("error :",error);
//         return res.status(500).json({msg:"Server error"})
//     }
// }