/**
 * Retrieves the dividend growth rate as a decimal for a given stock symbol.
 * 
 * @param {string} symbol - The stock symbol to look up.
 * @return {number|string} - The dividend growth rate as a decimal, or an error message if the symbol or column is not found.
 * 
 * @example
 * // Returns 0.0556 for AAPL (assuming 5.56% is the dividend growth rate for AAPL)
 * GETDIVGROWTH5Y("AAPL");
 */
function GETDIVGROWTH5Y(symbol) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dividend Data');
  var data = sheet.getDataRange().getValues();
  
  // Find the index of the "Div Growth 5Y" column
  var header = data[0];
  var divGrowthIndex = header.indexOf('Div Growth 5Y');
  
  if (divGrowthIndex === -1) {
    return 'Column not found';
  }
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == symbol) {
      var divGrowthString = data[i][divGrowthIndex];
      var divGrowthDecimal = parseFloat(divGrowthString.replace('%', '').replace(',', '.')) / 100;
      return divGrowthDecimal;
    }
  }
  
  return 'Symbol not found';
}
