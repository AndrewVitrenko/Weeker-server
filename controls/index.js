const express = require('express');
const router = express.Router();

router.get('/*', (req, res) => {
  res.send('got simple request on endpoint - ' + req.path);
});

module.exports = router;
