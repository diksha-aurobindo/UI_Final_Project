from flask import Flask, render_template, request, jsonify, session, json, redirect, url_for
import os, json
import time

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Needed to use sessions


USER_DATA_FILE = "userdata.json"

# ------------------- Time Tracking -------------------
@app.before_request
def track_start_time():
    session['start_time'] = session.get('start_time') or time.time()

def update_time_spent(section_key):
    if 'start_time' in session:
        elapsed = time.time() - session['start_time']
        session[section_key] = session.get(section_key, 0) + elapsed
        session['start_time'] = time.time()

# ------------------- Routes -------------------
@app.route('/')
def home():
    if 'score' not in session:
      session['score'] = 0
    return render_template('home.html', score=session['score'])

# @app.route('/learn')
# def learn():
#     update_time_spent("usertimeSpentOnLearn")
#     return render_template('learn.html')  # This is your existing UI

# @app.route('/learn/cleanser', defaults={'product': None})
@app.route('/learn/<product>')
def learn(product):
    update_time_spent("usertimeSpentOnLearn")
    session['last_product'] = product
    return render_template('learn.html', product=product)  # Pass product to template

@app.route('/learn')
def learn_redirect():
    # last_product = session.get('last_product', 'cleanser')  # default to cleanser
    last_product = session.get('last_product')
    print(">>> Last product in session:", last_product)
    # last_product = session['last_product']
    # return redirect(f"/learn/{last_product}")
    return redirect(url_for("learn", product=last_product))

@app.route('/quiz/1')
def quiz():
    update_time_spent("usertimeSpentOnLearn")
    quiz_data = session.get("quiz_1", {})
    # print(json.dumps(quiz_data))  # check if it's serializable
    return render_template("quiz.html", quiz_state=quiz_data, score=session.get('score', 0))

@app.route("/quiz/2")
def quiz2():
    update_time_spent("usertimeSpentOnQuiz")
    quiz_data = session.get("quiz_2", {})
    return render_template("quiz2.html", quiz_state=quiz_data, score=session.get('score', 0))

@app.route("/quiz-result")
def quiz_result():
    return render_template("quizresult.html", score=session['score'])


@app.route('/build-routine')
def build():
    update_time_spent("usertimeSpentOnQuiz")
    #update_time_spent("usertimeSpentOnRoutine")
    return render_template('build.html')

@app.route('/build-routine/3')
def build_step(step=3):
    update_time_spent("usertimeSpentOnQuiz")
    return render_template('routine.html', step=step) 

@app.route('/build-routine/5')
def build_step5(step=5):
    return render_template('routine2.html', step=step)


@app.route('/finish')
def finish():
    update_time_spent("usertimeSpentOnRoutine")
    return render_template('finish.html')

# Final quiz
@app.route('/final-quiz')
def final_quiz():
    update_time_spent("usertimeSpentOnQuiz")
    return render_template('final_quiz.html')

@app.route("/view-userdata")
def view_userdata():
    if not os.path.exists(USER_DATA_FILE):
        # Create an empty JSON file if missing
        with open(USER_DATA_FILE, "w") as f:
            json.dump({}, f)

    with open(USER_DATA_FILE, "r") as f:
        data = json.load(f)
    return jsonify(data)

# ------------------- Quiz Submission -------------------
@app.route("/submit-quiz/1", methods=["POST"])
def submit_quiz():
    data = request.get_json()
    user_answer = data.get("answer", [])
    correct_answer = {"Dirt", "Excess Oil", "Makeup"}

    is_correct = set(user_answer) == correct_answer
    # Save to session
    session['quiz_1'] = {
        'answered': True,
        'user_answer': list(user_answer),
        'is_correct': is_correct
    }

    # Update score
    if is_correct and not session['quiz_1'].get('scored', False):
        session['score'] = session.get('score', 0) + 1
        session['quiz_1']['scored'] = True

    return jsonify({
        "correct": is_correct,
        "message": "Answer is right!" if is_correct else "Answer is wrong!",
        "score": session['score']
    })

@app.route("/submit-quiz/2", methods=["POST"])
def submit_quiz_2():
    data = request.get_json()
    selected_answer = data["answer"][0]
    correct_answer = "Essence"
    is_correct = selected_answer == correct_answer

    # Store quiz 2 answer and correctness in session
    if "quiz_2" not in session:
        session["quiz_2"] = {}

    session["quiz_2"]["answered"] = True
    session["quiz_2"]["user_answer"] = selected_answer
    session["quiz_2"]["is_correct"] = is_correct

    # Prevent double scoring
    if is_correct and not session["quiz_2"].get("scored", False):
        session["score"] = session.get("score", 0) + 1
        session["quiz_2"]["scored"] = True

    return jsonify({
        "correct": is_correct,
        "message": "Correct! 🌟" if is_correct else "Oops! That's not right.",
        "score": session['score']
    })

@app.route('/skin-type')
def skinType():
    return render_template('skintype.html')

@app.route('/skin-type/result')
def skinTypeRes():
    return render_template('skintype-result.html')

# ------------------- Save and Get Progress -------------------
def save_user_data(user_data):
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, "r") as f:
            all_users = json.load(f)
    else:
        all_users = {}

    user_id = str(user_data["userId"])
    all_users[user_id] = user_data

    with open(USER_DATA_FILE, "w") as f:
        json.dump(all_users, f, indent=2)

@app.route("/save-progress", methods=["POST"])
def save_progress():
    update_time_spent("TotalTimeSpentTillNow")
    user_data = {
        "userId": 1,
        "usertimeSpentOnLearn": round(session.get("usertimeSpentOnLearn", 0), 2),
        "usertimeSpentOnQuiz": round(session.get("usertimeSpentOnQuiz", 0), 2),
        "usertimeSpentOnRoutine": round(session.get("usertimeSpentOnRoutine", 0), 2),
        "userQuizScore": session.get("score", 0),
        "TotalTimeSpentTillNow": round(
            session.get("usertimeSpentOnLearn", 0) +
            session.get("usertimeSpentOnQuiz", 0) +
            session.get("usertimeSpentOnRoutine", 0), 2
        ),
        "Userquiz1State": session.get("quiz_1", {}),
        "quiz2State": session.get("quiz_2", {}),
        "finalQuizState": session.get("finalQuizState", {}),
        "routineState": session.get("routineState", {})
    }
    save_user_data(user_data)
    return jsonify({"status": "saved", "userData": user_data})

@app.route("/get-user-data")
def get_user_data():
    user_id = "1"
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE) as f:
            all_users = json.load(f)
            return jsonify(all_users.get(user_id, {}))
    return jsonify({})
    

@app.route('/data')
def get_routine_data():
    with open("data.json") as f:
        data = json.load(f)
    return jsonify(data)

# -------------------
if __name__ == '__main__':
    app.run(debug=True, port=5003)