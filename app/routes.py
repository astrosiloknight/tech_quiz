from app import app

from flask import url_for, jsonify, request, session, redirect
from flask import render_template
import sys
import json

from app.models import db, Quiz, Question
from app.quiz_maker import make_quiz, get_quiz, update_quiz

@app.route('/')
def hello_world():
	return redirect('quiz');

@app.route('/update', methods=['POST'])
def update():
	content = json.loads(request.data)
	quiz_id = content.get('quizId', None)
	answers = content.get('selected', None)
	if quiz_id and answers:
		return update_quiz(quiz_id, answers)
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
		exercises=json.dumps(obj['questions']), answers=json.dumps(obj['answers']), quiz_id=quiz_id) 

@app.route('/add_question', methods=['POST', 'GET'])
def add_question():
	error = False
	if request.method == 'POST':
		content = json.loads(request.data)
		question = content.get('question', None)
		answers = content.get('answers', None)
		question_type = content.get('questionType', None)
		if(question and answers and question_type):
			try:
				exercise = Question(description=question, answers=answers, question_type=question_type)
				Question.insert(exercise)
				question_id = exercise.id
			except:
				error = True
				app.logger.info(sys.exc_info())
			finally:
				db.session.close()
		if error:
			return json.dumps({'success': False})
		return json.dumps({'success': True, 'questionId': question_id})
	else:
		return render_template('add_question.html')