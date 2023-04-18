const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const signUpForm = require("./Models/signup");
const branchesModal = require("./Models/addBranches");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
//BODY PARSER
app.use(express.json());
app.use(cors());
const upload = multer({ dest: 'uploads/' }); // specify the directory to store the uploaded files
const DBURI =
  "mongodb+srv://shaikh99mubashir:admin@cluster0.6jaumrt.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DBURI)
  .then((res) => console.log("DB Connected"))
  .catch((error) => console.log("error", error));

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  signUpForm
    .findOne({ email })
    .then(async (response) => {
      console.log("response", response);
      console.log("response.password", response.password);
      const isMatch = await bcrypt.compare(password, response.password);
      console.log("isMatch", isMatch);
      if (isMatch) {
        res.json({
          message: "Sign In Successfully",
          status: true,
        });
      } else {
        res.json({
          message: "Password Not Correct",
          status: false,
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
      res.json({
        message: "Email Not Correct",
        status: false,
      });
    });
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

// ADD Branches
app.post("/api/branches", (request, response) => {
  const body = request.body;
  console.log("Body", body);
  const objToSend = {
    branch: body.branch,
  };
  branchesModal
    .create(objToSend)
    .then((data) => {
      response.json({
        message: "Branch ADD SUCCESSFULLY",
        branch: data,
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

// GET Branch
app.get("/api/branches", (request, response) => {
  branchesModal
    .find({})
    .then((data) => {
      response.json({
        message: "SUCCESSFULLY Get",
        branch: data,
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

// Delete Branch
app.delete("/api/branches/:id", (request, response) => {
  const { id } = request.params;
  console.log("id", id);
  branchesModal
    .findByIdAndDelete(id)
    .then((data) => {
      response.json({
        message: "SUCCESSFULLY Deleted",
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

// Edit Branch
app.put("/api/branches", (request, response) => {
  const body = request.body;
  console.log('body',body);
  const objToSend = {
    branch: body.branch,
  };
  branchesModal
    .findByIdAndUpdate(body.id, objToSend)
    .then((data) => {
      response.json({
        message: "SUCCESSFULLY Update",
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

// Upload image
// route for handling image uploads
app.post('/upload', upload.single('image'), async (req, res) => {
  const { filename, mimetype, path } = req.file;
  const image = { filename, mimetype, path };
  const result = await client.db('mydb').collection('images').insertOne(image);
  const imageUrl = `http://localhost:5000/images/${result.insertedId}`;
  res.json({ imageUrl });
});

app.listen(PORT, () =>
  console.log(`SERVER RUNNING on http://localhost:${PORT}`)
);
