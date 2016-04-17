import logging
import os

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

#Splash/Home page
@app.route('/')
@app.route('/home')
def home_page():
	return render_template('index.html')

@app.route('/group')
def group_page():
	return render_template('vote.html')

@app.route('/group/<string:groupKey>')
def group_id_path(groupKey):
	return render_template('vote.html', groupKey = groupKey)

if __name__ == '__main__':
	# app.run()
    port= int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)