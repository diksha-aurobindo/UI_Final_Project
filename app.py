from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# CORRECT_ANSWER = ["Dirt", "Excess Oil", "Makeup"]

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')  # This is your existing UI

@app.route('/quiz/1')
def quiz():
    return render_template('quiz.html')

@app.route('/build')
def build():
    return render_template('routine.html')

@app.route('/finish')
def finish():
    return render_template('finish.html')

@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.get_json()
    user_answer = data.get("answer", [])
    correct_answer = {"Dirt", "Excess Oil", "Makeup"}

    is_correct = set(user_answer) == correct_answer
    return jsonify({
        "correct": is_correct,
        "message": "Answer is right!" if is_correct else "Answer is wrong!"
    })

@app.route("/quiz/2")
def quiz2():
    return render_template("quiz2.html")

@app.route("/submit-quiz/2", methods=["POST"])
def submit_quiz_2():
    data = request.get_json()
    user_answer = set(data.get("answer", []))
    correct_answer = ["Essence"]

    is_correct = user_answer == correct_answer
    return jsonify({
        "correct": is_correct,
        "message": "Answer is right!" if is_correct else "Oops! You got it wrong. Serum provides hydration while moisturizer locks the hydration in your skin."
    })

# Final quiz
@app.route('/final-quiz')
def final_quiz():
    return render_template('final_quiz.html')

if __name__ == '__main__':
    app.run(debug=True, port=5004)
