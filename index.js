const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const signUpForm = require("./Models/signup");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//BODY PARSER
app.use(express.json());
app.use(cors());

const DBURI =
  "mongodb+srv://shaikh99mubashir:admin@cluster0.6jaumrt.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DBURI)
  .then((res) => console.log("DB Connected"))
  .catch((error) => console.log("error", error));



// Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await signUpForm.findOne({ email })
  .then((response)=>{
    const isMatch =  bcrypt.compare(password, response.password);
    if(isMatch){
      res.json({
        message: "Sign In Successfully",
        status: true,
      });
    }
    else{
      res.json({
        message: "password Not Correct",
        status: false,
      });
    }
  })
  .catch((error)=>{
    console.log('error',error);
    res.json({
      message: "Email Not Correct",
      status: false,
    });
  })
});

// Signup Api
app.post("/signup", async (request, response) => {
  const { first_name, phone_number, email, password, is_approved } =
 request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await signUpForm.findOne({ email: email });
  if (existingUser) {
    return response.json({
      message: "Email already exists",
      status: false,
    });
  }

  const objToSend = {
    first_name: first_name,
    phone_number: phone_number,
    email: email,
    password: hashedPassword.toString(),
    is_approved: is_approved,
  };

  signUpForm
    .create(objToSend)
    .then((data) => {
      response.json({
        message: "Sign Up Successfully",
        data: data,
        status: true,
      });
    })
    .catch((error) => {
      response.json({
        message: `Internal error: ${error}`,
        status: false,
      });
    });
});

app.listen(PORT, () =>
  console.log(`SERVER RUNNING on http://localhost:${PORT}`)
);
