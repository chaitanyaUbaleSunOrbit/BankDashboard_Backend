const sql = require("mssql");
const config = require("../index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function getAllUsers() {
  if (config.options.instancename === "VJSERVER") {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM Users_New");

      return result.recordset;
    } catch (err) {
      console.log("error occured :", err);
    }
  }
}

async function getFD1Balance() {
  if (config.options.instancename === "VJSERVER") {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .query(`SELECT COALESCE(cashBankID, cashBankID1, cashBankID2) AS CashBankId, SUM(fdBal) AS fdbal ,fdBalance.ParentLedgerId 
                  FROM fdBalance WHERE ParentLedgerId IN (51253, 51254, 55829) GROUP BY COALESCE(cashBankID, cashBankID1, cashBankID2),
                   fdBalance.ParentLedgerId`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  }
}

async function getFD2Balance() {
  if (config.options.instancename === "VJSERVER") {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query(
        `SELECT COALESCE(cashBankID, cashBankID1, cashBankID2) AS CashBankId, sum (fdBal) as fdbal, 
                            ParentLedgerId FROM fdBalance where ParentLedgerId in (51252, 55616) group by 
                            COALESCE(cashBankID, cashBankID1, cashBankID2), ParentLedgerId`
      );
      return result.recordset;
    } catch (err) {
      console.log("err :", err);
      return res.status(500).json({ msg: "internal server error" });
    }
  }
}

// async function getFinanceLedgerRecords() {
//   if (config.options.instancename === "'103.152.79.61\\SQLEXPRESS'"){
//     try {
//       const pool = await sql.connect(config2);
//       const result = await pool.request()
//         .query(
//              // `SELECT * FROM Finance.ledger`
//              `SELECT * FROM Finance.ledger;`
//               // `Select Finance.ledger.Id,Finance.ledger.Description,Finance.ledger.BankAccountNo,Finance.ledger.IFSCCode,Finance.ledger.GroupId, Finance.ledgerGroup.Id as Gid,Finance.ledgerGroup.Description as GDescription, Finance.BuWiseLedgerTag.BuId,b.Description as Bu_Name, b.ParentId, (select Description from Framework.BusinessUnit where id = b.ParentId ) as Company_Name From Finance.ledger left join Finance.LedgerGroup on Finance.ledger.GroupId =  Finance.LedgerGroup.Id left join Finance.BuWiseLedgerTag on Finance.BuWiseLedgerTag.LedgerId = Finance.ledger.id left Join Framework.BusinessUnit b on Finance.BuWiseLedgerTag.BuId = b .Id Where Finance.LedgerGroup.ParentId = 182 and (Finance.ledger.IsDeleted = 0 or Finance.ledger.IsDeleted is null) and (Finance.Ledger.IsDiscontinued = 0 or Finance.Ledger.IsDiscontinued is null) Group by Finance.ledger.Id, Finance.ledger.Id,Finance.ledger.Description,Finance.ledger.BankAccountNo,Finance.ledger.IFSCCode,Finance.ledger.GroupId, Finance.ledgerGroup.Id ,Finance.ledgerGroup.Description,Finance.BuWiseLedgerTag.BuId,b.Description, b.ParentId`
//         );
//       return result.recordset;
//     } catch (err) {
//       throw err;
//     }
//   }

// }

async function getBankData() {
  if (config.options.instancename === "VJSERVER") {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .query(`Select DailyBankBalanceCurrent.BuWiseBankMappingID, DailyBankBalanceCurrent.BALANCE, LastUpdatedDate,
                   BuWiseBankMapping.LedgerId from DailyBankBalanceCurrent left join 
                   BuWiseBankMapping on BuWiseBankMapping.id = DailyBankBalanceCurrent.BuWiseBankMappingID`);
      return result.recordset;
    } catch (err) {
      throw err;
    }
  }
}

async function loginUser(emailId, pasword) {
  if (config.options.instancename === "VJSERVER") {
    try {
      const pool = await sql.connect(config);
      const result =
        await 
        pool
          .request()
          .input("emailId", sql.VarChar, emailId)
          .input("pasword", sql.VarChar, pasword)
         
        // .query("SELECT * FROM Users_New WHERE emailId = @emailId");
        .query(`
        SELECT Users_New.*, UserRoles_New.roleId, UserRoles_New.roleName
        FROM Users_New
        INNER JOIN UserRoles_New ON Users_New.Id = UserRoles_New.userId
        WHERE Users_New.emailId = @emailId
      `);

      if (result.recordset.length === 0) {
        throw new Error("User not found");
      }
      const user = result.recordset[0];
      const hashedPassword = user.pasword;
      const passwordMatch = await bcrypt.compare(pasword, hashedPassword);
      if (!passwordMatch) {
        throw new Error("Invalid credentials");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

async function saveUser(
  name,
  CreatedAt,
  emailId,
  pasword,
  userType,
  userToken,
  contactNo,
  res
) {
  if (config.options.instancename === "VJSERVER") {
    try {
      if (
        !name ||
        !CreatedAt ||
        !emailId ||
        !pasword ||
        !userType ||
        !userToken ||
        !contactNo
      ) {
        return res.status(400).json({ msg: "All fields required" });
      }
      const hashedPasword = await bcrypt.hash(pasword, 5);
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        // .input("Id", Id)
        .input("name", name)
        .input("CreatedAt", CreatedAt)
        .input("emailId", emailId)
        .input("pasword", hashedPasword)
        .input("userType", userType)
        .input("userToken", userToken)
        .input("contactNo", contactNo)
        .query(`INSERT INTO Users_New ( name, CreatedAt, emailId, pasword, userType, userToken, contactNo)
             VALUES ( @name, @CreatedAt, @emailId, @pasword, @userType, @userToken, @contactNo)`);

      return { success: true, message: "User  added successfully", result };
    } catch (error) {
      throw error;
    }
  }
}

// async function addUserRole(
//   name,
//   CreatedAt,
//   emailId,
//   pasword,
//   userType,
//   userToken,
//   contactNo,
//   roleId,
//   roleName,
// ) {
//   try {
//     // Validate required fields
//     if (!name || !CreatedAt || !emailId || !pasword || !userType || !userToken || !contactNo || !roleId ||!roleName) {
//       throw new Error("All fields are required");
//     }

//     const hashedpasword = await bcrypt.hash(pasword, 5);

//     const pool = await sql.connect(config);

//     const result = await pool
//       .request()
//       .input("name", name)
//       .input("CreatedAt", CreatedAt)
//       .input("emailId", emailId)
//       .input("pasword", hashedpasword)
//       .input("userType", userType)
//       .input("userToken", userToken)
//       .input("contactNo", contactNo)
//       .input("roleId", roleId)
//       .input("roleName", roleName)
//       .query(`
//         DECLARE @userId INT;
//         INSERT INTO Users_New (name, CreatedAt, emailId, pasword, userType, userToken, contactNo)
//         VALUES (@name, @CreatedAt, @emailId, @pasword, @userType, @userToken, @contactNo);

//         SET @userId = SCOPE_IDENTITY();

//         DECLARE @roleId INT = 1; -- Example roleId
//         DECLARE @roleName NVARCHAR(255) = 'Standard User';

//         INSERT INTO UserRoles_New (roleId, userId, roleName, CreatedAt)
//         VALUES (@roleId, @userId, @roleName, CURRENT_TIMESTAMP);

//         SELECT @userId AS userId; -- Return userId after insertion
//       `);

//     const userId = result.recordset[0].userId;

//     return { success: true, message: "User added successfully", userId };
//   } catch (err) {
//     console.error("Error adding user:", err);
//     throw err;
//   }
// }
async function addUserRole(
  name,
  CreatedAt,
  emailId,
  pasword,
  userType,
  userToken,
  contactNo,
  roleId,
  roleName
) {
  try {
    // Validate required fields
    if (
      !name ||
      !CreatedAt ||
      !emailId ||
      !pasword ||
      !userType ||
      !userToken ||
      !contactNo ||
      !roleId ||
      !roleName
    ) {
      throw new Error("All fields including roleId and roleName are required");
    }

    const hashedpasword = await bcrypt.hash(pasword, 5);

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("name", name)
      .input("CreatedAt", CreatedAt)
      .input("emailId", emailId)
      .input("pasword", hashedpasword)
      .input("userType", userType)
      .input("userToken", userToken)
      .input("contactNo", contactNo)
      .input("roleId", roleId)
      .input("roleName", roleName).query(`
        DECLARE @userId INT;
        INSERT INTO Users_New (name, CreatedAt, emailId, pasword, userType, userToken, contactNo)
        VALUES (@name, @CreatedAt, @emailId, @pasword, @userType, @userToken, @contactNo);

        SET @userId = SCOPE_IDENTITY();

        INSERT INTO UserRoles_New (roleId, userId, roleName, CreatedAt)
        VALUES (@roleId, @userId, @roleName, CURRENT_TIMESTAMP);

        SELECT @userId AS userId; -- Return userId after insertion
      `);

    // Extract the userId from the result
    const userId = result.recordset[0].userId;

    return { success: true, message: "User added successfully", userId };
  } catch (err) {
    console.error("Error adding user:", err);
    throw err;
  }
}

module.exports = { addUserRole };

async function getAccountHistory(buId) {
  if (config.options.instancename === "VJSERVER") {
    try {
      if (!buId) {
        console.log("buid required");
      }
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("buId", buId)
        .query(
          `Select * From DailyBankBalanceDump Where BuWiseBankMappingID = @buId Order by LastUpdatedDate desc`
        );
      if (result.recordset.length === 0) {
        throw new Error("Account not found");
      }
      return result.recordset;
    } catch (err) {
      console.log("error :", err);
    }
  }
}

module.exports = {
  saveUser,
  loginUser,
  getAllUsers,
  getBankData,
  getFD1Balance,
  // getFinanceLedgerRecords,
  getFD2Balance,
  getAccountHistory,
  addUserRole,
};

// async function addUserRole(userId, roleId, roleName, CreatedAt, res) {
//     try {
//         if (!userId || !roleId || !roleName || !createdAt) {
//             return res.status(400).json({ msg: "All fields required" });
//         }
//         const hashedpasword = await bcrypt.hash(pasword, 10);
//         const pool = await sql.connect();
//         const result = await pool.request()
//             .input("userId", userId)
//             .input("roleId", roleId)
//             .input("roleName", roleName)
//             .input("createdAt", createdAt)
//             .query("INSERT INTO dbo.UserRoles_New (userId, roleId, roleName, createdAt) VALUES (@userId, @roleId, @roleName, @createdAt)");

//             const userData = { pasword };
//             const accessToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
//         return res.status(201).json({
//             success: true,
//             message: "User role added successfully",
//             result,
//             accessToken
//         });
//     } catch (error) {
//         console.log("err:", error);
//         return res.status(500).json({ msg: "Internal server error" });
//     }
// }
