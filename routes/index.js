
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
function calculate_budget(plan, money_left) {
  if (typeof plan === "String") {
    var quarter = data.quarters["2012-2"];
    var money_total = data.plans["2012"][plan];

    // inputs
    var date_start = new Date(quarter.start);
    var date_end = new Date(quarter.end);
  } else {
    var date_start = plan.date_start;
    var date_end = plan.date_end;
    var money_total = plan.money_total;
  }

  // calculations
  var days_left = daysBetween(new Date(), date_end);
  var money_daily = money_left / days_left;
  return {
    day_passed: daysBetween(date_start, new Date()).toFixed(),
    day_total: daysBetween(date_start, date_end).toFixed(),
    day_percent: percent(daysBetween(date_start, new Date()), daysBetween(date_start, date_end)).toFixed(2),
    spent_amount: (money_total - money_left).toFixed(2),
    spent_total: parseInt(money_total, 10).toFixed(2),
    spent_percent: percent(money_total - money_left, money_total).toFixed(2),
    spent_daily: ((money_total - money_left) / daysBetween(date_start, new Date())).toFixed(2),
    recommended_daily_spending: money_daily.toFixed(2),
    recommended_weekly_spending: (money_daily * 7).toFixed(2)
  };
}

exports.index = function(req, res){
  if (req.query.date_start && req.query.date_end && req.query.money_total && req.query.money_left) {
    var plan = {
      date_start: new Date(req.query.date_start),
      date_end: new Date(req.query.date_end),
      money_total: req.query.money_total
    };
    var money_left = req.query.money_left;

    var results = calculate_budget(plan, money_left);
  } else if (req.query.meal_plan && req.query.money_left) {
    var results = calculate_budget(req.query.meal_plan, req.query.money_left);
  }

  res.render('index', {
    title: 'RIT Debit Calculator',
    results: results
  });
};
