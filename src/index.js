const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    request.username = username;
    return next();
  }

  return response.status(400).json({
    error: "User not found",
  });
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userOperation = {
    name,
    username,
    uuid: uuidv4(),
    todos: [],
  };

  users.push(userOperation);

  return response.status(201).json();
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.username;

  const userData = users.find((user) => user.username === username);

  return response.status(200).json(userData.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
