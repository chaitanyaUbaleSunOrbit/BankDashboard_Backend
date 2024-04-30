const sql = require('mssql');

const config2 = {
    user: 'sa',
    password: 'Password9',
    server: '103.152.79.61',
    // port:5000,
    database: 'VJDLIVE45',
        options: {
            encrypt: true, 
            trustServerCertificate: true,
            instancename:'SERVER\\SQLEXPRESS',
            enableArithAbort:true
        }  
};

module.exports=config2;
