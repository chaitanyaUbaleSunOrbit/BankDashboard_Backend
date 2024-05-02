const sql = require("mssql");
const config2 = require("../configLive");

async function getFinanceLedgerRecords() {
   
      try {
        const pool = await sql.connect(config2);
        const result = await pool.request()
          .query(
               `SELECT * FROM VJDLIVE45.dbo.kk`
          );
        return result.recordset;
      } catch (err) {
        throw err;
    } 
  }

async function fetchAPI(){
  if (config2.options.instancename == "'SERVER\\SQLEXPRESS'"){
    try{
      const pool = await sql.connect(config2);
      const result = await pool.request()
        .query(
             `SELECT * FROM dbo.kk`
        );
        return result.recordset;
  
    }
    catch(err){
      throw err;
  
    }
  }
 
}

module.exports = {
    getFinanceLedgerRecords,
    fetchAPI
}