const {addUserRole,
     saveUser,
    getAllUsers, 
    loginUser, 
    getBankData,
    getFD1Balance,
    // getFinanceLedgerRecords,
    getFD2Balance,
    getAccountHistory,
    addHoldRequest,
} =require("../models/bankdata");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {database} = require("../index");


const secretKey ="secretKey";


async function getAllUsersController(req,res) {
    try{
        const user=await getAllUsers();
        const token = jwt.sign({ userId: user.Id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({msg:"success", data:user,token:token,database:database})


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
        if(!name ||!CreatedAt ||!emailId  || !pasword  || !userType || !userToken || !contactNo ){
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

async function addHoldRequestController(req,res){
    try{
      const{Bu_Name,Account_No,Account_Type,LedgerId,Amount,Hold_Description,Hold_UserId}=req.body;
      if(!Bu_Name||!Account_No||!Account_Type){
         console.log("All fields are reqired");
         res.status(400).json({msg:"All fields are required"})
      }
      const result = await addHoldRequest(Bu_Name,Account_No,Account_Type,LedgerId,Amount,Hold_Description,Hold_UserId)
      return res.status(201).json({msg:"hold req added successfully",data:result})      
    }
    catch(err){
        console.log("error :" ,err);
        res.status(400).json({msg:"Internal server error"})
    }
}


async function addUserRoleController(req,res){
    const {name,CreatedAt,emailId,pasword,userType,userToken,contactNo,roleId,roleName,isApproved}=req.body
    try{
        if(!name ||!emailId  || !pasword  || !userType  || !contactNo || !roleId || !roleName || !isApproved){
            return res.status(400).json({msg:"All fields required ",name:name,CreatedAt:CreatedAt,emailId:emailId,pasword:pasword,userType:userType,userToken:userToken,contactNo:contactNo,roleId:roleId,roleName:roleName,isApproved:isApproved});
        }
        const user= await addUserRole(name,CreatedAt,emailId,pasword,userType,userToken,contactNo,roleId,roleName,isApproved);
        const token = jwt.sign({ userId: user.Id }, secretKey, { expiresIn: '1h' });
        return res.status(201).json({msg:"Success",data:user,token:token}) 
    }
    catch(err){
       console.log("error : ",err);
       res.status(500).json({msg:"Internal server error"})
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

async function getAccountHistoryController(req,res){
    
    try{
      const  {buId}=req.body;
      if(!buId){
        console.log("BuId required");
        res.status(400).json({msg:"All Fields are required"});

      }
      const result=  await getAccountHistory(buId);
         return res.status(200).json({msg:"success",data:result})

    }
    catch(err){
        console.log(err);
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
        res.status(500).json({msg:"Internal server error"})
     }
}

async function getFD2BalanceController(req,res){
    try{
       const result = await getFD2Balance();
       if(!result){
        console.log("not found");
        return res.status(400).json({msg:"not found"})
       }
       return res.status(200).json({msg:"success",data:result})
    }
    catch(err){
        console.log("error",err);
        res.status(500).json({msg:"internal server error"})
    }
}

// async function getFinanceLedgerRecordsController(req,res){
//     try{
//        const result = await getFinanceLedgerRecords()
//        console.log(result)
//        if(!result){
//         console.log("Finance ledger records not found");
//         res.status(404).json({msg:"not found"})
//        }
//        else res.status(200).json({msg:"success",data:result})
//     }
//     catch(err){
//         console.log("error:",err)
//         return res.status(400).json({msg:"Internal Server Error"})
//     }
// }


module.exports = {
    addUserRoleController,
    saveUserController,
    loginUserController,
    getAllUsersController,
    getBankDataController,
    getFD1BalanceController,
    // getFinanceLedgerRecordsController,
    getFD2BalanceController,
    getAccountHistoryController,
    addHoldRequestController,
};
