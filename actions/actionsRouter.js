const express = require('express');

const Actions = require('./../data/helpers/actionModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const actions = await Actions.get();
    res.status(200).json({ success: true, actions})
  } catch {
    res.status(500).json({ success: false, error: 'Unable to get actions'})
  }
})

router.get('/:id', validateID, async (req, res) => {
  res.status(200).json(req.action);
})

router.post('/', validateBody, async (req, res) => {
  try {
    const action = await Actions.insert(req.body);
    res.status(201).json({ success: true, action })
  } catch {
    res.status(500).json({ success: false, error: 'Unable to post new action to database.' })
  }
})

router.put('/:id', validateID, validateBody, async (req, res) => {
  const { id } = req.params;
  try {
    const action = await Actions.update(id, req.body)
    res.status(200).json({ success: true, action })
  } catch {
    res.status(500).json({ success: false, error: 'Unable to update action.' })
  }
})

router.delete('/:id', validateID, async (req, res) => {
  const { id } = req.params;
  try {
    const action = await Actions.remove(id)
    if(action > 0){
      res.status(200).json({ success: true, message: `Action ${ id } was successfully deleted` })
    } else {
      res.status(404).json({ success: false, error: `Unable to find action with id: ${ id }` })
    }
  } catch {
    res.status(500).json({ success: false, error: 'Unable to delete action.' })
  }
})

async function validateID(req, res, next) {
  const { id } = req.params;
  try {
    const action = await Actions.get(id);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ success: false, error: `The action with id of ${ id } does not exist.` });
    }
  } catch {
    res.status(500).json({ success: false, error: 'Unable to retrieve action information.' });
  }
}

async function validateBody(req, res, next) {
  const { project_id, description, notes } = req.body;
  try {
    if (Object.entries(req.body).length === 0) {
      res.status(400).json({ success: false, error: 'Body data not found.' });
    } else if (!project_id || !description || !notes) {
      res.status(400).json({ success: false, error: 'Project ID, Description and Notes are all required.' });
    } else {
      next();
    }
  } catch {
    res.status(500).json({ success: false, error: 'Unable to retrieve action information.' });
  }
}
module.exports = router;