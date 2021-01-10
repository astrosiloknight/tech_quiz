import os

class Config(object):
  DEBUG = True
  SECRET_KEY = os.environ.get('SECRET_KEY')  or b'_5#y2L"F4Q8z\n\xec]/'
  SQLALCHEMY_DATABASE_URI = 'postgresql://postgres_user:9Krokodilai@localhost:5432/tech_quiz' #os.environ.get('DATABASE_URL')
  #SQLALCHEMY_DATABASE_URI = 'postgres://yifsxpuo:Hrq7vJdvVUjHQrfN77OU9sPwS2petk0P@kandula.db.elephantsql.com:5432/yifsxpuo'
  SQLALCHEMY_TRACK_MODIFICATIONS = False