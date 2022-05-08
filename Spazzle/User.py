"""
    File: User.py
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Class to make and store user information. 
                Methods increment and start db log for game runs
                
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
    global game_mode
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
    
    
    def post(self):
        '''
            Description: Called at page load for preparing tables for other methods and classes
            Parameters
            ----------
                None
        '''
        global game_mode
        data = User.parser.parse_args()
        
        user_table = '{name}_game_total_table'.format(name = data['username'].capitalize())

        selection = self.find_current_game_run_number(user_table)
        
        new_selection = self.set_next_game_run(user_table, selection, data['game_mode'])
        
        game_mode = data['game_mode']
        
        return {"message": new_selection}
    
    def find_current_game_run_number(self, user_table):
        """
            Description: returns the current game run number for the user and use in other classes
            Parameters
            ----------
                user_table: St
        """
        connection = sqlite3.connect('data.db')
        
        cursor = connection.cursor()
        
        query = '''SELECT game_run FROM {table} ORDER BY game_run DESC'''.format(table = user_table)
        
        selection = cursor.execute(query).fetchone()
        
        connection.close()
        if selection:
            return selection[0]
        return 0
        
    def get_game_mode(self):
        global game_mode
        return game_mode
        
    def set_next_game_run(self, user_table, game_run_number, game_mode):
        """
            Description: Sets up the next game run in the user's table
            Parameters
            ----------
                user_table: Str
                game_run_number: Int
                game_mode: Str
        """
        connection = sqlite3.connect('data.db')
        game_run_number += 1
        try:
            cursor = connection.cursor()
            
            query = '''INSERT INTO {table} VALUES (?, ?, 0,0)'''.format(table = user_table)
            
            cursor.execute(query, (game_run_number, game_mode))
            
            connection.commit()
            connection.close()
            
            return game_run_number
        except Error:
            connection.close()
            return Error
            
    @classmethod
    def find_user(cls, username):
        """
            Description: Returns boolean if user already exists in database.
            Parameters
            ----------
                username: Str, Required, Uniques
        """
        try:
            connect = sqlite3.connect('data.db')
            cursor = connect.cursor()
            
            query = "SELECT * FROM {table} WHERE username =?".format(table=cls.TABLE_NAME)
            
            result = cursor.execute(query, (username,))
            row = result.fetchone()
            connect.close()
            
            if row:
                return True
            return False
        except Error:
            connection.close()
            return Error