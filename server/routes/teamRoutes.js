const express = require('express');
const { updateTeamPoints } = require('../controllers/teamController');
const router = express.Router();

router.post('/update-points', updateTeamPoints);

module.exports = router;
