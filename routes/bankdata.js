
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware")

const {addUserRoleController,saveUserController,getAllUsersController,loginUserController, getBankDataController,getFD1BalanceController} = require("../controllers/bankdata");

// router.post('/holdUser', holdUser);
router.post('/registerUser', saveUserController);
router.post('/loginUser',loginUserController);
router.get('/getAllUsers',authenticateToken,getAllUsersController);
router.get('/getBankData',authenticateToken,getBankDataController);
router.get('/getFD1Balance',authenticateToken,getFD1BalanceController);

module.exports = router;    