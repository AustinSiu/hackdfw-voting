from flask import Flask, render_template, request

app = Flask(__name__)


#Splash/Home page
@app.route('/')
@app.route('/home')
def home_page():
	return render_template('index.html')



if __name__ == '__main__':
    app.run()