"""
    File: Leaderboard.py
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Provides a get method to retrieve leaderboard data
"""
import sqlite3
from sqlite3 import Error
from flask_restful import Resource, reqparse
#using reqparse despite its depreciated status

class leaderboard(Resource):
    """
        Class provides API method GET leaderboard postiions
    """
    
    
    '''
        Table:
            Position | Username | Game Level | Game_time | Game_Mode 
    '''
    

    def get(self, game_mode, top_number):
        '''
            Descritpion: Returns top runs up to the passed number, not to exceed 100
            Params
            ---------
                    game_mode: Str, None return all game modes 
                    top_number: int, None returns all positions
        '''
        if top_number is None:
            top_number = 100
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            
            table_name = "{mode}_leaderboard".format(mode = game_mode.lower())
            
            query = '''SELECT * FROM {table} ORDER BY position ASC'''.format(table = table_name)
            rows = cursor.execute(query).fetchmany(top_number)
            
            cursor.close()
            
            return rows
        except Error:
            connection.close()
            return Error
    
    

