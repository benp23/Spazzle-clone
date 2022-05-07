"""
    File: Game File
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Set of API classes for post/get methods for game information
"""
import sqlite3
from sqlite3 import Error
from flask_restful import Resource, reqparse
#using reqparse despite its depreciated status

class leaderboard(Resource):


    '''
        Table:
            Position | Username | Game Level | Game_time | Game_Mode 
    '''
    

    def get(self, game_mode, top_number):
        #data = leaderboard.parser.parse_args()
        
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
    
    

