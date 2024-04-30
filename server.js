const express = require("express");
const cors = require("cors")
const app = express();


const routes = require("./routes/bankdata");

app.use(express.json())
app.use(cors());
// const PORT= process.env() || 8000;
const PORT = process.env.PORT || 5000;  
app.use("/api",routes);

app.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`);
})