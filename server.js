const APP_URL = "http://mint.nodester.com";
var express = require('express');
var	routes = require('./routes');
var app = module.exports = express.createServer();
var nodemailer = require("nodemailer");
var gmailer = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: process.env["emailUserName"],
    pass: process.env["emailPassword"]
  }
});

var mongo = require("mongoskin");
var db = mongo.db(process.env["dbusername"] + ":" + process.env["dbpassword"] + "@staff.mongohq.com:10044/mint");


app.listen(process.env['app_port'] || 8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

/* Configuring app for express */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register(".html", require("jqtpl").express);
  app.set("view options", { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('dev', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// For serving default index.html page
app.get('/', function(req,res){
		res.render(__dirname + '/views/index.html', {author: "Juzer Ali"});
});

/*
* Serve Application Form
*/
app.get('/applicationform.html', function(req,res){
    res.render(__dirname + '/views/applicationform.html', {author: "Juzer Ali"});
});


var everyone = require("now").initialize(app, {socketio: {transports: ['xhr-polling', 'jsonp-polling', 'htmlfile']}});


everyone.now.sendVerificationMail = function(emailId){
  require('crypto').randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex');
  });

  var user = {
    "email": emailId,
    "token": token,
    "created": new Date().getTime()
  }

  db.collection("users").save(user, {}, function(err, coll){
    gmailer.sendMail(mailOptions, function(error, response){
      if(error) self.now.error(error);
      else self.now.successfullySent(response);
    });
  });

  var mailOptions = {
    from: process.env["emailUserName"],
    to: emailId,
    subject: "Confirm Registration on Mint",
    html: "Click on the below mentioned link to activate your Mint account\n\n\n <a href='"+APP_URL+"/activate/"+token+"+'></a>"
  };

  
 };	

everyone.now.addName = function(name){
	var self = this;
	//console.log(name,self.name);
	var index = visitors.indexOf(name);
	if(index >= 0) visitors.splice(index,1);
	visitors.unshift(name);
	//console.log(visitors)
	everyone.now.populateVisitors(visitors);
}	