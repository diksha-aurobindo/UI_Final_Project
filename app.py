from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn')
def learn():
    return render_template('index.html')  # This is your existing UI

if __name__ == '__main__':
    app.run(debug=True)
