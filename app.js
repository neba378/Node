const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const Fname = req.body.fName;
  const Lname = req.body.lName;
  const Email = req.body.email;
  const data = {
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: Fname,
          LNAME: Lname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/fb26e01499";
  const options = {
    method: "POST",
    auth: "nebati:c774ca3edc3763dfea14367d65d2b45c-us21",
  };
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.get("/signed", function (req, res) {
  res.send("come on you did it!");
});

// mailchimp.com api key = a199a487be0e8d6e324d04652cc7b365-us21

// mailchimp: list id = fb26e01499
app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
