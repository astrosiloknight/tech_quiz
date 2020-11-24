
from app import app

import random
import sys
import json

from app.models import db, Quiz, Question



def make_quiz(name):
	bulk = []
	error = False
	try:
		#num = Question.query.count()
		questions = Question.query.all()
		for question in questions:
			temp = []
			temp.append(question.description)
			temp_answers = question.answers
			random.shuffle(temp_answers)
			temp.append(temp_answers)
			temp.append(question.question_type)
			bulk.append(temp)
		random.shuffle(bulk)
		app.logger.info(sys.exc_info())
	except:
		error = True
		app.logger.info(sys.exc_info())
	if not error:
		try:
			quiz = Quiz(participant=name, questions=bulk, answers={})
			Quiz.insert(quiz)
			quiz_id = quiz.id
		except:
			error = True
			app.logger.info(sys.exc_info())
	db.session.close()	
	if error:
		return json.dumps({'success': False})
	return json.dumps({'success': True, 'quizId': quiz_id, 'bulk': bulk})

def get_quiz(quiz_id):
	error = False
	try:
		quiz = Quiz.query.filter_by(id=quiz_id).first()
		nice_obj = quiz.format()
		questions = quiz.questions
		for question in questions:
			for ans in question[1]:
				del ans[1]
	except:
		error = True
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return {'success': False}
	else:
		return {'name': nice_obj['participant'], 'time': nice_obj['date'], 'questions': questions, 'answers':nice_obj['answers']}

def update_quiz(quiz_id, answers):
	error = False
	try:
		quiz = Quiz.query.filter_by(id=quiz_id).first()
		quiz_time = str(quiz.date)
		quiz.answers = answers
		quiz.update()
	except:
		error = True
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return json.dumps({'success': False})
	else:
		return json.dumps({'success': True, 'quiz_time': quiz_time})
