
const sql = require('mssql');
const config = {
    user: 'sa',
    password: 'farvision@123',
    server: '103.129.97.217',
    // port:5000,
    database: 'BANKDATA_TEST',
        options: {
            encrypt: true, 
            trustServerCertificate: true,
            instancename:"VJSERVER",
            enableArithAbort: true
        }  
};





// sql.connect(config).then(pool => {
//     // return pool.query('SELECT * FROM Users_New');
// }).then(result => {
//     console.dir(result);
// }).catch(err => {
//     console.error('Error:', err);
// });


module.exports=config;