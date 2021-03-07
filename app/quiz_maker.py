
from app import app

import datetime
import random
import sys
import json

from app.models import db, Quiz, Question, Comment

def make_quiz(name, ip):
	bulk = []
	error = False
	try:
		#num = Question.query.count()
		questions = Question.query.all()
		for question in questions:
			temp = []
			temp.append(question.description)
			temp_answers = question.answers
			if question.question_type != 'match':
				random.shuffle(temp_answers)
			temp.append(temp_answers)
			temp.append(question.question_type)
			if question.question_type == 'match':
				temp.append(question.pic)
			bulk.append(temp)
		random.shuffle(bulk)
		app.logger.info(sys.exc_info())
	except:
		error = True
		app.logger.info(sys.exc_info())
	if not error:
		try:
			quiz = Quiz(participant=name, questions=bulk, answers={}, ip=ip)
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
	error_msg = False
	try:
		quiz = Quiz.query.filter_by(id=quiz_id).first()
		if quiz.finished == True:
			error = True
		nice_obj = quiz.format()
		date = quiz.date
		questions = quiz.questions
		for question in questions:
			if question[2] != 'match':
				for ans in question[1]:
					del ans[1]
	except:
		error = True
		app.logger.info(sys.exc_info())
		error_msg = sys.exc_info()
	finally:
		db.session.close()
	if error:
		return {'success': False, 'error': error_msg}
	else:
		return {'success': True, 'name': nice_obj['participant'], 'time': date, 'questions': questions, 'answers':nice_obj['answers'], 
		'state': nice_obj['state']}

def update_quiz(quiz_id, answers, state):
	error = False
	try:
		quiz = Quiz.query.filter_by(id=quiz_id).first()
		quiz.answers = answers
		quiz.state = state
		quiz.update()
	except:
		error = True
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return json.dumps({'success': False})
	else:
		return json.dumps({'success': True})

def submit_quiz(quiz_id, answers):
	error = False
	now = datetime.datetime.now()
	try:
		quiz = Quiz.query.filter_by(id=quiz_id).first()
		quiz.answers = answers
		quiz.finished = True
		points = 0
		for i in range(len(quiz.questions)):
			if str(i) in answers.keys():
				if quiz.questions[i][2] == 'question':
					s = answers[str(i)]
					app.logger.info(' %s type(answers[str(i)])' % type(int(s)))
					chosen_answer = int(answers[str(i)]) - 1
					if quiz.questions[i][1][chosen_answer][1] == "true":
						points += 1
						app.logger.info(' %s point added' % quiz.questions[i])
				elif quiz.questions[i][2] == 'positional':
					order = answers[str(i)]
					app.logger.info(' %s order' % order)
					point = True
					positional_points = 0
					for n in range(len(quiz.questions[i][1])):
						if order[n] not in quiz.questions[i][1]:
							point = False
							order[n].append('false')
						else:
							positional_points += 0.1
							order[n].append('true')
					if point:
						points += 1
						app.logger.info(' %s point added' % quiz.questions[i])
					else:
						points += positional_points
				elif quiz.questions[i][2] == 'match':
					match_point = True
					match_points = 0
					for key, value in answers[str(i)].items():
						if key == value.split('-')[1]:
							match_points += 0.1;
						else:
							match_point = False
					if match_point:
						points += 1
						app.logger.info(' %s point added' % quiz.questions[i])
					else:
						points += match_points
		quiz.score = round(points, 1)
		quiz.duration = (now - quiz.date).total_seconds()
		quiz.update()
		app.logger.info(' %s quiz format' % quiz.format())
	except:
		error = sys.exc_info()
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return json.dumps({'success': False, 'error': str(error)})
	else:
		return json.dumps({'success': True})

def ranking():
	power = False
	try:
		ranks = Quiz.query.filter_by(finished = True, deleted = False).order_by(Quiz.score.desc(), Quiz.duration.asc()).all()
		if ranks:
			power = []
			for rank in ranks:
				power.append(rank.format())
	except:
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if power:
		return power


def get_quiz_view(quiz_id):
	error = False
	try:
		quiz = Quiz.query.filter_by(id=quiz_id).first()
		nice_obj = quiz.format()
		duration = quiz.duration
	except:
		error = True
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return {'success': False, 'error': sys.exc_info()}
	else:
		return {'name': nice_obj['participant'], 'time': duration, 'questions': nice_obj['questions'], 'answers':nice_obj['answers'], 
		'state': nice_obj['state']}

def make_comment(quiz_id, comment, name, ip):
	error = False
	try:
		comment = Comment(quiz_id=quiz_id, name=name, comment=comment, ip=ip)
		Comment.insert(comment)
	except:
		error = True
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return {'success': False, 'error': sys.exc_info()}
	else:
		return {'success': True}

def delete_quiz(quiz_id, ip):
	error = False
	try:
		quiz = Quiz.query.filter_by(id=quiz_id).first()
		quiz.deleted = True
		quiz.terminator = ip
		quiz.delete_date = datetime.datetime.now()
		quiz.update()
	except:
		error = True
		app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return {'success': False, 'error': sys.exc_info()}
	else:
		return {'success': True}