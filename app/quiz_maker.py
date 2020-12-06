
from app import app

import datetime
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
    date = quiz.date
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
    return {'success': False, 'error': sys.exc_info()}
  else:
    return {'name': nice_obj['participant'], 'time': date, 'questions': questions, 'answers':nice_obj['answers'], 
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
      chosen_answer = answers[str(i)] -1
      if quiz.questions[i][2] == 'question':
        if quiz.questions[i][1][chosen_answer][1] == "true":
          points += 1
      elif quiz.questions[i][2] == 'positional':
        order = answers[str(i)] -1
        point = True
        for n in range(len(quiz.questions[i][1])):
          if order[n] != quiz.questions[i][1][n][0]:
            point = False;
        if point:
          points += 1
    quiz.score = points
    app.logger.info(' %s now' % now)
    quiz.duration = (now - quiz.date).total_seconds()
    app.logger.info(' %s duration' % quiz.duration)
    quiz.update()
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
    ranks = Quiz.query.filter_by(finished = True).order_by(Quiz.score.desc(), Quiz.duration.asc()).all()
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
