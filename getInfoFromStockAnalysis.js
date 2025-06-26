/**
 * Retrieves the dividend amount for a given stock symbol from Yahoo Finance.
 *
 * @param {string} symbol The stock symbol for which to fetch the dividend information.
 * @return {number|null} The dividend amount, or null if not found or an error occurs.
 * @customfunction
 */
function GETINFORMATIONFROMSTOCKANALYSIS(symbol) {

  if(!symbol){
    return {};
  }
  
  // Construct the URL to fetch the summary page for the given symbol
  var url = 'https://stockanalysis.com/stocks/'+symbol+'/dividend/';

  // Fetch the content from the URL
  var response = UrlFetchApp.fetch(url).getContentText();
  
  // // Load the fetched HTML content using Cheerio
  const $ = Cheerio.load(response);
  
  // // Use a CSS selector to find the specific span containing the Dividend Yield
   var dividendAmountText = $('#main > div.wrsb.mt-3.py-1.sm\\:mt-4 > div > div.mt-6.grid.grid-cols-2.gap-3.px-1.text-base.bp\\:mt-7.bp\\:text-lg.sm\\:grid-cols-3.sm\\:gap-6.sm\\:px-4.sm\\:text-xl > div:nth-child(2) > div').text();

    // Use a CSS selector to find the specific table cell containing the Dividend Yield
  var dividendYieldText = $('#main > div.wrsb.mt-3.py-1.sm\\:mt-4 > div > div.mt-6.grid.grid-cols-2.gap-3.px-1.text-base.bp\\:mt-7.bp\\:text-lg.sm\\:grid-cols-3.sm\\:gap-6.sm\\:px-4.sm\\:text-xl > div:nth-child(1) > div').text();
  
  // Remove the '%' character and convert the text to a decimal number
  var dividendYield = parseFloat(dividendYieldText.trim().replace('%', '')) / 100;

  // // Remove the '$' character and convert the text to a decimal number
  var dividendAmount = parseFloat(dividendAmountText.trim().replace('$', ''));

  Logger.log('Dividend Yield: ' + dividendYield);

  Logger.log('Dividend Amount: ' + dividendAmount);
  
  
  // // Return the decimal number
  return {
    dividendAmount : dividendAmount,
    dividendYield : dividendYield
  };

}
