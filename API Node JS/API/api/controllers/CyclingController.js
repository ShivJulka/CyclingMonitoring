var sql = require("../../sql");
var config = require("../../config");
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

//A function to login a user
exports.Login = async function (req, res, next) {

  //Check if email is provided
  if (req.query.email) {    
    req.query.email = req.query.email.toLowerCase();
  } else {
    console.log("Email is required");
    res.status(400).json({ error: "Email is required" });
    return;
  }
  
  
  //Check if user exists
  var checkExists = await sql.execute(
    `SELECT password FROM users
    WHERE email = ${sql.sqlString(req.query.email)} 
  `,
    config.Cycling
  );

  if(checkExists.recordset.length != 1)
  {
    //User does not exist
    res.sendStatus(400).end();
    return next();
  }

  var passCompare = await bcrypt.compare(req.query.password, checkExists.recordset[0].password);
  //compares the raw string password to the hashed password in the database
  
  if (!passCompare) {
    //Password is incorrect
    res.sendStatus(400).end();
    return next();
  }

  console.log("User Logged In Successfully.")

  //User is logged in successfully
  var data = await sql.execute(`SELECT username FROM users 
  WHERE email=${sql.sqlString(req.query.email)}`
  ,config.Cycling);

  console.log(data.recordset);

  res.status(200).send(data.recordset);
  return next();
}


//A function to register a user
exports.Register = async function (req, res, next) {

  if (req.query.email) {

    
    req.query.email = req.query.email.toLowerCase();
  } else {
    console.log("Email is required");
    res.status(400).json({ error: "Email is required" });
    return;
  }
  var checkExists = await sql.execute(
    `SELECT * FROM users
    WHERE email = ${sql.sqlString(req.query.email)} 
    OR username= ${sql.sqlString(req.query.username)} `,
    config.Cycling
  );

  if(checkExists.recordset.length >= 1)
  {
    console.log("User already exists");
    res.sendStatus(400).end();
    return next();
  }

  let newPass = req.query.password.toString();

  newPass = await bcrypt.hash(newPass, parseInt(salt));

  await sql.execute(
    `INSERT INTO users (username,email,password,age,height,weight) 
    VALUES (
      ${sql.sqlString(req.query.username)},
      ${sql.sqlString(req.query.email)},
      ${sql.sqlString(newPass)},
      ${sql.sqlString(req.query.age)},
      ${sql.sqlString(req.query.height)},
      ${sql.sqlString(req.query.weight)})`,
      config.Cycling
  );
 

  delete newPass;
  delete req.query.password;
  
  res.sendStatus(200).end();
  return next();
};



exports.updatePassword = async function (req, res, next) {

  var passCheck = await sql.execute(
    `SELECT password FROM users
    WHERE email = ${sql.sqlString(req.query.email)}`,
    config.Cycling
  );

  var passCompare = await bcrypt.compare(req.query.password, passCheck.recordset[0].pswrd);
  

  if(!passCompare)
  {
    res.status(404).send(("404").toString());
    return next();
  }
  delete passCheck.recordset[0].pswrd;

 // req.query.newpass = bcrypt.hash(req.query.password, salt);
  req.query.password = await bcrypt.hash(req.query.password, salt);


  await sql.execute(
    `UPDATE [scanmeDB].[dbo].[user]
    SET password = ${sql.sqlString(req.query.password)}
    WHERE email= ${sql.sqlString(req.query.email)}`,
    config.Cycling
  );

  res.sendStatus(200).end();
  return next();

}





exports.addData = async function (req, res, next) {

  //time format originates 00:00:00
  //Distance is KM aka 5.2km 
  console.log(req.query.username);
  console.log(req.query.distance);
  console.log(req.query.time);
  console.log(req.query.calories);
  console.log(req.query.speed);
  console.log(req.query.gpxdata);


  if(req.query.username && req.query.distance && req.query.time && req.query.calories && req.query.speed){
    await sql.execute(
      `INSERT INTO racedata (username,distance,time,speed,calories,gpxdata) VALUES (
        ${sql.sqlString(req.query.username)}, ${sql.sqlString(req.query.distance)},${sql.sqlString(req.query.time)},
        ${sql.sqlString(req.query.speed)},${sql.sqlString(req.query.calories)},${sql.sqlString(req.query.gpxdata)})`,
        config.Cycling
      );

      res.sendStatus(200).end();
      return next();
      
      }
  
  else{
    console.log("ERROR!")
    res.sendStatus(400).end();
    return next();
  }
};

exports.getAllData = async function (req, res, next) {

  //gets all the racedata for aparticulatr user

  console.log("recived!");

try{

 
  console.log("username: " + req.query.username);
  var data = await sql.execute(`SELECT * FROM racedata 
  WHERE username=${sql.sqlString(req.query.username)}`
  ,config.Cycling);


  console.log(data.recordset);
 
  res.status(200).send(data.recordset);
  return next();



}
  catch(e)
  {
    console.log("ERROR!")
    res.sendStatus(400).end();
    return next();
  }



}

/*
exports.getAllReceipts = async function (req, res, next) {

  var data = await sql.execute(
    `  SELECT title , recipt_id , dateofupload , total , currency FROM [scanmeDB].[dbo].[receipt]
    WHERE id = ${sql.sqlString(req.query.id)}`,
      config.Cycling
    );
 
  res.status(200).send(data.recordset);
  return next();
};
exports.getById = async function (req, res, next) {


  var data = await sql.execute(
    `SELECT title,dateofupload,dateatime,total,currency,changes,items FROM [scanmeDB].[dbo].[receipt]
    WHERE id = ${sql.sqlString(req.query.id)}
    AND recipt_id = ${sql.sqlString(req.query.recid)}`,
      config.Cycling
    );


  res.status(200).send(data.recordset);
  return next();
}
exports.getRecImage = async function (req, res, next) {
  var data = await sql.execute(
    `SELECT images FROM [scanmeDB].[dbo].[receipt]
    WHERE id = ${sql.sqlString(req.query.id)}
    AND recipt_id = ${sql.sqlString(req.query.recid)}`,
      config.Cycling
    );


  res.status(200).send(data.recordset);
  return next();
}
exports.updateRecByID = async function (req, res, next) {

  try{
    await sql.execute(
      `UPDATE [scanmeDB].[dbo].[receipt] 
      SET title=${sql.sqlString(req.query.title)},
      dateofupload=${sql.sqlString(req.query.dateofupload)},
      dateatime=${sql.sqlString(req.query.datetime)},
      total=${sql.sqlString(req.query.total)},
      currency=${sql.sqlString(req.query.currency)},
      changes=${sql.sqlString(req.query.change)},
      items=${sql.sqlString(req.query.items)}
      WHERE id=${sql.sqlString(req.query.id)} AND 
      recipt_id=${sql.sqlString(req.query.recid)}`,
      config.Cycling
      );
  
  }
  catch(e)
  {
    res.status(404).send();
    return next();
  }
  
  res.status(200).send();
  return next();
}
exports.deleteRecipt = async function (req, res, next) {


  try{
    await sql.execute(
      `DELETE FROM [scanmeDB].[dbo].[receipt] WHERE id = ${sql.sqlString(req.query.id)}`,
      config.Cycling
    );
    res.status(200).end();
    return next();
  }
  catch(e)
  {
    res.status(404).end();
    return next();
  }
  

}

exports.deleteAccount = async function (req, res, next) {


  try{
    await sql.execute(
      `DELETE FROM [scanmeDB].[dbo].[user] WHERE id = ${sql.sqlString(req.query.id)}`,
      config.Cycling
    );

    res.status(200).end();
    return next();

  }
  catch(e)
  {
    res.status(404).end();
    return next();
  }

}
*/