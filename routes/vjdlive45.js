const express = require("express");
const router = express.Router();

const  {getFinanceLedgerRecordsController,fetchAPIController} =require("../controllers/vjdLive45");
router.get("/getFinanceLedgerRecords",getFinanceLedgerRecordsController);
router.get("/fetchApi",fetchAPIController);

module.exports = router;   
