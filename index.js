import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import env from "dotenv";

env.config();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) =>{
    res.render("index.ejs");
});

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
  
    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: process.env.PORT,
        secure: true, 
        auth: {
          user: "juan.basilio.orozco@gmail.com",
          pass: process.env.PASSWORD,
        },
      });
      
    transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
    });
  

      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: email,
            to: 'juan.basilio.orozco@gmail.com', // The email where you want to receive the messages
            subject: `Message from ${name}`,
            text: message + " | Sent from: " + email,
        });
        res.redirect('/');
        console.log("Message sent: %s", info.messageId);
      }
      main().catch(console.error);
  });

  app.get("/projects", (req, res) =>{
    res.render("partials/projects.ejs");
});

app.get("/contact", (req, res) =>{
    res.render("partials/contactMe.ejs");
});

app.get("/about", (req, res) =>{
    res.redirect("/");
});

app.get("/sources", (req, res) =>{
  res.render("partials/sources.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
