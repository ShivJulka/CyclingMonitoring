

exports.Cycling = { 
  user: "user1",
  password: "1234",
  server: "DESKTOP-0HCMOLI\\SQLEXPRESS",
  port: 1433,
  database: "Cycling",
  
  options: {
    enableArithAbort: true,
    instanceName: "Cycling",
    //encrypt: true,
    
    //IntegratedSecurity: true,

    //cryptoCredentialsDetails: {
    // minVersion: "TLSv1",
    //},
    trustServerCertificate: true,
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

