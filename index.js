const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const request = require("request");
const nodemailer = require('nodemailer');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const https = require('https');
const { json } = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var parsed=[];

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

 


app.get('/',async function (req, ress) {

  await https.get('https://portfolio-data-da5da-default-rtdb.firebaseio.com/projects.json',async res=>{
    let body =[];
    res.on('data', chunk => {
      body.push(chunk);
    });
    res.on('end', async() => {
      parsed =await JSON.parse(Buffer.concat(body));
      ress.render('home.ejs', { projects:parsed})
    })
  });
});

app.get('/projects/:project', function(req, ress) {
  const req_project = _.lowerCase(req.params.project);
  
  https.get('https://portfolio-data-da5da-default-rtdb.firebaseio.com/projects.json',async res=>{
    let body =[];
    res.on('data', chunk => {
      body.push(chunk);
    });
    res.on('end', async() => {
      parsed =await JSON.parse(Buffer.concat(body));
      parsed.forEach( function (project){
        const currentProject =_.lowerCase(project.title)
        if(req_project==currentProject){
            ress.render('project-details.ejs',{project:project})
        }
      });
    })
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
app.listen(port, () => console.log(`app listening on port ${port}!`))
