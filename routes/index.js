
/*
 * GET home page.
 */

// RIT Meal Plan Budget Calculator by Nicolas McCurdy (http://nicolasmccurdy.github.io)
// RIT debit display: https://eservices.rit.edu/eServices/login.do
// RIT meal plans: http://finweb.rit.edu/diningservices/mealplans/1112/resident.html

var data = require("../data.json");

function percent(portion, total) {
  return 100 * portion / total;
}

function daysBetween(a, b) {
  return (b - a) / (1000*60*60*24);
}

// main function
// What is your current RIT meal plan? Type 10, 12, 14, or ultra. If you want to track a budget for something else, type other.
// Money left in budget
function calculateBudget(plan, moneyLeft) {
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
  var daysLeft = daysBetween(new Date(), dateEnd);
  var moneyDaily = moneyLeft / daysLeft;
  return {
    dayPassed: daysBetween(dateStart, new Date()).toFixed(),
    dayTotal: daysBetween(dateStart, dateEnd).toFixed(),
    dayPercent: percent(daysBetween(dateStart, new Date()), daysBetween(dateStart, dateEnd)).toFixed(2),
    spentAmount: (moneyTotal - moneyLeft).toFixed(2),
    spentTotal: parseInt(moneyTotal, 10).toFixed(2),
    spentPercent: percent(moneyTotal - moneyLeft, moneyTotal).toFixed(2),
    spentDaily: ((moneyTotal - moneyLeft) / daysBetween(dateStart, new Date())).toFixed(2),
    recommendedDailySpending: moneyDaily.toFixed(2),
    recommendedWeeklySpending: (moneyDaily * 7).toFixed(2)
  };
}

exports.index = function(req, res){
  var results;

  if (req.query.dateStart && req.query.dateEnd && req.query.moneyTotal && req.query.moneyLeft) {
    var plan = {
      dateStart: new Date(req.query.dateStart),
      dateEnd: new Date(req.query.dateEnd),
      moneyTotal: req.query.moneyTotal
    };
    var moneyLeft = req.query.moneyLeft;

    results = calculateBudget(plan, moneyLeft);
  } else if (req.query.mealPlan && req.query.moneyLeft) {
    results = calculateBudget(req.query.mealPlan, req.query.moneyLeft);
  }

  res.render('index', {
    title: 'RIT Debit Calculator',
    results: results
  });
};
