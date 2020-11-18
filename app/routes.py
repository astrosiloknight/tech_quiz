from app import app

from flask import url_for, jsonify, request, session, redirect
from flask import render_template
import sys
import json

from app.models import db, Quiz, Question

@app.route('/')
def hello_world():
	return 'hello_world'

@app.route('/quiz')
def quiz():
	return render_template('quiz.html')

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
				question_id = Question.id
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