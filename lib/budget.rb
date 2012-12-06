# RIT Meal Plan Budget Calculator by Nicolas McCurdy (http://thenickperson.com)
# RIT debit display: https://eservices.rit.edu/eServices/login.do
# RIT meal plans: http://finweb.rit.edu/diningservices/mealplans/1112/resident.html

#requirements
require 'date'
#STDOUT.flush #uncomment this if things screw up

#classes
class Quarter
	attr_accessor :date_start, :date_end
	def initialize(date_start,date_end)
		@date_start = date_start
		@date_end = date_end
	end
end

class Budget
	attr_accessor :date_start, :date_end, :money_total
	def initialize(date_start,date_end,money_total)
		@date_start = date_start
		@date_end = date_end
		@money_total = money_total
	end
end

def round(number,cash=true)
	if cash
		return "$#{((number*10**2).round.to_f/10**2).to_s}"
	else
		return ((number*10**2).round.to_f/10**2).to_s
	end
end

#main function
# What is your current RIT meal plan? Type 10, 12, 14, or ultra. If you want to track a budget for something else, type other.
# Money left in budget
def calculate_budget budget, money_left
	#budget
	case budget
	when 10
		budget = $m10plus
	when 12
		budget = $m12plus
	when 14
		budget = $m14plus
	end
	#inputs
	date_start = budget.date_start
	date_end = budget.date_end
	money_total = budget.money_total
	#calculations
	days_left = date_end - Date.today
	money_daily = money_left/days_left
	{
		:day_passed => (Date.today-date_start).to_i.to_s,
		:day_total => (date_end-date_start).to_i.to_s,
		:day_percent => round((((Date.today-date_start).to_f)/((date_end-date_start).to_f))*100,false),
		:spent_amount => round(money_total-money_left),
		:spent_total => round(money_total),
		:spent_percent => round(((money_total-money_left)/money_total)*100,false),
		:spent_daily => round((money_total-money_left)/(Date.today-date_start)),
		:recommended_daily_spending => round(money_daily),
		:recommended_weekly_spending => round(money_daily*7)
	}
end

def display_budget
	results = calculate_budget
	puts 'USAGE'
	puts "Time: day #{results[:day_passed]} of #{results[:day_total]} (#{results[:day_passed_percent]}%)"
	puts "Spent: #{results[:spent_amount]} of #{results[:spent_total]} (#{results[:spent_percent]}%), or #{results[:spent_daily]} daily"
	puts
	puts 'RECOMMENDATIONS'
	puts "Spend #{results[:recommended_daily_spending]} daily (#{results[:recommended_weekly_spending]} weekly)."
end

display_budget
