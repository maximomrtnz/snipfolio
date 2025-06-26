/**
 * Retrieves the Moving Average Convergence Divergence (MACD) for a given stock symbol.
 *
 * @param {string} symbol The stock symbol for which to calculate the MACD.
 * @return {number|null} The Moving Average Convergence Divergence (MACD), or null if an error occurs.
 * @customfunction
 */
function GETMACD(symbol) {
  // Check if data is cached
  var cache = CacheService.getScriptCache();
  var cacheKey = symbol + '_MACD';
  var cachedData = cache.get(cacheKey);
  if (cachedData !== null) {
    return parseFloat(cachedData);
  }
  
  // Fetch historical prices from Yahoo Finance
  var url = "https://query1.finance.yahoo.com/v7/finance/chart/" + symbol + "?range=1y&interval=1wk";

  var options = {
    muteHttpExceptions: true,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  };
  Logger.log(url);
  var response = UrlFetchApp.fetch(url,options);
  var data = JSON.parse(response.getContentText());
  
  // Extract closing prices for the last 12 and 26 weeks
  var prices12 = data.chart.result[0].indicators.quote[0].close.slice(-12);
  var prices26 = data.chart.result[0].indicators.quote[0].close.slice(-26);
  
  // Calculate EMA (Exponential Moving Average) for 12 and 26 weeks
  var EMA12 = calculateEMA(prices12, 12);
  var EMA26 = calculateEMA(prices26, 26);
  
  // Calculate MACD (Moving Average Convergence Divergence)
  var MACD = EMA12[EMA12.length - 1] - EMA26[EMA26.length - 1];
  
  // Cache the result
  cache.put(cacheKey, MACD.toString());
  
  return MACD;
}

/**
 * Calculates the Exponential Moving Average (EMA) for a given array of prices and period.
 *
 * @param {number[]} prices An array of closing prices.
 * @param {number} period The period over which to calculate the EMA.
 * @return {number[]} An array of Exponential Moving Average (EMA) values.
 */
function calculateEMA(prices, period) {
  var k = 2 / (period + 1);
  var EMA = [];
  EMA.push(prices[0]);
  
  for (var i = 1; i < prices.length; i++) {
    var ema = prices[i] * k + EMA[i - 1] * (1 - k);
    EMA.push(ema);
  }
  
  return EMA;
}
