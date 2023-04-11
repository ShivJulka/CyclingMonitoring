var sql = require("../../sql");
var config = require("../../config");
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

exports.Login = async function (req, res, next) {

 /* console.log(req.query.email);
  req.query.email = req.query.email.toLowerCase();
/*
  var passCheck = await sql.execute(
    `SELECT is_verified,pswrd,id FROM [scanmeDB].[dbo].[user] 
    WHERE email = ${sql.sqlString(req.query.email)}`,
    config.Cycling
  );

  if(passCheck.recordset.length != 1)
  {
  
    res.status(403).send(("403").toString());
    return next();
  }


  var passCompare = await bcrypt.compare(req.query.password, passCheck.recordset[0].pswrd);


  if(!passCompare)
  {
  
    res.status(404).send(("404").toString());
    return next();
  }
  
  if(passCheck.recordset[0].is_verified == false)
  {
    //send email to user which makes the is_verifited 1
    res.status(402).send(("402").toString());
    return next();
  }

  delete passCheck.recordset[0].pswrd;



  res.status(200).send(passCheck.recordset);
  return next();

  ////////
  




var passCheck = await sql.execute(
  `SELECT password FROM users 
  WHERE email = ${sql.sqlString(req.query.email)}`,
  config.Cycling
);

if(passCheck.length != 1)
{
  res.status(403).send(("403").toString());
  return next();
}

var passCompare = await bcrypt.compare(req.query.password, passCheck[0].password);

if(!passCompare)
{
  res.status(404).send(("404").toString());
  return next();
}

// Add verification column to the MySQL table
var user = await sql.execute(
  `SELECT username, age, height, weight, is_verified FROM users 
  WHERE email = ${sql.sqlString(req.query.email)}`,
  config.Cycling
);

if(user.length != 1)
{
  res.status(403).send(("403").toString());
  return next();
}

if(user[0].is_verified == false)
{
  //send email to user which makes the is_verifited 1
  res.status(402).send(("402").toString());
  return next();
}

delete user[0].password;

res.status(200).send(user);
return next(); **/

  console.log(req.query.username);
  req.query.email = req.query.username.toLowerCase();

  var passCheck = await sql.execute(
    `SELECT password, is_verified FROM users WHERE email = ${sql.sqlString(req.query.email)}`,
    config.Cycling
  );

  if (passCheck.length != 1) {
    res.status(403).send(("403").toString());
    return next();
  }

  var passCompare = await bcrypt.compare(req.query.password, passCheck[0].password);

  if (!passCompare) {
    res.status(404).send(("404").toString());
    return next();
  }

  if (!passCheck[0].is_verified) {
    // send email to user which makes the is_verified 1
    res.status(402).send(("402").toString());
    return next();
  }

  var user = await sql.execute(
    `SELECT username, age, height, weight, is_verified FROM users WHERE email = ${sql.sqlString(req.query.email)}`,
    config.Cycling
  );

  if (user.length != 1) {
    res.status(403).send(("403").toString());
    return next();
  }

  delete user[0].password;

  res.status(200).send(user);
  return next();
}



exports.Register = async function (req, res, next) {

  console.log("hello------------------------------------");

  console.log(req.query.email);
  console.log(req.query);
  console.log(req.body);

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

  let speed = req.query.distance / req.query.time


  try{



    await sql.execute(
      `INSERT INTO racedata (username, distance, time,speed,calories) VALUES (
        ${sql.sqlString(req.query.username)}, ${sql.sqlString(req.query.distance)},${sql.sqlString(req.query.time)},
        ${sql.sqlString(speed)},${sql.sqlString(req.query.calories)},${sql.sqlString(req.query.gpx)})`,
        config.Cycling
      );

      res.sendStatus(200).end();
      return next();
      

  }
  catch(e)
  {
    res.sendStatus(400).end();
    return next();
  }

};

exports.getAllData = async function (req, res, next) {

  //gets all the racedata for aparticulatr user

    console.log("recived!");

try{
  console.log(config.Cycling);
  await sql.execute(`SELECT * FROM users WHERE username = 'shiv' `,config.Cycling);

  console.log("p!");
  res.sendStatus(200).end();
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