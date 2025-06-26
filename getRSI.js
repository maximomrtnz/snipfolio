/**
 * Function to get the last RSI value from Yahoo Finance API with caching.
 * @param {string} symbol - Stock symbol (e.g., "AAPL").
 * @param {number} period - RSI period (typically 14).
 * @return {number} Last RSI value.
 */
function GETRSI(symbol, period) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "RSI_" + symbol + "_" + period;
  
  // Try to fetch data from cache
  var cachedData = cache.get(cacheKey);
  if (cachedData) {
    return Number(cachedData);
  }
  
  // Fetch historical data if not found in cache
  var historicalData = getHistoricalData(symbol);
  var closingPrices = extractClosingPrices(historicalData);
  var rsiValues = calculateRSI(closingPrices, period);
  
  // Get the last RSI value
  var lastRSI = rsiValues[rsiValues.length - 1];
  
  // Cache the result for future use (expires in 1 hour)
  cache.put(cacheKey, lastRSI.toString(), 3600);
  
  return lastRSI;
}

/**
 * Fetches historical price data from Yahoo Finance API with caching.
 * @param {string} symbol - Stock symbol (e.g., "AAPL").
 * @return {Object[]} Array of historical price data objects (date and close price).
 */
function getHistoricalData(symbol) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "HistoricalData_" + symbol;
  
  // Try to fetch data from cache
  var cachedData = cache.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  
  // Fetch data from Yahoo Finance API
  var url = "https://query1.finance.yahoo.com/v7/finance/chart/" + symbol + "?range=1y&interval=1wk";
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var series = data.chart.result[0].indicators.quote[0].close;
  var timestamps = data.chart.result[0].timestamp;
  
  // Combine timestamps and close prices into an array of objects
  var historicalData = [];
  for (var i = 0; i < series.length; i++) {
    historicalData.push({
      date: timestamps[i],
      close: series[i]
    });
  }
  
  // Cache the result for future use (expires in 1 hour)
  cache.put(cacheKey, JSON.stringify(historicalData), 3600);
  
  return historicalData;
}

/**
 * Extracts closing prices from historical price data.
 * @param {Object[]} data - Array of historical price data objects (date and close price).
 * @return {number[]} Array of closing prices.
 */
function extractClosingPrices(data) {
  return data.map(function(entry) {
    return entry.close;
  });
}

/**
 * Calculates the Relative Strength Index (RSI) for a given range of data.
 * @param {number[]} data - Array of closing prices.
 * @param {number} period - RSI period (typically 14).
 * @return {number[]} Array of RSI values corresponding to the input data.
 */
function calculateRSI(data, period) {
  var rsi = [];
  
  // Calculate initial RSI
  var sumGain = 0;
  var sumLoss = 0;
  
  for (var i = 1; i < period; i++) {
    var priceDiff = data[i] - data[i - 1];
    if (priceDiff > 0) {
      sumGain += priceDiff;
    } else {
      sumLoss -= priceDiff; // sumLoss is positive, hence use minus
    }
  }
  
  var avgGain = sumGain / period;
  var avgLoss = sumLoss / period;
  
  var rs = avgGain / avgLoss;
  var initialRSI = 100 - (100 / (1 + rs));
  rsi.push(initialRSI);
  
  // Calculate subsequent RSI values
  for (var j = period; j < data.length; j++) {
    var priceDiff = data[j] - data[j - 1];
    var gain = (priceDiff > 0) ? priceDiff : 0;
    var loss = (priceDiff < 0) ? -priceDiff : 0;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    rs = avgGain / avgLoss;
    var currentRSI = 100 - (100 / (1 + rs));
    rsi.push(currentRSI);
  }
  
  return rsi;
}
