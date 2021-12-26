const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const request = require("request");
const nodemailer = require('nodemailer');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
var projectsData=[];

function sendmail(subject, message){
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'amitdiot@gmail.com',
      pass: 'abcdefghijklmnop'
    }
  });  
  var mailOptions = {
    from: 'amitdiot@gmail.com',
    to: 'rnithish248@gmail.com',
    subject: subject,
    text: message,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}



app.get('/',function (req, res) {
  request("https://portfolio-data-da5da-default-rtdb.firebaseio.com/projects.json", { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    projectsData=body;
  });
  
  res.render('home.ejs', { projects: projectsData})
});

app.get('/projects/:project', function(req, res) {
  const req_project = _.lowerCase(req.params.project);
  
  projectsData.forEach( function (project){
    const currentProject =_.lowerCase(project.title)
    if(req_project===currentProject){
        res.render('project-details.ejs',{project:project})
    }
  });
});

app.post("/send",function (req, res) {
  var your_name = req.body.name;
  var email= req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;
  var message_tosend=`name:- ${your_name}\nmail:- ${email}\nmessage:- ${message}`;
  sendmail(subject, message_tosend);
  res.render('success.ejs')
});
var port = process.env.PORT || 8080;
app.listen(port, () => console.log(`app listening on port ${3000}!`))
