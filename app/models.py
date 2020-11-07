
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


class Question(db.Model):
  __tablename__ = 'questions'
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  type = db.Column(db.String(20), default='question')

class State(db.Model):
  __tablename__ = 'states'
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  game_id = db.Column(db.Integer, db.ForeignKey('games.id',  onupdate="CASCADE", ondelete="CASCADE"))
  games = db.relationship('Game', backref=db.backref('state', lazy=True))
  move_number = db.Column(db.Integer, nullable=False)
  move = db.Column(db.String(20), nullable=False)
  position = db.Column(db.JSON, nullable=False)
  black_timer = db.Column(db.Integer, nullable=False, default=0)
  white_timer = db.Column(db.Integer, nullable=False, default=0)
  time_limit = db.Column(db.Integer, default=0)

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
      'game_id': self.game_id,
      'move_number': self.move_number,
      'position': self.position,
      #'game': self.games,
      'move': self.move,
      'white_timer': self.white_timer,
      'black_timer': self.black_timer,
      'time_limit': self.time_limit
    }


class Game(db.Model):
  __tablename__ = 'games'
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  player_one = db.Column(db.Integer, db.ForeignKey('players.id',  onupdate="CASCADE", ondelete="CASCADE"))
  player_two = db.Column(db.Integer, db.ForeignKey('players.id',  onupdate="CASCADE", ondelete="CASCADE"))
  player = db.relationship('Player', foreign_keys=[player_one],  backref=db.backref('game', lazy=True))
  oponent = db.relationship('Player', foreign_keys=[player_two], backref=db.backref('game_against', lazy=True))
  time_limit = db.Column(db.Integer, default=0)
  winner = db.Column(db.Integer, default=0)
  offer_id = db.Column(db.Integer)
  
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
      'date': self.date,
      'playerOne': self.player_one,
      'playerTwo': self.player_two,
      'winner': self.winner,
      'time_limit': self.time_limit,
      'offer': self.offer_id
    }

class Offer(db.Model):
  __tablename__ = 'offers'
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  player_one = db.Column(db.Integer, db.ForeignKey('players.id',  onupdate="CASCADE", ondelete="CASCADE"))
  player = db.relationship('Player', foreign_keys=[player_one],  backref=db.backref('offer', lazy=True))
  time_limit = db.Column(db.Integer, default=0)
  public = db.Column(db.Boolean, default=True)

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
      'date': self.date,
      'playerOne': self.player_one,
      'time_limit': self.time_limit
    }

class Player(db.Model):  
  __tablename__ = 'players'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(40), nullable=False, default='Guest')
  email = db.Column(db.String(50), nullable=False, default='Guest')
  pick = db.Column(db.String(100), default='/pics/baby.svg')
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  rating = db.Column(db.Integer, nullable=False, default='100')
  password = db.Column(db.String(50), default='guest')
  random = db.Column(db.String(100))
  updated = db.Column(db.DateTime, onupdate=datetime.utcnow)
  location = db.Column(db.String(50))

  # def __init__(self, name, email, rating):
  #   self.name = name
  #   self.email = email
  #   self.rating = rating

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
      'email': self.email,
      'date': self.date,
      'rating': self.rating,
      'password': self.password,
      # -- TO DELEAT
      'random': self.random,
      'random_time': self.random_time,
      'location': self.location
    }
