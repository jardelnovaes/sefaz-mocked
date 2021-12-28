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



function timeout(req, res) {
  var msg = `Received: ${req.body}`;
  console.log(msg);

  req.setTimeout(70000, function() {
     res.send(`Mocked service Sefaz Timeout!\n${msg}\n`)
  });
}

app.get(['/', '/health'], (req, res) => {
  res.send('Mocked service is healthy!');
})

app.post('/sefaz-mocked-timeout', (req, res) => {
  timeout(req, res);
})

app.post('/NFeAutorizacao4', (req, res) => {
  var action = process.env.NFE_AUTORIZACAO_RESULT || "0";
  console.log(`NFeAutorizacao4 >> Action ${action}`)
  switch(action) {
    case "1":
        responseProcessor.denegar(req, res);
        break;

    case "2":
        timeout(req, res);
        break;

    case "3":
        var cStat = process.env.NFE_CSTAT || "999";
        var xMotivo = process.env.NFE_XMOTIVO || "Erro desconhecido";
		    console.log(`cStat: ${cStat} - xMotivo: ${xMotivo}`);
        responseProcessor.rejeitar(req, res, cStat, xMotivo);
        break;

    default:
        responseProcessor.autorizar(req, res);
  }

});

app.post('/sefaz-mocked-autorizar', (req, res) => responseProcessor.autorizar(req, res))

app.post('/sefaz-mocked-denegar', (req, res) => responseProcessor.denegar(req, res))

app.post(['/NFeInutilizacao4', '/sefaz-mocked-inutilizar'], (req, res) => responseProcessor.inutilizar(req, res))

app.listen(port, () => console.log(`Sefaz mocked services is running at http://localhost:${port}`))
