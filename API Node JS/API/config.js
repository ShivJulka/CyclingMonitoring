

exports.Cycling = { 
  user: "user1",
  password: "1234",
  server: "localhost\\SQLEXPRESS",
  port: 1433,
  database: "master",
  
  options: {
    enableArithAbort: true,
    instanceName: "master",
    //encrypt: true,
    
    //IntegratedSecurity: true,

    //cryptoCredentialsDetails: {
    // minVersion: "TLSv1",
    //},
    trustServerCertificate: false,
    //trustedConnection: true,
  },
  //pool:{
  //  max:10,
  // min: 0,
  //  idleTimeoutMillis: 3000
  //},
  connectionTimeout: 30000,
  requestTimeout: 0,

  
};
