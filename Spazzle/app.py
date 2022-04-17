from flask import Flask, render_template, url_for
from flask_restful import Resource, Api
from db_create import db_c
from User import User
from Register import Register
from Game import total_games


app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = True
api=Api(app)
#This is just to create a new db so we can delete other databases while ensuring the data
#is going through/coming out correctly w/o old objects getting in the way
#db = db_c().create("dataffbank") 

db = db_c('data').create()

@app.route('/')
@app.route('/home')
@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/game')
def game():
    return render_template('game_template.html')
    
@app.route('/stats')
def stats():
    return render_template('stats.html')

api.add_resource(User, '/users')
api.add_resource(Register, '/users/register') #current functionality is also done by user
api.add_resource(total_games, '/game/total')

if __name__ == '__main__':
    app.run(port = 5000, debug = True)