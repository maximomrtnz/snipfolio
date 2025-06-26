function GET_DIVIDEND_HISTORY(ticker) {
    var now = Math.floor(new Date().getTime() / 1000); // Current timestamp
    var fiveYearsAgo = Math.floor(new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getTime() / 1000); // 5 years ago

    var url = "https://query1.finance.yahoo.com/v7/finance/download/" + ticker +
              "?period1=" + fiveYearsAgo + "&period2=" + now + "&interval=1d&events=div&includeAdjustedClose=true";

    var options = {
      muteHttpExceptions: true,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };
    Logger.log(url);
    var response = UrlFetchApp.fetch(url,options);
    var csv = response.getContentText();
    var rows = csv.split("\n").map(row => row.split(","));
    
    return rows;
}
