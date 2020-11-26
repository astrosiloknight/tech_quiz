
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
    return json.dumps({'success': True})

def submit_quiz(quiz_id, answers):
  error = False
  try:
    quiz = Quiz.query.filter_by(id=quiz_id).first()
    quiz.answers = answers
    quiz.finished = True
    points = 0
    for i in range(len(quiz.questions)):
      chosen_answer = answers[str(i)] -1
      app.logger.info(' %s chosen_answer' % chosen_answer)
      app.logger.info(' %s quiz.questions[1][chosen_answer]' % quiz.questions[i][1])
      if quiz.questions[i][1][chosen_answer][1] == "true":
        points += 1
    app.logger.info(' %s points' % points)
    quiz.score = points
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

def ranking():
  error = False
  try:
    ranks = Quiz.query.filter_by(finished = True).order_by('score').all()
    if ranks:
      power = []
      for rank in ranks:
        power.append(rank.format())
    else:
      error = 'no ranks'
  except:
    error = True
    app.logger.info(sys.exc_info())
  finally:
    db.session.close()
  if error:
    return json.dumps({'success': False, 'error': error})
  else:
    return power