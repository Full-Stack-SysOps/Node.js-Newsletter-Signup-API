const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res)=>{
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const mail = req.body.email;
  
    const formData = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }
    const jsonData = JSON.stringify(formData)

    var url = "https://us10.api.mailchimp.com/3.0/lists/848c647701"
    var options ={
        method: "POST",
        auth: "signup-key:e3e02819d59ce915dfd45bf67d70fda0-us10"
    }
    const request = https.request(url, options, (response)=>{
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (d)=>{
            console.log(JSON.parse(d));
        })

    })
    request.write(jsonData);
    request.end();

})

app.listen(process.env.PORT || 3000, (req, res)=>{
    console.log("Server started on port 3000")
})

