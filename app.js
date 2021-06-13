
var alert = require('alert');
var express=require('express');
var bodyParser=require('body-parser');
const request=require('request');
var app=express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var MongoClient=require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

app.use( express.static( "public" ) );
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
  
app.set('view engine','ejs');

app.get('/',function(req,res){
  res.render('home');
});

app.get('/register',function(req,res){
    res.render('register');
});

app.get('/login',function(req,res){
    res.render('login');
});

app.get('/weatherNow',function(req,res){
  res.render('weather');
});



app.post('/register' ,urlencodedParser,function(req,res){
    console.log(req.body.email);
    var user_name=req.body.username;
    var user_email=req.body.email;
    var pwd=req.body.password;
    var check_email= 0;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        var myobj = { name:user_name, email:user_email,pass:pwd };
        dbo.collection("users").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
        res.redirect('/login');   
});
});


app.post('/login',urlencodedParser,function(req,res){
    console.log(req.body.email);
    var user_email=req.body.email;
    var pwd=req.body.password;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("users").findOne({email:user_email}, function(err, result) {
          if (err){
            console.log("yooo") ;
          
          };
          console.log(result.email);
          var database_pass=result.pass;
          if(pwd==database_pass){
              console.log("matched");
              alert("login successful");
              res.redirect('/');
          }
          else{
              console.log("not matched");
              alert("credentials dont match");
              
             
              res.redirect('/login');
          }
          db.close();
        });
      });
});


app.post('/weatherNow',urlencodedParser,function(req,res){

  var city=req.body.city
  console.log(city);
  
 const api=`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0155ed6a3cb2add53b6dd673ca22fc3b`;

 request(api, (error, response, today) => {
 const data=JSON.parse(today);
 console.log(data.weather);
 


 });



});




app.listen(3000);