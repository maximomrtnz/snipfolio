/**
 * Fetches the years of dividend growth for a given stock symbol from StockAnalysis.
 *
 * @param {string} symbol - The stock symbol for which the years of dividend growth is to be fetched.
 * @return {number} - The number of years of dividend growth.
 */
function GETDIVIDENDGROWTHYEARS(symbol) {
  // Construct the URL to fetch the statistics page for the given symbol
  var url = 'https://stockanalysis.com/stocks/' + symbol + '/statistics/';
  
  // Fetch the content from the URL
  var response = UrlFetchApp.fetch(url).getContentText();
  
  // Load the fetched HTML content using Cheerio
  const $ = Cheerio.load(response);
  
  // Use a CSS selector to find the specific table cell containing the years of dividend growth
  var dividendGrowthYearsText = $('#main > div.space-y-5.xs\\:space-y-6.lg\\:grid.lg\\:grid-cols-3.lg\\:space-x-10.lg\\:space-y-0.mt-3\\.5 > div:nth-child(3) > div:nth-child(1) > table > tbody > tr:nth-child(4) > td.px-\\[5px\\].py-1\\.5.text-right.font-semibold.xs\\:px-2\\.5.xs\\:py-2').text();
  
  // Convert the text to a number
  var dividendGrowthYears = parseInt(dividendGrowthYearsText.trim());
  
  // Return the number of years
  return dividendGrowthYears;
}
