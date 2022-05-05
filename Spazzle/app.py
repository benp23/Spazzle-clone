"""
    File: app
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Starting point for the flask set up and functionality
                Some parts of this will be partially migrated to other files later
                
"""

from flask import Flask, render_template, url_for
from flask_restful import Resource, Api
from db_create import db_c
from User import User
from Register import Register
from Game import total_games, single_games
from statistics import statistics
from leaderboard import leaderboard

app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = True
api=Api(app)

#create database for use
db = db_c('data')
db.leader_set(100)


#set hmtl routes
@app.route('/')
@app.route('/home')
@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/game', methods = ['GET', 'PUT','POST'])
@app.route('/game/total', methods = ['GET', 'PUT'])
def game():
    return render_template('game_template.html')
    
@app.route('/stats')
def stats():
    return render_template('stats.html')

@app.route('/gametest')
def gametest():
    return render_template('color_memory.html')
    
@app.route('/gametest2')
def gametest2():
    return render_template('addition.html')
    
#set api functionality routes
api.add_resource(User, '/users')
api.add_resource(Register, '/users/register') #"username":<string>
api.add_resource(total_games, '/game/total/<int:game_run>') 

    #post info :: "username":<string>, "game_run":<int>, "total_game_time":float
    #get into :: "username":<string>, "game_run":<int>
api.add_resource(single_games, '/game/time')
    #Post info: "username":<string>, "game_run":<int>, "game_type":<int>, "game_time":<float>
    #Get info: "username":<string>, "game_run":<int>, "game_type":<int>
api.add_resource(statistics, '/stats')
api.add_resource(leaderboard, '/leaders')

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True, ssl_context="adhoc")
