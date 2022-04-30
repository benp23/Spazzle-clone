"""
    File: User.py
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Class to make and store user information.
                Limited functions as of now, will add more later.
                
"""

import sqlite3
from flask_restful import Resource, reqparse
#from Game import total_games
#using reqparse despite its depreciated status

class User(Resource):
    """
    Description: Currently only provides User find functionality. Adding more for interacting as userspecific tables
    """
    TABLE_NAME = 'user_table'
    
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        type = str,
                        required = True,
                        help = "Please enter a username"
                        )
    parser.add_argument('game_mode',
                        type = str,
                        required = False,
                        help = "Game mode not selected"
                        )
    
    def get(self):
        data = User.parser.parse_args()
        if User.find_user(data['username']):
            return {"message": data['username']+ " is good"}
        return {"message": data['username'] + " needs to register"}
    #if not in table, return error (do not register)
    #not really needed on its own. Might include as a method to "get all"
    
    def post(self):
        '''
            Post will be when page loads
            increments the game_run and adds it to the total table
            also adds in the game mode of that run
        '''
        data = User.parser.parse_args()
        
        user_table = data['username'] + '_game_total_table'

        selection = self.find_current_game_run_number(user_table)
        
        self.set_next_game_run(user_table, selection, data['game_mode'])
        
        return {"message": selection}
    
    def find_current_game_run_number(self, user_table):
        connection = sqlite3.connect('data.db')
        
        cursor = connection.cursor()
        
        query = '''SELECT game_run FROM {table} ORDER BY game_run DESC'''.format(table = user_table)
        
        selection = cursor.execute(query).fetchone()
        
        connection.close()
        if selection:
            return selection[0]
        return 0
        
    def set_next_game_run(self, user_table, game_run_number, game_mode):
        connection = sqlite3.connect('data.db')
        game_run_number += 1
        cursor = connection.cursor()
        
        query = '''INSERT INTO {table} VALUES (?, ?, 0,0)'''.format(table = user_table)
        
        cursor.execute(query, (game_run_number, game_mode))
        
        connection.commit()
        connection.close()
        
        
    @classmethod
    def find_user(cls, username):
        """
            Description: Returns boolean if user already exists in database.
            Parameters
            ----------
                username: Str, Required, Uniques
        """
        connect = sqlite3.connect('data.db')
        cursor = connect.cursor()
        
        query = "SELECT * FROM {table} WHERE username =?".format(table=cls.TABLE_NAME)
        
        result = cursor.execute(query, (username,))
        row = result.fetchone()
        connect.close()
        
        if row:
            return True
        return False