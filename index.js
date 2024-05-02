
const config = {
    user: 'sa',
    password: 'farvision@123',
    server: '103.129.97.217',
    database: 'BANKDATA_TEST',
        options: {
            encrypt: false, 
            trustServerCertificate: true,
            instancename:"VJSERVER",
            enableArithAbort: true,
            trustedConnection:false,
        }  
};


module.exports=config;


// sql.connect(config).then(pool => {
//     // return pool.query('SELECT * FROM Users_New');
// }).then(result => {
//     console.dir(result);
// }).catch(err => {
//     console.error('Error:', err);
// });

