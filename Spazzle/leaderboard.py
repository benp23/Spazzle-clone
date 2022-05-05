"""
    File: Game File
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Set of API classes for post/get methods for game information
"""
import sqlite3
from flask_restful import Resource, reqparse
#using reqparse despite its depreciated status

class leaderboard(Resource):

    parser = reqparse.RequestParser()
    
    '''
        Table:
            Position | Username | Game Level | Game_time | Game_Mode 
    '''
    def check_leaderboard(self, username, game_time, game_level, game_mode):
        '''
            pulls the table and compares levels/time one by one
            based on game mode calls methods?
                if new game time and level higher then replace
                if new game time or level is higher compare further?
                    
                if new game time is less than time and level move on
            if faster/higher level bubble sort the others down
            
            put the game in teh new opening
        '''
        table_name = game_mode+'_leaderboard'
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        
        
        query = '''SELECT * FROM {table} ORDER BY position ASC'''.format(table = table_name)
        rows = cursor.execute(query).fetchall()

    def get(self):
        
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        
        table_name = "level_leaderboard"
        
        query = '''SELECT * FROM {table} ORDER BY position ASC'''.format(table = table_name)
        rows = cursor.execute(query).fetchall()
        
        return rows
    """
        add a time aspect to the original post that logs a time doesn't need to be called
        then do it again on the final post that compares the time to the back end timer +/- some
        time on either side. 
        
        When doing the leaderboard jusst do top 10, it should naturally scale from there. 
    """
    
    
        

    
    


