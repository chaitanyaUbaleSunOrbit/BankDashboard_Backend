
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware")

const {addUserRoleController,
    saveUserController,
    getAllUsersController,
    loginUserController, 
    getBankDataController,
    getFD1BalanceController,
    getFD2BalanceController,
    // getFinanceLedgerRecordsController,
    getAccountHistoryController,

} = require("../controllers/bankdata");

// router.post('/holdUser', holdUser);
router.post('/registerUser', saveUserController);
router.post('/loginUser',loginUserController);
router.get('/getAllUsers',authenticateToken,getAllUsersController);
router.get('/getBankData',getBankDataController);
router.get('/getFD1Balance',getFD1BalanceController);
router.get('/getFD2Balance',getFD2BalanceController);
// router.get('/getFinanceLedger',getFinanceLedgerRecordsController);
router.post('/getAccountHistory',getAccountHistoryController);

module.exports = router;    