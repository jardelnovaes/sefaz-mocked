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
	
	rejeitar(req, res, cStat, xMotivo) {
		var accessKey = null;
		req.on('data', chunk => {
		  if (!accessKey) {
			accessKey = envelopeUtil.extractAccessKey(chunk);
			console.log(`Access key ${accessKey}`);
		  }
		});
		req.on('end', chunk => {
		  var msgToReturn = envelopeUtil.getEnvelopeAutorizacaoRejeitada(accessKey, cStat, xMotivo);
		  console.log(`>> ${msgToReturn}`);
		  res.send(msgToReturn);
		});
	}

	rejeitarEvento(req, res, cStat, xMotivo) {
		var content = "";
		req.on('data', chunk => {    
			content += chunk;    
		});

		req.on('end', chunk => {          
		  var eventoInfo = envelopeUtil.extractEventoInfo(content);          
		  var msgToReturn = envelopeUtil.getEnvelopeRetornoEvento(eventoInfo, cStat || '999', xMotivo || 'Erro Generico');
		  console.log(`>> ${msgToReturn}`);
		  res.send(msgToReturn);
		});

	}

	autorizarEvento(req, res) {
		var content = "";
		req.on('data', chunk => {    
			content += chunk;    
		});

		req.on('end', chunk => {          
		  var eventoInfo = envelopeUtil.extractEventoInfo(content);          
		  var msgToReturn = envelopeUtil.getEnvelopeRetornoEventoAutorizado(eventoInfo);
		  console.log(`>> ${msgToReturn}`);
		  res.send(msgToReturn);
		});
	}
}

module.exports = ResponseProcessor