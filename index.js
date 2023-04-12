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

  signUpForm.findOne({ email })
    .then(async (response) => {
      console.log('response', response);
      console.log('response.password', response.password);
      const isMatch = await bcrypt.compare(password, response.password);
      console.log('isMatch', isMatch);
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
      console.log('error', error);
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

const Todo = mongoose.model('Todo', {
  title: String,
  description: String,
  completed: Boolean
});

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.sendStatus(204);
});

app.listen(PORT, () =>
  console.log(`SERVER RUNNING on http://localhost:${PORT}`)
);
