const config2 = require("../configLive")
const {getFinanceLedgerRecords,fetchAPI} = require("../models/vjdLive45")

async function getFinanceLedgerRecordsController(req,res){
        try{
            const result = await getFinanceLedgerRecords()
            if(!result){
             console.log(result," :Finance ledger records not found at",config2.database);
             res.status(404).json({msg:"not found"})
            }
            else res.status(200).json({msg:"success",data:result})
         }
         catch(err){
             console.log("error:",err)
             return res.status(400).json({msg:"Internal Server Error"})
         }
   
}


async function fetchAPIController (req,res){
    try{
        const result = await fetchAPI()
            if(!result){
             console.log(result," : records not found at",config2.database);
             res.status(404).json({msg:"not found"})
            }
        else res.status(200).json({msg:"success",data:result})

    }
    catch(err){
        console.log(err);
        return res.status(400).json({msg:"Internal Server Error"})

    }
}
// async function getFinanceLedgerRecordsController(req, res) {
//     try {
//         const result = await getFinanceLedgerRecords(config2); 
//         if (!result || result.length === 0) {
//             console.log("Finance ledger records not found in database:",database);
//             return res.status(404).json({ msg: "Records not found" });
//         } else {
//             return res.status(200).json({ msg: "Success", data: result });
//         }
//     } catch (err) {
//         console.error("Error fetching finance ledger records:", err);
//         return res.status(500).json({ msg: "Internal Server Error" });
//     }
// }


module.exports={
    getFinanceLedgerRecordsController,
    fetchAPIController
}