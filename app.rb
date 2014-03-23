# RIT Meal Plan Budget Calculator by Nicolas McCurdy (http://nicolasmccurdy.github.io)
# RIT debit display: https://eservices.rit.edu/eServices/login.do
# RIT meal plans: http://finweb.rit.edu/diningservices/mealplans/1112/resident.html

require 'sinatra'
require 'date'
require 'yaml'
# STDOUT.flush #uncomment this if things screw up

class DebitCalculator < Sinatra::Base
  def round(number)
    (number * 10**2).round.to_f / 10**2
  end

  def percent(portion, total)
    100 * portion.to_f / total.to_f
  end

  # main function
  # What is your current RIT meal plan? Type 10, 12, 14, or ultra. If you want to track a budget for something else, type other.
  # Money left in budget
  def calculate_budget(plan, money_left)
    if plan.is_a? String
      data = YAML.load_file 'data.yml'
      quarter = data['quarters']['2012-2']
      money_total = data['plans'][2012][plan]

      # inputs
      date_start = Date.strptime quarter['start'], '%m/%d/%Y'
      date_end = Date.strptime quarter['end'], '%m/%d/%Y'
    else
      date_start = plan[:date_start]
      date_end = plan[:date_end]
      money_total = plan[:money_total]
    end

    # calculations
    days_left = date_end - Date.today
    money_daily = money_left / days_left
    {
      day_passed: (Date.today - date_start).to_i.to_s,
      day_total: (date_end - date_start).to_i.to_s,
      day_percent: round(percent Date.today - date_start, date_end - date_start),
      spent_amount: round(money_total - money_left),
      spent_total: round(money_total),
      spent_percent: round(percent money_total - money_left, money_total),
      spent_daily: round((money_total - money_left) / (Date.today - date_start)),
      recommended_daily_spending: round(money_daily),
      recommended_weekly_spending: round(money_daily * 7)
    }
  end

  # Pages
  get '/' do
    if request['date_start'] && request['date_end'] && request['money_total'] && request['money_left']
      plan = {
        date_start: Date.strptime(request['date_start'], '%Y-%m-%d'),
        date_end: Date.strptime(request['date_end'], '%Y-%m-%d'),
        money_total: request['money_total'].to_i
      }
      money_left = request['money_left'].to_i

      @results = calculate_budget(plan, money_left)
    elsif request['meal_plan'] && request['money_left']
      @results = calculate_budget(request['meal_plan'], request['money_left'].to_i)
    end
    haml :index
  end

  # Redirects
  get('/index.html') { redirect '/', 301 }
end
