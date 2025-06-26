/**
 * GETFIVEYEARAVERAGEDIVIDENDYIELD
 * 
 * This function fetches the 5-year average dividend yield for a given stock symbol from Yahoo Finance,
 * parses the fetched HTML content to extract the yield, and converts it from text to a floating-point number.
 * 
 * @param {string} symbol - The stock symbol to retrieve the 5-year average dividend yield for.
 * @returns {number} The 5-year average dividend yield as a floating-point number.
 */
function GETFIVEYEARAVERAGEDIVIDENDYIELD(symbol) {
  // Fetch the content from Yahoo Finance
  var url = 'https://finance.yahoo.com/quote/' + symbol + '/key-statistics/';

  Logger.log(url);

  var options = {
    muteHttpExceptions: true,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  };
  var response = UrlFetchApp.fetch(url,options).getContentText();


  // Load the response using Cheerio
  const $ = Cheerio.load(response);

  // Get the text of the dividend yield
  var yieldText = $('#nimbus-app > section > section > section > article > article > div > section:nth-child(2) > div > section:nth-child(3) > table > tbody > tr:nth-child(5) > td.value.yf-vaowmx').text().trim();

  Logger.log(yieldText);

  // Remove any commas from the text
  yieldText = yieldText.replace(/,/g, '');

  Logger.log(yieldText);

  // Convert the text to a floating-point number
  var yieldNumber = parseFloat(yieldText);

  // Return the numerical value
  return yieldNumber/100;
}

GETFIVEYEARAVERAGEDIVIDENDYIELD('CVX')
