from flask import Flask, render_template, request

app = Flask(__name__)


#Splash/Home page
@app.route('/')
@app.route('/home')
def home_page():
	return render_template('index.html')

@app.route('/group')
def group_page():
	return render_template('vote.html')

@app.route('/group/<path>')
def group_id_path(path):
	return render_template('vote.html', groupKey = path)

if __name__ == '__main__':
    app.run()