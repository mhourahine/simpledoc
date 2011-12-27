require 'rubygems'
require 'sinatra'
require 'rest_client'
require 'json'

URL = 'http://localhost:5984'
DB = 'simpledocs'

#default route - serve up public/index.html
get '/' do
  File.read(File.join('public', 'index.html'))
end

# REST API

# all
get '/docs/' do
  #pass JSON data through
  data = RestClient.get "#{URL}/#{DB}/_all_docs?include_docs=true"
  result = JSON.parse(data)
  result['rows'].to_json
end

# get
get '/docs/:id' do
    data = RestClient.get "#{URL}/#{DB}/#{params[:id]}"
end

# create and update existing doc
post '/docs/:id' do
  result = RestClient.put "#{URL}/#{DB}/#{params[:id]}", params.to_json
end


get '/generate_uuid' do
  result = RestClient.get "#{URL}/_uuids"
end