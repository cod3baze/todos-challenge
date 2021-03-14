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
  const user = users.find((user) => user.username === username);

  if (userAlreadyExists) {
    request.username = username;
    request.user = user;
    return next();
  }

  return response.status(400).json({
    error: "User not found",
  });
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({
      error: "User already exists",
    });
  }

  const userOperation = {
    name,
    username,
    id: uuidv4(),
    todos: [],
  };

  users.push(userOperation);

  return response.status(201).json(userOperation);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;

  const userData = users.find((user) => user.username === username);

  return response.status(200).json(userData.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;

  const todoOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  users.find((user) => {
    if (user.username === username) {
      return user.todos.push(todoOperation);
    }

    return;
  });

  return response.status(201).json(todoOperation);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "TODOS not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "TODOS not found" });
  }

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "TODOS not found" });
  }

  user.todos.splice(todo, 1);

  return response.status(204).json();
});

module.exports = app;
