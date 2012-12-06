require 'sinatra'

class RDC < Sinatra::Base

	# Pages

	get '/' do
		erb :index
	end

	# Redirects

	get '/index.html' do
		redirect '/', 301
	end

end
