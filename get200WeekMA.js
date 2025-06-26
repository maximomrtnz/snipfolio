/**
 * Retrieves the 200-week moving average of the closing prices for a given stock symbol.
 *
 * @param {string} symbol The stock symbol for which to calculate the 200-week moving average.
 * @return {number|null} The 200-week moving average of closing prices, or null if an error occurs.
 * @customfunction
 */
function GET200WEEKMA(symbol) {
  // Check if data is cached
  var cache = CacheService.getScriptCache();
  var cachedData = cache.get(symbol + '_200_WEEK_MA');
  if (cachedData !== null) {
    return parseFloat(cachedData);
  }
  
  // Fetch historical prices from Yahoo Finance
  var url = "https://query1.finance.yahoo.com/v7/finance/chart/" + symbol + "?range=2y&interval=1wk";

  var options = {
    muteHttpExceptions: true,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  };

  Logger.log(url);
  var response = UrlFetchApp.fetch(url,options);
  Logger.log(response);
  var data = JSON.parse(response.getContentText());
  
  // Extract closing prices for the last 200 weeks
  var prices = data.chart.result[0].indicators.quote[0].close.slice(-200);
  
  // Calculate the average of the last 200 weekly closing prices
  var sum = prices.reduce((a, b) => a + b, 0);
  var average = sum / prices.length;
  
  // Cache the result
  cache.put(symbol + '_200_WEEK_MA', average.toString());
  
  return average;
}
