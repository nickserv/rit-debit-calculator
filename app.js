// RIT Meal Plan Budget Calculator by Nicolas McCurdy (http://nicolasmccurdy.github.io)
// RIT debit display: https://eservices.rit.edu/eServices/login.do
// RIT meal plans: http://finweb.rit.edu/diningservices/mealplans/1112/resident.html

function percent(portion, total) {
  return 100 * portion / total;
}

function daysBetween(a, b) {
  return (b - a) / (1000*60*60*24);
}

// main function
// What is your current RIT meal plan? Type 10, 12, 14, or ultra. If you want to track a budget for something else, type other.
// Money left in budget
function calculateBudget(data, plan, moneyLeft) {
  var dateStart, dateEnd, moneyTotal;

  if (typeof plan === "string") {
    var quarter = data.quarters["2012-2"];
    moneyTotal = data.plans["2012"][plan];

    // inputs
    dateStart = new Date(quarter.start);
    dateEnd = new Date(quarter.end);
  } else {
    dateStart = plan.dateStart;
    dateEnd = plan.dateEnd;
    moneyTotal = plan.moneyTotal;
  }

  // calculations
  var now = new Date();
  var daysLeft = daysBetween(now, dateEnd);
  var daysPassed = daysBetween(dateStart, now);
  var moneyDaily = moneyLeft / daysLeft;

  return {
    dayPassed: daysPassed.toFixed(),
    dayTotal: daysBetween(dateStart, dateEnd).toFixed(),
    dayPercent: percent(daysPassed, daysBetween(dateStart, dateEnd)).toFixed(2),
    spentAmount: (moneyTotal - moneyLeft).toFixed(2),
    spentTotal: parseInt(moneyTotal, 10).toFixed(2),
    spentPercent: percent(moneyTotal - moneyLeft, moneyTotal).toFixed(2),
    spentDaily: ((moneyTotal - moneyLeft) / daysPassed).toFixed(2),
    recommendedDailySpending: moneyDaily.toFixed(2),
    recommendedWeeklySpending: (moneyDaily * 7).toFixed(2)
  };
}

var app = angular.module("debitCalculatorApp", []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.controller("CalculatorController", function ($http, $location, $scope) {
  $http.get("data.json").then(function (res) {
    var query = $location.search();
    var results;

    if (query.dateStart && query.dateEnd && query.moneyTotal && query.moneyLeft) {
      var plan = {
        dateStart: new Date(query.dateStart),
        dateEnd: new Date(query.dateEnd),
        moneyTotal: parseInt(query.moneyTotal, 10)
      };

      results = calculateBudget(res.data, plan, parseInt(query.moneyLeft, 10));
    } else if (query.mealPlan && query.moneyLeft) {
      results = calculateBudget(res.data, query.mealPlan, parseInt(query.moneyLeft, 10));
    }

    $scope.results = results;
  });
});
