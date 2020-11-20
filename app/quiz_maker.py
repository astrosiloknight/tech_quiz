
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
			quiz = Quiz(participant=name, answers=bulk)
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
		answers = quiz.answers
		for answer in answers:
			for ans in answer[1]:
				del ans[1]
	except:
		error = True
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	return {'name': nice_obj['participant'], 'time': nice_obj['date'], 'answers': answers}