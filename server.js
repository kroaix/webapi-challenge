const express = require('express');

const projectsRouter = require('./projects/projectsRouter.js');
const actionsRouter = require('./actions/actionsRouter.js');

const server = express();

server.use(express.json());

server.use(logger);

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
  res.send(`<h1>WebAPI Challenge</h1>`);
});

function logger(req, res, next) {
  console.log(`${req.method} to ${req.url}`);
  next();
}

module.exports = server;
