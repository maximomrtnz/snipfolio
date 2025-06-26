function GET_DIVIDEND_FIVE_YEARS_GROWTH_BY_YEAR(ticker){
  var result = CALCULATE_DIVIDEND_GROWTH(GET_DIVIDENDS_BY_YEAR(ticker)).growth5Y;
  return result === 'N/A' ? 0 : parseFloat(result.replace('.').replace('%'))/100;
}

function GET_DIVIDENDS_BY_YEAR(ticker) {
  var url = `https://stockanalysis.com/stocks/${ticker}/dividend/`;
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  if (response.getResponseCode() !== 200) {
    throw new Error("No se pudo obtener la información de Stock Analysis.");
  }

  var html = response.getContentText();
  var $ = Cheerio.load(html); // Usamos Cheerio para analizar el HTML

  var dividendos = [];

  // Extraemos los dividendos de la tabla "Dividend History"
  $("table tbody tr").each(function() {
    var fechaTexto = $(this).find("td").eq(0).text().trim(); // Fecha
    var montoTexto = $(this).find("td").eq(1).text().trim().replace("$", ""); // Monto del dividendo

    if (fechaTexto && montoTexto) {
      var anio = new Date(fechaTexto).getFullYear();
      var monto = parseFloat(montoTexto);
      dividendos.push({ anio: anio, dividendo: monto });
    }
  });

  // Mostrar los dividendos por año
  return dividendos;
}

function CALCULATE_DIVIDEND_GROWTH(dividends) {
  var annualDividends = {};

  // Aggregate total dividends per year
  dividends.forEach(function(d) {
    var year = d.anio; // "anio" means "year" in Spanish
    var amount = d.dividendo; // "dividendo" means "dividend"
    if (!annualDividends[year]) {
      annualDividends[year] = 0;
    }
    annualDividends[year] += amount;
  });

  // Get the current year
  var currentYear = new Date().getFullYear();

  // Get dividend values
  var lastYearDividend = annualDividends[currentYear - 1] || null; // Most recent full year (2024)
  var dividend5YearsAgo = annualDividends[currentYear - 6] || null; // 5 years ago (2019)
  var dividend10YearsAgo = annualDividends[currentYear - 11] || null; // 10 years ago (2014)

  // Function to calculate CAGR (Compound Annual Growth Rate)
  function calculateCAGR(initialValue, finalValue, years) {
    if (!initialValue || !finalValue || initialValue <= 0) return "N/A";
    return ((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100).toFixed(2) + "%";
  }

  // Compute 5-year and 10-year dividend growth
  var growth5Y = calculateCAGR(dividend5YearsAgo, lastYearDividend, 5);
  var growth10Y = calculateCAGR(dividend10YearsAgo, lastYearDividend, 10);

  return {
    growth5Y: growth5Y,
    growth10Y: growth10Y
  };
}
