const express = require('express');
const serverless = require('serverless-http');
const app = express();
const { MongoClient } = require('mongodb');
const router = express.Router();

//Get all students
router.get('/', (req, res) => {
  res.send('App is running..');
});

router.get('/:userid/accept',(req,res) => {
  const userId = req.params.userid;

  res.send(`User Id: ${userId} has accepted`);
})

router.get('/:userid/snooze',(req,res) => {
  const userId = req.params.userid;

  res.send(`User Id: ${userId} has snooze`);
})



//showing demo records
router.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Smith',
      email: 'smith@gmail.com',
    },
    {
      id: '002',
      name: 'Sam',
      email: 'sam@gmail.com',
    },
    {
      id: '003',
      name: 'lily',
      email: 'lily@gmail.com',
    },
  ]);
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
