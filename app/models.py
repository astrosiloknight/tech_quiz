
from app import db #, app

import os
#from sqlalchemy import Column, String, Integer, create_engine, JSON, LargeBinary
#'from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime


def time_printer(tot_sec):
  hours = False
  if tot_sec:
    sec = tot_sec % 60
    minutes = (tot_sec - sec)/ 60
    strsec = str(sec)
    if len(strsec) == 1:
      strsec = '0' + strsec
    if minutes > 60:
      temp_min = minutes % 60
      hours = (minutes - temp_min)/ 60
      minutes = temp_min
    strmin = str(round(minutes))
    if len(strmin) == 1:
      strmin = '0' + strmin
    if hours:
      return str(round(hours)) + ':' + strmin + ':' + strsec
    else:
      return strmin + ':' + strsec
  else:
    return tot_sec


class Quiz(db.Model):
  __tablename__ = 'quizes'
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  participant = db.Column(db.String(60))
  score = db.Column(db.Float)
  finished = db.Column(db.Boolean, default=False) 
  questions = db.Column(db.JSON)
  answers = db.Column(db.JSON)
  duration = db.Column(db.Integer)
  state = db.Column(db.Integer, default=0)
  comments = db.Column(db.String(500))
  commentator =  db.Column(db.String(30))
  ip = db.Column(db.String(30))

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'date': str(self.date.date()),
      'participant': self.participant,
      'score': self.score,
      'finished': self.finished,
      'questions': self.questions,
      'answers': self.answers,
      'duration': time_printer(self.duration),
      'state':self.state,
      'comment': self.comments,
      'ip': self.ip,
      'commentator': self.commentator
    }

class Delete(db.Model):
  __tablename__ = 'deletes'
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  participant = db.Column(db.String(60))
  score = db.Column(db.Float)
  finished = db.Column(db.Boolean, default=False) 
  questions = db.Column(db.JSON)
  answers = db.Column(db.JSON)
  duration = db.Column(db.Integer)
  state = db.Column(db.Integer, default=0)
  comments = db.Column(db.String(500))
  commentator =  db.Column(db.String(30))
  ip = db.Column(db.String(30))
  terminator = db.Column(db.String(30))

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'date': str(self.date.date()),
      'participant': self.participant,
      'score': self.score,
      'finished': self.finished,
      'questions': self.questions,
      'answers': self.answers,
      'duration': time_printer(self.duration),
      'state':self.state,
      'comment': self.comments,
      'ip': self.ip,
      'commentator': self.commentator,
      'terminator': self.terminator
    }

class Question(db.Model):
  __tablename__ = 'questions'
  id = db.Column(db.Integer, primary_key=True)
  question_type = db.Column(db.String(20), default='question')
  description = db.Column(db.String(1000))
  pic = db.Column(db.String(50))
  answers = db.Column(db.JSON, nullable=False)

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'question_type': self.question_type,
      'description': self.description,
      'pic': self.pic,
      'problem': self.problem
    }

class Account(db.Model):
  __tablename__ = 'accounts'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50))
  so_secret = db.Column(db.String(150))
  token = db.Column(db.String(50))
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'secret': self.secret,
      'token': self.token
    }


