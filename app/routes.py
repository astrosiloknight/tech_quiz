from app import app

from flask import url_for, jsonify, request, session, redirect
from flask import render_template
import sys
import json
import secrets
import hashlib

from app.models import db, Question
from app.quiz_maker import make_quiz, get_quiz, update_quiz, submit_quiz, ranking

salt = 'to_be_changed'

@app.route('/login', methods=['POST'])
def login():
	content = json.loads(request.data)
	password = content.get('password')
	pa = password.encode()
	sa = salt.encode()
	h = hashlib.sha256(pa + sa).hexdigest()
	return json.dumps({'success': True, 'password': h})

@app.route('/')
def hello_world():
	return redirect('quiz');

@app.route('/update', methods=['POST'])
def update():
	content = json.loads(request.data)
	quiz_id = content.get('quizId', None)
	answers = content.get('selected', None)
	state = content.get('state', None)
	if quiz_id and answers and state:
		app.logger.info('updated')
		return update_quiz(quiz_id, answers, state)
	else:
		return json.dumps({'success': False, 'error': 'routes/update'})

@app.route('/quiz', methods=['POST', 'GET'])
def quiz():
	if request.method == 'POST':
		content = json.loads(request.data)
		name = content.get('name', None)
		if name:
			return make_quiz(name)
	else:
		return render_template('quiz.html')

@app.route('/quiz/<int:quiz_id>')
def quiz_instance(quiz_id):
	obj = get_quiz(quiz_id)
	return render_template('quiz_quiz.html', name=obj['name'], time=obj['time'],
		exercises=json.dumps(obj['questions']), answers=json.dumps(obj['answers']), quiz_id=quiz_id, state=obj['state']) 

@app.route('/submit', methods=['POST'])
def submit():
	app.logger.info('submitting')
	content = json.loads(request.data)
	quiz_id = content.get('quizId', None)
	answers = content.get('selected', None)
	if quiz_id and answers:
		return submit_quiz(quiz_id, answers)
	else:
		return json.dumps({'success in submit': False})

@app.route('/power_ranking')
def power_ranking():
	power = ranking()
	return render_template('ranking.html', ranking=power)

@app.route('/power_ranking/<int:rank_id>')
def power_ranking_one(rank_id):
	power = ranking()
	return render_template('ranking.html', ranking=power, rank_id=rank_id)

@app.route('/add_question', methods=['POST', 'GET'])
def add_question():
	error = False
	if request.method == 'POST':
		content = json.loads(request.data)
		question = content.get('question', None)
		answers = content.get('answers', None)
		question_type = content.get('questionType', None)
		url = content.get('url', None)
		app.logger.info(' %s question type' % question_type)
		if(question and answers and question_type):
			try:
				exercise = Question(description=question, answers=answers, question_type=question_type, pic=url)
				Question.insert(exercise)
				question_id = exercise.id
			except:
				error = sys.exc_info()
				app.logger.info(sys.exc_info())
			finally:
				db.session.close()
		if error:
			return json.dumps({'success': False, 'error': str(error)})
		return json.dumps({'success': True, 'questionId': question_id})
	else:
		return render_template('add_question.html')