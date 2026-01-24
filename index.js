import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import env from "dotenv";
import axios from "axios";

env.config();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) =>{
    res.render("index.ejs");
});

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    const recaptchaResponse = req.body['g-recaptcha-response']; // Grabs the token from the form
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;


    // 1. Check if the captcha was even attempted
    if (!recaptchaResponse) {
        return res.status(400).send("Please complete the reCAPTCHA.");
    }

    try {
        // 2. Verify with Google's API
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
        const response = await axios.post(verifyUrl);

        if (!response.data.success) {
            return res.status(400).send("reCAPTCHA verification failed. Are you a bot?");
        }


    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: process.env.SMTP_PORT,
        secure: true, 
        auth: {
          user: "juan.basilio.orozco@gmail.com",
          pass: process.env.PASSWORD,
        },
      });
      
  
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: email,
            to: 'juan.basilio.orozco@gmail.com', // The email where you want to receive the messages
            subject: `Message from ${name}`,
            text: message + " | Sent from: " + email,
        });
        res.redirect('/?success=true');
        console.log("Message sent: %s", info.messageId);
      }
            catch (error) { 
        console.error("Server Error:", error);
        res.status(500).send("Something went wrong on our end.");
    }

  });

  app.get("/projects", (req, res) =>{
        res.render("partials/projects.ejs");
});

app.get("/contact", (req, res) =>{
    res.render("partials/contactMe.ejs", {
      siteKey: process.env.RECAPTCHA_SITE_KEY

    });
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