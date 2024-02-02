/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });

let userDataArray = [];

function handleSignup(req, res) {
  // const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  if (email && password && firstName && lastName) {
    const userExist = userDataArray.find((elem) => email === elem.email);

    // console.log(userExist);
    if (!userExist) {
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 10000);
      const randomId = `${timestamp}${randomNum}`;
      const userData = {
        id: randomId,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      userDataArray.push(userData);
      console.log("userData" + JSON.stringify(userDataArray));
      // res.status(201).json(userData)
      res.status(201).send("Signup successful");
    } else {
      res.status(400).json("User already exist");
    }
  } else {
    res.status(400).json("Please enter all your field");
  }
}
function handleLogin(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  console.log("Password" + password);
  if (email && password) {
    const findUser = userDataArray.find((elem) => elem.email === email);

    if (!findUser) {
      res.status(400).json(`UserName don't exist ,Please signup`);
    }
    const checkPassword = findUser.password === password;
    if (checkPassword) {
      res.status(200).json(findUser);
    } else {
      res.status(401).json("Please enter correct password");
    }
  } else {
    res.status(400).json("Please provide both your username and password");
  }
}

function handleData(req, res, next) {
  const email = req.headers.email;
  const password = req.headers.password;

  if (email && password) {
    const findUserName = userDataArray.find((elem) => elem.email === email);

    if (findUserName) {
      const checkPassword = findUserName.password == password;
      if (checkPassword) {
        // let allUserData=[]
        const users = userDataArray.map((user) => {
          return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        });

        res.status(200).json({ users });
      } else {
        res.status(401).json("Please enter correct password");
      }
    } else {
      res.status(401).json(`UserName don't exist ,Please signup`);
    }
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.post("/signup", handleSignup);

app.post("/login", handleLogin);
app.get("/data", handleData);
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
module.exports = app;
