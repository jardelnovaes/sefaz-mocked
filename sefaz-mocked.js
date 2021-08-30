const express = require('express');
const EnvelopeUtil = require('./envelopeUtil.js');
const app = express();
const port = 3002;
const envelopeUtil = new EnvelopeUtil();
require('dotenv').config()

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get(['/', '/health'], (req, res) => {
  res.send('Mocked service is healthy!');
})

app.post('/sefaz-mocked-timeout', (req, res) => {
  var msg = `Received: ${req.body}`;
  console.log(msg);
  
  //res.status(404).send('Not found');
  setTimeout(function() {
    res.send(`Mocked service Sefaz Timeout!\n${msg}\n`)
  }, 70000);
  res.send(`Mocked service Sefaz Timeout!\n${msg}\n`);
})

app.post('/NFeAutorizacao4', (req, res) => {
  var action = process.env.NFE_AUTORIZACAO_RESULT;
  console.log(`NFeAutorizacao4 >> Action ${action}`)
  if (action == 1) {
    denegar(req, res);
  } else {
    autorizar(req, res);
  }
});

app.post('/sefaz-mocked-autorizar', (req, res) => autorizar(req, res))

app.post('/sefaz-mocked-denegar', (req, res) => denegar(req, res))

app.post(['/NFeInutilizacao4', '/sefaz-mocked-inutilizar'], (req, res) => {
  console.log(`<< ${req.body}`);
  var msgToReturn = "IMPLEMENTAR";
  console.log(`>> ${msgToReturn}`);
  res.send(msgToReturn);
})

app.listen(port, () => {
  console.log(`Sefaz mocked services is runnings at http://localhost:${port}`);
  console.log(`NODE ENV: ${process.env.NODE_ENV} ${process.env.NFE_AUTORIZACAO_RESULT}`);
})


function autorizar(req, res) {
  var accessKey = null;
  req.on('data', chunk => {
    if (!accessKey) {
      accessKey = envelopeUtil.extractAccessKey(chunk);
      console.log(`Access key ${accessKey}`);
    }
  });
  req.on('end', chunk => {
    var msgToReturn = envelopeUtil.getEnvelopeAutorizacaoAutorizada(accessKey);
    console.log(`>> ${msgToReturn}`);
    res.send(msgToReturn);
  });
}

function denegar(req, res) {
  var msgToReturn = envelopeUtil.getEnvelopeAutorizacaoDenegada();
  console.log(`>> ${msgToReturn}`);
  res.send(msgToReturn);
}
