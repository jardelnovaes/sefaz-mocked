const express = require('express');
const EnvelopeUtil = require('./envelopeUtil.js');
const ResponseProcessor = require('./responseProcessor.js');

const app = express();
const envelopeUtil = new EnvelopeUtil();
const responseProcessor = new ResponseProcessor();

require('dotenv').config()
const port = process.env.PORT || 3002;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get(['/', '/health'], (req, res) => {
  res.send('Mocked service is healthy!');
})

app.post('/sefaz-mocked-timeout', (req, res) => {
  var msg = `Received: ${req.body}`;
  console.log(msg);

  setTimeout(function() { res.send(`Mocked service Sefaz Timeout!\n${msg}\n`)}, 70000);
  res.send(`Mocked service Sefaz Timeout!\n${msg}\n`);
})

app.post('/NFeAutorizacao4', (req, res) => {
  var action = process.env.NFE_AUTORIZACAO_RESULT || 0;
  console.log(`NFeAutorizacao4 >> Action ${action}`)
  if (action == 1) {
    denegar(req, res);
  } else {
    autorizar(req, res);
  }
});

app.post('/sefaz-mocked-autorizar', (req, res) => responseProcessor.autorizar(req, res))

app.post('/sefaz-mocked-denegar', (req, res) => responseProcessor.denegar(req, res))

app.post(['/NFeInutilizacao4', '/sefaz-mocked-inutilizar'], (req, res) => responseProcessor.inutilizar(req, res))

app.listen(port, () => console.log(`Sefaz mocked services is runnings at http://localhost:${port}`))

