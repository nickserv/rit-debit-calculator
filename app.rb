require 'sinatra'

class RDC < Sinatra::Base

	# Pages

	get '/' do
		erb :'index'
	end

	# Redirects

	get '/index.html' do
		redirect '/', 301
	end

end

# Only run it when called as `ruby your_app_file.rb`
RDC.run! if $0 == __FILE__
