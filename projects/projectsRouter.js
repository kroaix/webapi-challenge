const express = require('express');

const Projects = require('./../data/helpers/projectModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Projects.get();
    res.status(200).json({ success: true, projects})
  } catch {
    res.status(500).json({ success: false, error: 'Unable to get projects.'})
  }
})

router.get('/:id', validateID, async (req, res) => {
  res.status(200).json(req.project);
})

router.post('/', validateBody, async (req, res) => {
  try {
    const project = await Projects.insert(req.body)
    res.status(201).json({ success: true, project })
  } catch {
    res.status(500).json({ success: false, error: 'Unable to post new project to database.' })
  }
})

router.put('/:id', validateID, validateBody, async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Projects.update(id, req.body)
    res.status(200).json({ success: true, project })
  } catch {
    res.status(500).json({ success: false, error: 'Unable to update project.' })
  }
})

router.delete('/:id', validateID, async(req, res) => {
  const { id } = req.params;
  try {
    const project = await Projects.remove(id)
    if(project > 0){
      res.status(200).json({ success: true, message: `Project ${ id } was successfully deleted` })
    } else {
      res.status(404).json({ success: false, error: `Unable to find project with id: ${ id }` })
    }
  } catch {
    res.status(500).json({ success: false, error: 'Unable to delete project.' })
  }
})

async function validateID(req, res, next){
  const { id } = req.params;
  try {
    const project = await Projects.get(id);
    if(project){
      req.project = project;
      next();
    } else {
      res.status(404).json({ success: false, error: `The project with id of ${ id } does not exist.` })
    } 
    } catch {
      res.status(500).json({ success: false, error: 'Unable to retrieve project information.' })
  }
}

async function validateBody(req, res, next){
  const { name, description } = req.body;
  try {
    if(Object.entries(req.body).length === 0){
      res.status(400).json({ success: false, error: 'Body data not found.' })
    } else if(!name || !description) {
      res.status(400).json({ success: false, error: 'Name and Description are both required.' })
    } else {
      next();
    }
  } catch {
    res.status(500).json({ success: false, error: 'Unable to retrieve project information.' })
  }
}

module.exports = router;