const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let requestsCounter = 0;

//MIDDLEWARES
function logNumberOfRequests(req, res, next) {
  requestsCounter++;
  console.log(`${requestsCounter} request's so far!`);
  next();
}
server.use(logNumberOfRequests);

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;
  const existentProject = projects.find(project => project.id === id);
  if (!existentProject) {
    return res.status(400).json({ error: "Project not found!" });
  }
  next();
}

//GET METHODS
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//PUT METHODS
server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectFind = projects.find(project => project.id === id);
  projectFind.title = title;
  return res.json({ mensagem: "Project title sucessfully updated!" });
});

//DELETE METHODS
server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const idxProjectFind = projects.findIndex(project => project.id === id);
  projects.splice(idxProjectFind, 1);
  return res.json({ mensagem: `Project of id ${id} was sucessfully removed!` });
});

//POST METHODS
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json({ mensagem: "Project registered successfully!" });
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectFind = projects.find(project => project.id === id);
  projectFind.tasks.push(title);
  return res.json({ mensagem: `Task for project of id ${id} added!` });
});

server.listen(3000);
