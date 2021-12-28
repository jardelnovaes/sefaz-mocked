const EnvelopeUtil = require('./envelopeUtil.js');
const envelopeUtil = new EnvelopeUtil();

class ResponseProcessor {

    autorizar(req, res) {
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
      
      denegar(req, res) {
        var msgToReturn = envelopeUtil.getEnvelopeAutorizacaoDenegada();
        console.log(`>> ${msgToReturn}`);
        res.send(msgToReturn);
      }
      
      
      inutilizar(req, res) {
        var content = "";
        req.on('data', chunk => {    
            content += chunk;    
        });
        
        req.on('end', chunk => {          
          var inutInfo = envelopeUtil.extractInutilizacaoInfo(content);          
          var msgToReturn = envelopeUtil.getEnvelopeInutilizacaoAutorizada(inutInfo);
          console.log(`>> ${msgToReturn}`);
          res.send(msgToReturn);
        });
      }
}

module.exports = ResponseProcessor