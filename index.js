const express = require("express");

const server = express();

server.use(express.json());

const port = 3000;

let countRequests = 0;
const projects = [];

//Middlewares
function logOfRequests(req, res, next) {
  countRequests++;

  console.log(`Quantidade de requisições: ${countRequests}`);

  return next();
}

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

server.use(logOfRequests);

// GET
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// POST criando projetos
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  // const project = {
  //   "id": "1",
  //   "title": "Novo projeto",
  //   "tasks": "tarefa1"
  // }

  projects.push(project);

  return res.json(project);
});
// POST criando tarefas
server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { newTask } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(newTask);

  return res.json(project);
});
// PUT
server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});
// DELETE
server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);

  return res.send("Projeto deletado com sucesso!");
});

server.listen(port);
console.log(`Server running on the Port ${port}`);
