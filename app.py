from flask import Flask, render_template, request, jsonify, session, json, redirect, url_for
import os, json
import time

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Needed to use sessions


USER_DATA_FILE = "userdata.json"

# Define correct answers
correct_answers = {
    "q1": "Cleanser with Salicylic Acid",
    "q2": "Spot Treatment with Sulfur",
    "q3": "Ceramides",
    "q4": "True"
}

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


@app.route('/skin-type/<skintypeques>')
def skintypequestions(skintypeques=None):
    return render_template('skintype_questions.html', skintypeques=skintypeques)

@app.route('/skin-type/result')
def skinTypeRes():
    return render_template('skintype-result.html', skinType = session.get("skinType", "Oily"))

# @app.route('/learn')
# def learn():
#     update_time_spent("usertimeSpentOnLearn")
#     return render_template('learn.html')  # This is your existing UI

# @app.route('/learn/cleanser', defaults={'product': None})
@app.route('/learn/<product>')
def learn(product):
    update_time_spent("usertimeSpentOnLearn")
    session['last_product'] = product
    return render_template('learn.html', product=product, skinType = session.get("skinType", "Oily"))  # Pass product to template

@app.route('/learn')
def learn_redirect():
    # last_product = session.get('last_product', 'cleanser')  # default to cleanser
    last_product = session.get('last_product', 'cleanser')
    print(">>> Last product in session:", last_product)
    # last_product = session['last_product']
    # return redirect(f"/learn/{last_product}")
    return redirect(url_for("learn", product=last_product))

# QUIZ URL
@app.route('/quiz1/q1')   # CORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRECTTTTTTTTTTTTTTT
def quiz1_q1():
    update_time_spent("usertimeSpentOnLearn")
    quiz_data = session.get("quiz_1", {})
    # print(json.dumps(quiz_data))  # check if it's serializable
    return render_template("quiz1ques1.html", quiz_state=quiz_data, score=session.get('score', 0))

@app.route("/quiz1/q2")   # CORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRECTTTTTTTTTTTTTTT
def quiz1_q2():
    update_time_spent("usertimeSpentOnQuiz")
    quiz_data = session.get("quiz_2", {})
    return render_template("quiz1ques2.html", quiz_state=quiz_data, score=session.get('score', 0))

@app.route('/quiz2/q1')
def quiz2_q1():
    update_time_spent("usertimeSpentOnLearn")
    quiz_data = session.get("quiz_3", {})
    # print(json.dumps(quiz_data))  # check if it's serializable
    return render_template("quiz2ques1.html", quiz_state=quiz_data, score=session.get('score', 0))

@app.route('/quiz2/q2')
def quiz2_q2():
    update_time_spent("usertimeSpentOnLearn")
    quiz_data = session.get("quiz4State", {})
    # print(json.dumps(quiz_data))  # check if it's serializable
    return render_template("quiz2ques2.html", quiz_state=quiz_data, score=session.get('score', 0))

@app.route('/quiz3/q1')
def quiz3_q1():
    update_time_spent("usertimeSpentOnLearn")
    quiz_data = session.get("quiz_5", {})
    # print(json.dumps(quiz_data))  # check if it's serializable
    return render_template("quiz3ques1.html", quiz_state=quiz_data, score=session.get('score', 0))

@app.route('/final-quiz/q1')
def final_quiz_q1():
    update_time_spent("usertimeSpentOnLearn")

    quiz_data = session.get("detective_quiz", {})
    submitted = session.get("detective_quiz_submitted", False)

    return render_template(
        "finalquiz_ques1.html",
        quiz_state=quiz_data,
        # submitted=submitted,
        score=session.get('score', 0)
    )


@app.route('/final-quiz/q2')   # CORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRECTTTTTTTTTTTTTTT
def final_quiz_q2():
    update_time_spent("usertimeSpentOnQuiz")

    quiz_data = session.get("quiz_7", {})
    submitted = session.get("detective_quiz_submitted", False)

    return render_template('finalquiz_ques2.html', quiz_state=quiz_data, score=session.get('score', 0))

# @app.route("/quiz-result")
# def quiz_result():
#     return render_template("quizresult.html", score=session['score'])

@app.route("/quiz-results")
def quiz_results():
    questions = [
        {
            "question": "Cleansing is important because it removes ___, ___, and ___.",
            "correct_answer": ["Dirt", "Excess Oil", "Makeup"],
            "user_answer": session.get("quiz_1", {}).get("user_answer", []),
            "is_correct": session.get("quiz_1", {}).get("is_correct", False),
        },
        {
            "question": "Which product is more hydrating and great for dull or dehydrated skin?",
            "correct_answer": ["Essence"],
            "user_answer": [session.get("quiz_2", {}).get("user_answer", "")],
            "is_correct": session.get("quiz_2", {}).get("is_correct", False),
        },
        {
            "question": "Match each product to its correct use case.",
            "correct_answer": ["Eye Cream", "Moisturizer", "Serum", "Spot Treatment"],
            "user_answer": list(session.get("quiz_3", {}).get("user_answer", {}).values()),
            "is_correct": session.get("quiz_3", {}).get("is_correct", False),
        },
        {
            "question": "You’re heading into winter and your skin starts feeling tight and flaky. You already use a cleanser and sunscreen. What combination of nourish products might help the most?",
            "correct_answer": ["Serum with hyaluronic acid and a moisturizer with ceramides"],
            "user_answer": [session.get("quiz4State", {}).get("user_answer")],
            "is_correct": session.get("quiz4State", {}).get("is_correct", False),
        },
        {
            "question": "Why is sunscreen an essential step in skincare?",
            "correct_answer": ["Shields UV damage and signs of aging"],
            "user_answer": [session.get("quiz_5", {}).get("user_answer")],
            "is_correct": session.get("quiz_5", {}).get("is_correct", False),
        }
    ]

    # Add detective quiz results
    detective_quiz_states = session.get("detective_quiz", {})
    detective_quiz_correct_answers = {
        "q1": "Cleanser with Salicylic Acid",
        "q2": "Spot Treatment with Sulfur",
        "q3": "Ceramides",
        "q4": "True"
    }

    for question_key, correct_answer in detective_quiz_correct_answers.items():
        state = detective_quiz_states.get(question_key + "State", {})
        user_answer = state.get("user_answer", "")
        is_correct = state.get("is_correct", False)

        questions.append({
            "question": f"Detective Quiz: Your friend <strong>Maya</strong> has acne-prone, sensitive skin and just started breaking out. - {question_key.upper()}",
            "correct_answer": [correct_answer],
            "user_answer": [user_answer],
            "is_correct": is_correct
        })

    questions.append({
            "question": "Drag and drop the skincare step bubbles in the correct order one by one into the jar to fill it completely",
            "correct_answer": ["Cleansing & Prepping","Nourishing","Protecting"],
            "user_answer": session.get("quiz_7", {}).get("user_answer"),
            # "user_answer": list(session.get("quiz_7", {}).get("user_answer", {}).values()),
            "is_correct": session.get("quiz_7", {}).get("is_correct", False),
        })

    total_score = session.get("score", 0)
    return render_template("quizresult.html", questions=questions, total_score=total_score)

@app.route('/routine-summary')
def routine_summary():
    return render_template('routine_summary.html')

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

@app.route("/submit-quiz/3", methods=["POST"])
def submit_quiz_3():
    data = request.get_json()
    user_answers = data.get("answer", {})  # Dictionary: {target: droppedItem}

    correct_mapping = {
        "serum": "Serum",
        "eye": "Eye Cream",
        "spot": "Spot Treatment",
        "moisturizer": "Moisturizer"
    }

    correct = 0
    for key in correct_mapping:
        if user_answers.get(key) == correct_mapping[key]:
            correct += 1

    is_correct = correct == len(correct_mapping)

    session["quiz_3"] = {
        "answered": True,
        "user_answer": user_answers,
        "is_correct": is_correct,
        "scored": False  # will be updated below
    }

    if is_correct and not session["quiz_3"].get("scored", False):
        session["score"] = session.get("score", 0) + 1
        session["quiz_3"]["scored"] = True

    return jsonify({
        "correct": is_correct,
        "correctCount": correct,
        "total": len(correct_mapping),
        "score": session["score"]
    })

@app.route("/submit-quiz/4", methods=["POST"])
def submit_quiz_4():
    data = request.get_json()
    answer = data.get("answer")
    is_correct = data.get("is_correct")

    # Save quiz 4 state directly to session (like quiz_1, quiz_2, etc.)
    session["quiz4State"] = {
        "answered": True,
        "is_correct": is_correct,
        "scored": False,
        "user_answer": answer
    }
    print("User answers values")
    print(answer)
    print(session.get("quiz4State", {}).get("user_answer"))

    # ✅ Optional: increment score if correct and not already counted
    if is_correct and not session["quiz4State"].get("scored", False):
        print("!!!!  inside if !!!!!")
        session["score"] = session.get("score", 0) + 1
        print(session["score"])
        session["quiz4State"]["scored"] = True

    return jsonify({"message": "Quiz 4 answer saved successfully."})

@app.route("/submit-quiz/5", methods=["POST"])
def submit_quiz_5():
    data = request.get_json()
    answer = data.get("answer")
    is_correct = data.get("is_correct")

    # Save quiz 4 state directly to session (like quiz_1, quiz_2, etc.)
    session["quiz_5"] = {
        "answered": True,
        "is_correct": is_correct,
        "scored": False,
        "user_answer": answer
    }
    print("User answers values")
    print(answer)
    print(session.get("quiz_5", {}).get("user_answer"))

    # ✅ Optional: increment score if correct and not already counted
    if is_correct and not session["quiz_5"].get("scored", False):
        print("!!!!  inside if !!!!!")
        session["score"] = session.get("score", 0) + 1
        print(session["score"])
        session["quiz_5"]["scored"] = True

    return jsonify({"message": "Quiz 5 answer saved successfully."})


CORRECT_ORDER = ['Cleansing & Prepping', 'Nourishing', 'Protecting']

@app.route('/submit-final-order', methods=['POST'])
def submit_final_order():
    data = request.get_json()
    user_order = data.get('answer', [])

    is_correct = user_order == CORRECT_ORDER

    # Save to session
    session["quiz_7"] = {
        "answered": True,
        "user_answer": user_order,
        "is_correct": is_correct,
        "scored": False
    }

    # Optional: update score if not already counted
    if is_correct and not session["quiz_7"].get("scored", False):
        session["score"] = session.get("score", 0) + 1
        session["quiz_7"]["scored"] = True

    return jsonify({'correct': is_correct})

@app.route("/submit-detective-quiz", methods=["POST"])
def submit_detective_quiz():
    data = request.get_json()
    user_answers = data.get("answers", {})  # should be dict {q1: "selected answer text", ...}
    print(user_answers)

    total_correct = 0
    quiz_states = session.get('detective_quiz', {})  # Load existing states if any

    correct_answers = {
        "q1": "Cleanser with Salicylic Acid",
        "q2": "Spot Treatment with Sulfur",
        "q3": "Ceramides",
        "q4": "True"
    }

    for question, correct in correct_answers.items():
        user_answer = user_answers.get(question)
        print(user_answer)

        if user_answer == correct:
            is_correct = True
        else:
            is_correct = False
        print(is_correct)

        previous_state = quiz_states.get(question + "State", {})
        already_scored = previous_state.get("scored", False)

        # Only increment if correct and not already scored
        if is_correct and not already_scored:
            total_correct += 1

        quiz_states[question + "State"] = {
            "answered": user_answer is not None,
            "is_correct": is_correct,
            "scored": is_correct or already_scored,  # if correct now or already scored before
            "user_answer": user_answer
        }

    # Save updated state
    session['detective_quiz'] = quiz_states

    print(total_correct)

    # Update session score ONLY with newly correct answers
    session["score"] = session.get("score", 0) + total_correct

    print("User's Total Score in session:", session.get("score", 0))

    return jsonify({
        "total_correct": total_correct,
        "score": session["score"],
        "quiz_states": quiz_states
    })

@app.route("/save-skintype", methods=["POST"])
def save_skintype():
    data = request.get_json()
    user_skin_type = data["skinType"][0]
    session["skinType"] = user_skin_type
    return jsonify({"status": "saved"})

@app.route("/save-build-routine", methods=["POST"])
def save_buildroutine():
    data = request.get_json()
    user_routine = data["routine_step"]
    session["routine_step"] = user_routine
    return jsonify({"status": "saved"})

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
        "quiz3State": session.get("quiz_3", {}), 
        "quiz4State": session.get("quiz4State", {}),  # ✅ Now it will save properly
        "quiz5State": session.get("quiz_5", {}),
        # "quiz6State": session.get("quiz_6", {}),
        "quiz7State": session.get("quiz_7", {}),
        "routineState": session.get("routineState", {}),
        "skinType": session.get("skinType", None),
        "routine_step": session.get("routine_step")
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

@app.route("/quiz/1")
def quiz_q1():
    return render_template("quiz_q1.html")

# -------------------
if __name__ == '__main__':
    app.run(debug=True, port=5004)