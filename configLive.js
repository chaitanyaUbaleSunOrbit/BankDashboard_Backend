
const config2 = {
    user: 'sa',
    password: 'Password9',
    server: '103.152.79.61', 
    database: 'VJDLIVE45',
        options: {
              encrypt: false, 
              trustServerCertificate: true,
              instancename:"SERVER\\SQLEXPRESS",
              enableArithAbort: true,
              trustedConnection: true,
        }  
};


module.exports=config2;
