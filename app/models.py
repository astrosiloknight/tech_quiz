
from app import db #, app

import os
#from sqlalchemy import Column, String, Integer, create_engine, JSON, LargeBinary
#'from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime
#from flask import Flask


#database_name = "games"
#database_path = 'postgres://fwkpnotv:1wvhldt6f766_VfD2ighEipij_Q9xQJL@rogue.db.elephantsql.com:5432/fwkpnotv'
# FOR REPL
#database_path = 'postgres://fwkpnotv:1wvhldt6f766_VfD2ighEipij_Q9xQJL@rogue.db.elephantsql.com:5432/fwkpnotv'
# FOR HOME POSTGRES
# database_path = 'postgresql://postgres_user:9Krokodilai@localhost:5432/games'
# HEROKU
#DATABASE_URL = os.environ['DATABASE_URL']
#database_path = DATABASE_URL

#app = Flask(__name__)


#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://fwkpnotv:1wvhldt6f766_VfD2ighEipij_Q9xQJL@rogue.db.elephantsql.com:5432/fwkpnotv'


class Quiz(db.Model):
  __tablename__ = 'quizes'
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  participant = db.Column(db.String(60))
  score = db.Column(db.Integer)
  finished = db.Column(db.Boolean, default=False)
  answers = db.Column(db.JSON)
  duration = db.column(db.Integer)

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
      'date': str(self.date),
      'participant': self.participant,
      'score': self.score,
      'finished': self.finished,
      'answers': self.answers,
      'duration': self.duration
    }

class Question(db.Model):
  __tablename__ = 'questions'
  id = db.Column(db.Integer, primary_key=True)
  question_type = db.Column(db.String(20), default='question')
  description = db.Column(db.String(200))
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

