var express = require('express');
var	routes = require('./routes');
var	visitors = [];
var email = require("mailer");
//var secret = require("secrets");
var app = module.exports = express.createServer();

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

var everyone = require("now").initialize(app);
everyone.now.sendVerificationMail = function(emailId){
  email.send({
    host : "smtp.gmail.com",              // smtp server hostname
    port : "465",                     // smtp server port
   // ssl : true,
    domain : "http://mint.nodester.com/",            // domain used by client to identify itself to server
    to : emailId,
    from : "ronnie2in@gmail.com",
    subject : "You have been registered",
    body: "<B>Hello! This is a test of the node_mailer.</B>",
    authentication : "login",        // auth login is supported; anything else is no auth
    username : "ronnie2in@gmail.com",//secret.email.id,
    password : "lausdeo0"//secret.email.password        
    },
    function(err, result){
      if(err){ this.now.error(err); }
  });

  this.now.successfullySent();
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