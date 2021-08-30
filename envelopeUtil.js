const xml_message_id = "%%XML_MESSAGE%%";
const dates_id = "%%DATE%%";
const access_key_id = "%%ACCESS_KEY%%";
const envolope_autorizacao = `<?xml version='1.0' encoding='utf-8'?><env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope"><env:Body><nfeResultMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">%%XML_MESSAGE%%</nfeResultMsg></env:Body></env:Envelope>`;
const xml_denegado = '<retEnviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><cStat>205</cStat><xMotivo>NF-e esta denegada na base de dados da SEFAZ. [nRec:921000000100005]</xMotivo><cUF>41</cUF><dhRecbto>%%DATE%%</dhRecbto></retEnviNFe>';
const xml_autorizado = '<retEnviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><cStat>104</cStat><xMotivo>Lote processado</xMotivo><cUF>41</cUF><dhRecbto>%%DATE%%</dhRecbto><protNFe versao="4.00"><infProt Id="ID110000000000011"><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><chNFe>%%ACCESS_KEY%%</chNFe><dhRecbto>2021-08-30T13:34:25-03:00</dhRecbto><nProt>110000000000011</nProt><digVal>IMaM7afF7W3tHukLAIvEd4DNt0w=</digVal><cStat>100</cStat><xMotivo>Autorizado o uso da NF-e</xMotivo></infProt></protNFe></retEnviNFe>';
const access_key_regEx =/([<]infNFe).*?(Id=).*?(\d+)/g;

class EnvelopeUtil {
  getEnvelopeAutorizacao(xmlMessage, accessKey) {
    if (!accessKey) {
      accessKey = "41210884683481035710550020000005261394241660"; //fake
    }
    return envolope_autorizacao.replace(xml_message_id, xmlMessage)
                               .replace(dates_id, new Date().toISOString())
                               .replace(access_key_id, accessKey);
  }

  getEnvelopeAutorizacaoDenegada() {
    return this.getEnvelopeAutorizacao(xml_denegado);
  }

  getEnvelopeAutorizacaoAutorizada(accessKey) {
    return this.getEnvelopeAutorizacao(xml_autorizado, accessKey);
  }

  extractAccessKey(text) {
    var found = access_key_regEx.exec(text);
    return found ? found[3] : null;
  }

}

module.exports = EnvelopeUtil
