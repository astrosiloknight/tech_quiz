from app import app

from flask import url_for, jsonify, request, session, redirect
from flask import render_template
import sys
import json


@app.route('/')
def hello_world():
	return 'hello_world'

@app.route('/quiz')
def quiz():
	return render_template('quiz.html')