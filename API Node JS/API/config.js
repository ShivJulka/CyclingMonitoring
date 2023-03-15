

exports.Cycling = { 
  user: "user1",
  password: "1234",
  server: "localhost\\SQLEXPRESS",
  port: 1433,
  database: "master",
  options: {
    enableArithAbort: true,
    instanceName: "master",
    IntegratedSecurity: true,

    cryptoCredentialsDetails: {
     minVersion: "TLSv1",
    },
    trustServerCertificate: true,
  },
  connectionTimeout: 30000,
  requestTimeout: 0,

  
};
