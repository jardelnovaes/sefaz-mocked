const xml_message_id = "%%XML_MESSAGE%%";
const dates_id = "%%DATE%%";
const access_key_id = "%%ACCESS_KEY%%";
const uf_id = "%%UF%%";
const ano_id = "%%ANO%%";
const cnpj_id = "%%CNPJ%%";
const mod_id = "%%MOD%%";
const serie_id = "%%SERIE%%";
const nf_ini_id = "%%NFINI%%";
const nf_fin_id = "%%NFFIN%%";
const cstat_id = "%%CSTAT%%";
const xmotivo_id = "%%XMOTIVO%%";

const envolope_autorizacao = `<?xml version='1.0' encoding='utf-8'?><env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope"><env:Body><nfeResultMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">%%XML_MESSAGE%%</nfeResultMsg></env:Body></env:Envelope>`;

const xml_denegado = '<retEnviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><cStat>104</cStat><xMotivo>Lote processado</xMotivo><cUF>41</cUF><dhRecbto>%%DATE%%</dhRecbto><protNFe versao="4.00"><infProt Id="ID141210000744327"><tpAmb>2</tpAmb><verAplic>PR-v4_7_36</verAplic><chNFe>%%ACCESS_KEY%%</chNFe><dhRecbto>%%DATE%%</dhRecbto><nProt>990010000000123</nProt><digVal>i4/BkJJUFQFvbvRZJsH7zsHIz0w=</digVal><cStat>302</cStat><xMotivo>Uso Denegado : Irregularidade fiscal do destinatario</xMotivo></infProt></protNFe></retEnviNFe>';

const xml_autorizado = '<retEnviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><cStat>104</cStat><xMotivo>Lote processado</xMotivo><cUF>41</cUF><dhRecbto>%%DATE%%</dhRecbto><protNFe versao="4.00"><infProt Id="ID110000000000011"><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><chNFe>%%ACCESS_KEY%%</chNFe><dhRecbto>%%DATE%%</dhRecbto><nProt>110000000000011</nProt><digVal>IMaM7afF7W3tHukLAIvEd4DNt0w=</digVal><cStat>100</cStat><xMotivo>Autorizado o uso da NF-e</xMotivo></infProt></protNFe></retEnviNFe>';

const xml_inutilizacao = '<retInutNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><infInut><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><cStat>102</cStat><xMotivo>Inutilizacao de numero homologado</xMotivo><cUF>%%UF%%</cUF><ano>%%ANO%%</ano><CNPJ>%%CNPJ%%</CNPJ><mod>%%MOD%%</mod><serie>%%SERIE%%</serie><nNFIni>%%NFINI%%</nNFIni><nNFFin>%%NFFIN%%</nNFFin><dhRecbto>%%DATE%%</dhRecbto><nProt>990000000110111</nProt></infInut></retInutNFe>';

const xml_rejeitado = '<retEnviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><tpAmb>2</tpAmb><verAplic>SefazMockedService</verAplic><cStat>%%CSTAT%%</cStat><xMotivo>%%XMOTIVO%%</xMotivo><cUF>41</cUF><dhRecbto>>%%DATE%%</dhRecbto></retEnviNFe>'

const access_key_regEx =/([<]infNFe).*?(Id=).*?(\d+)/g;
const inut_info_part1_regEx =/(<cUF>)(.*?)(<\/cUF>).*?(<ano>)(\d+)(<\/ano>).*?(<CNPJ>)(\d+)(<\/CNPJ>).*?(<mod>)(\d+)(<\/mod>)/g;
const inut_info_part2_regEx =/(<serie>)(.*?)(<\/serie>).*?(<nNFIni>)(\d+)(<\/nNFIni>).*?(<nNFFin>)(\d+)(<\/nNFFin>)/g;

class EnvelopeUtil {

  getBasicEnvelope(xmlMessage) {
    return envolope_autorizacao.replace(xml_message_id, xmlMessage)
                               .replaceAll(dates_id, new Date().toISOString());
  }

  getEnvelopeAutorizacao(xmlMessage, accessKey) {
    if (!accessKey) {
      accessKey = "41210884683481035710550020000005261394241660"; //fake
    }
    return this.getBasicEnvelope(xmlMessage).replaceAll(access_key_id, accessKey);
  }

  getEnvelopeAutorizacaoDenegada() {
    return this.getEnvelopeAutorizacao(xml_denegado);
  }

  getEnvelopeAutorizacaoAutorizada(accessKey) {
    return this.getEnvelopeAutorizacao(xml_autorizado, accessKey);
  }

  getEnvelopeAutorizacaoRejeitada(accessKey, cStat, xMotivo) {
    if (!cStat) cStat = "999";
    if (!xMotivo) xMotivo = "Erro desconhecido";

    return this.getEnvelopeAutorizacao(xml_rejeitado).replace(cstat_id, cStat)
                                                     .replace(xmotivo_id, xMotivo);
  }


  getEnvelopeInutilizacaoAutorizada(inutInfo) {
    return this.getBasicEnvelope(xml_inutilizacao).replace(uf_id, inutInfo.uf || '41')
                                                  .replace(ano_id, inutInfo.ano || '21')
                                                  .replace(cnpj_id, inutInfo.cnpj || '10000000000001')
                                                  .replace(mod_id, inutInfo.mod || '55')
                                                  .replace(serie_id, inutInfo.serie || '1')
                                                  .replace(nf_ini_id, inutInfo.nfIni || '123')
                                                  .replace(nf_fin_id, inutInfo.nfFin || '123');

  }

  extractAccessKey(text) {
    var found = access_key_regEx.exec(text);
    return found ? found[3] : null;
  }

  extractInutilizacaoInfo(text) {
    var inutInfo = {};

    var found = inut_info_part1_regEx.exec(text);
    if (found) {
      inutInfo["uf"] = found[2];
      inutInfo["ano"] = found[5];
      inutInfo["cnpj"] = found[8];
      inutInfo["mod"] = found[11];
    }

    found = inut_info_part2_regEx.exec(text);
    if (found) {
      inutInfo["serie"] = found[2];
      inutInfo["nfIni"] = found[5];
      inutInfo["nfFin"] = found[8];
    }
    console.log(inutInfo);
    return inutInfo;
  }

}

module.exports = EnvelopeUtil
