function GET_INFO_FROM_FINZVIZ(ticker) {
  var url = "https://finviz.com/quote.ashx?t=" + ticker;
  var options = {
    muteHttpExceptions: true,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  
  var rsiMatch = html.match(/RSI \(14\).*?>(\d+\.\d+)</);
  
  var $ = Cheerio.load(response.getContentText());

  const dividendText = $('body > div.content > div.ticker-wrapper.gradient-fade > div:nth-child(5) > table > tbody > tr > td > div > table:nth-child(1) > tbody > tr > td > div.screener_snapshot-table-wrapper.js-snapshot-table-wrapper > table > tbody > tr:nth-child(11) > td:nth-child(2) > a > b > small').text().trim();


  // Extraés solo el segundo porcentaje (5Y)
  const match = dividendText.match(/[\d.,]+%\s+([\d.,]+)%/);

  const growth5Y = match ? parseFloat(match[1].replace(',', '.')) / 100 : null;

  Logger.log(growth5Y); // 

  return {rsi: parseFloat(rsiMatch[1]) , growth5Y : growth5Y};
}
