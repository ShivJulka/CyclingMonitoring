

exports.Cycling = { 
  user: "root",
  password: "",
  server: "127.0.0.1",
  port: 1433,
  database: "test",
  options: {
    enableArithAbort: true,
    instanceName: "test",
    //IntegratedSecurity: true,

    //cryptoCredentialsDetails: {
    // minVersion: "TLSv1",
    //},
    trustServerCertificate: true,
  },
  connectionTimeout: 30000,
  requestTimeout: 0,
};
