const express = require("express");
const cors = require("cors")
const config = require("./index")
const config2 = require("./configLive")
const sql = require('mssql');
const app = express();


const routes = require("./routes/bankdata");
const routesVjdLive=require("./routes/vjdlive45");

app.use(express.json())
app.use(cors());
// const PORT= process.env() || 8000;
const PORT = process.env.PORT || 5000;  
async function connectDatabase(configure1,configure2) {
    try {
      await sql.connect(configure1,configure2);
      console.log(`Connected to database: ${configure1.database}`);
      console.log(`Connected to database: ${configure2.database}`);
    } catch (err) {
      console.error(`Error connecting to database (${configure1.database}):`, err.message);
      console.error(`Error connecting to database (${configure2.database}):`, err.message);
    }
  }
  app.use("/api",routesVjdLive);
  app.use("/api",routes);
  
  
  (async () => {
    await connectDatabase(config,config2); // bankData
    // await connectDatabase(config2); // VJDLIVE45

    // Start the server after connections are established
    app.listen(PORT, () => {
      console.log(`App is running on PORT ${PORT}`);
    });   
  })();



// app.listen(PORT,()=>{
//     console.log(`App is running on PORT ${PORT}`);
// })