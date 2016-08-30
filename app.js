var randomNumber = function getRandomIntInclusive(min, max) { //Random number generator. Attr: MDN.
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var table = document.getElementById('store_table');
var footRow = document.createElement('tr');
var footData = [];
var hourlyTotals = [];
var grandTotal = 0;
var store_form = document.getElementById('store_form');
store_form.addEventListener('submit', submitForm);
var currentStore;

function Store(name, minCust, maxCust, avgCookies) {
  this.locationName = name;
  this.minCust = minCust; //Minimum number of customers per hour
  this.maxCust = maxCust; //Maximum number of customers per hour
  this.avgCookies = avgCookies; //Average number of cookies each customer buys
  this.totalCookies = 0; //Number of cookies sold in a day for this store
};

Store.prototype.avgCust = function() { //Get a random number between the minimum and maximum number of customers.
  return randomNumber(this.minCust, this.maxCust);
};

Store.prototype.locationCookies = function () {
  var cookiesByHour = []; //An array to store how many cookies were sold each hour for this store.
  var numCust;
  var numCookies;
  for (var i = 0; i <= 14; i++) {
    numCust = this.avgCust(); //Customers this hour, generated randomly
    numCookies = Math.ceil(numCust * this.avgCookies); //Cookies sold this hour
    this.totalCookies += numCookies; //Add this hour's cookies to the running total for the day.
    cookiesByHour.push(numCookies); //Add this hour's cookies to the daily array
    hourlyTotals[i] = hourlyTotals[i] + numCookies; //Add this store's hourly cookies to the total cookies per hour for all stores combined
  }
  for (var y = 0; y < cookiesByHour.length; y++) {
    cookiesByHour[y] = '<td>' + cookiesByHour[y] + '</td>'; //Turn the array of all cookies sold into a giant list of <td>s
  }
  grandTotal += this.totalCookies; //Add this store's daily total to the running grand total for all locations.
  return cookiesByHour.join(''); //Return the array of cookies sold each hour as <td>s
};

function render() {
  var row;
  row = document.createElement('tr');
  row.innerHTML = '<td>' + currentStore.locationName + '</td>' +
      currentStore.locationCookies() +
      '<td>' + currentStore.totalCookies + '</td>';
  footData = []; //Reset the footer's td values.
  for (var x = 0; x < hourlyTotals.length; x++) {
    footData.push('<td>' + hourlyTotals[x] + '</td>'); //Restore the footer's td values with updated numbers.
  }
  footData.push('<td>' + grandTotal + '</td>');
  footRow.innerHTML = '<td>Hourly totals</td>' + footData.join(''); //Reprint the footer.
  table.appendChild(row); //Add the row to the table body so it shows above the footer.
}

function submitForm(event) {
  event.preventDefault(); //Prevent the event from its default behavior (submitting the form)

  var locationName = event.target.store_name.value;
  var minCust = event.target.min_cust.value;
  var maxCust = event.target.max_cust.value;
  var avgCookies = event.target.avg_cookies.value;

  currentStore = new Store(locationName, minCust, maxCust, avgCookies); //Set the global variable equal to the newest object

  render();
  store_form.reset();
}

function headerRow() { //Create a row of times from the store opening to the store closing
  var tableHead = document.getElementById('store_head');
  var headRow = document.createElement('tr');
  var headData = [];
  var timeOfDay = 'am';
  var displayHour;
  for (var time = 6; time <= 20; time++) {
    displayHour = time;
    if (time > 11) {
      timeOfDay = 'pm';
      if (time > 12) {
        displayHour -= 12;
      }
    }
    headData.push('<td>' + displayHour + ':00' + timeOfDay + '</td>');
  }
  headRow.innerHTML = '<td></td>' + headData.join('') + '<td>Daily total</td>';
  tableHead.appendChild(headRow);
}

function footerRow() {
  for (var l = 6; l <= 20; l++) { //Initialize footer row with 0 values.
    hourlyTotals.push(0);
  }
  var tableFoot = document.getElementById('store_foot');
  for (var x = 0; x < hourlyTotals.length; x++) {
    footData.push('<td>' + hourlyTotals[x] + '</td>');
  }
  footData.push('<td>0</td>'); //Add a 0 for the daily grand total.
  footRow.innerHTML = '<td>Hourly total</td>' + footData.join('');
  tableFoot.appendChild(footRow);
}

headerRow();
footerRow();
