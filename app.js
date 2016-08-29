var randomNumber = function getRandomIntInclusive(min, max) {
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
  this.minCust = minCust;
  this.maxCust = maxCust;
  this.avgCookies = avgCookies;
  this.totalCookies = 0;
};

Store.prototype.avgCust = function() {
  return randomNumber(this.minCust, this.maxCust);
};

Store.prototype.locationCookies = function () {
  var cookiesByHour = [];
  var numCust;
  var numCookies;
  for (var i = 0; i <= 14; i++) {
    numCust = this.avgCust();
    numCookies = Math.ceil(numCust * this.avgCookies);
    this.totalCookies += numCookies;
    cookiesByHour.push(numCookies);
    hourlyTotals[i] = hourlyTotals[i] + numCookies;
  }
  for (var y = 0; y < cookiesByHour.length; y++) {
    cookiesByHour[y] = '<td>' + cookiesByHour[y] + '</td>';
  }
  grandTotal += this.totalCookies;
  return cookiesByHour.join('');
};

function render() {
  var row;
  row = document.createElement('tr');
  row.innerHTML = '<td>' + currentStore.locationName + '</td>' +
      currentStore.locationCookies() +
      '<td>' + currentStore.totalCookies + '</td>';
  footData = [];
  for (var x = 0; x < hourlyTotals.length; x++) {
    footData.push('<td>' + hourlyTotals[x] + '</td>');
  }
  footData.push('<td>' + grandTotal + '</td>');
  footRow.innerHTML = '<td>Hourly totals</td>' + footData.join('');
  table.appendChild(row);
}

function submitForm(event) {
  event.preventDefault();
  var locationName = event.target.store_name.value;
  var minCust = event.target.min_cust.value;
  var maxCust = event.target.max_cust.value;
  var avgCookies = event.target.avg_cookies.value;

  currentStore = new Store(locationName, minCust, maxCust, avgCookies);

  render();
  store_form.reset();
}

function headerRow() {
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
  for (var l = 6; l <= 20; l++) {
    hourlyTotals.push(0);
  }
  var tableFoot = document.getElementById('store_foot');
  for (var x = 0; x < hourlyTotals.length; x++) {
    footData.push('<td>' + hourlyTotals[x] + '</td>');
  }
  footData.push('<td>0</td>');
  footRow.innerHTML = '<td>Hourly total</td>' + footData.join('');
  tableFoot.appendChild(footRow);
}

headerRow();
footerRow();
