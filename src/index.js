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

  return response.status(201).json();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  users.find((user) => {
    if (user.username === username) {
      return user.todos.filter((todo) => {
        if (todo.id === id) {
          return (todo = {
            ...todo,
            title,
            deadline: new Date(deadline),
          });
        }
      });
    }

    return;
  });

  return response.status(202).json();
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  users.find((user) => {
    if (user.username === username) {
      return user.todos.filter((todo) => {
        if (todo.id === id) {
          return (todo = {
            ...todo,
            done: true,
          });
        }
      });
    }

    return;
  });

  return response.status(202).json();
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  users.find((user) => {
    if (user.username === username) {
      return user.todos.filter((todo) => {
        if (todo.id === id) {
          return (todo = {});
        }
      });
    }

    return;
  });

  return response.status(202).json();
});

module.exports = app;
