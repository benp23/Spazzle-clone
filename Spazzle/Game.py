"""
    File: Game File
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Set of API classes for post/get methods for game information
"""
import sqlite3
from User import User
from flask_restful import Resource, reqparse
#using reqparse despite its depreciated status

class total_games(Resource):
    """Class for accessing database information related to total game information"""
    TABLE_NAME = 'game_total_table'
        
    #Set up parser for json input. Set input variable accepted
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Error: Generic"
                        )
    parser.add_argument('game_run',
                        type = int,
                        required = False,
                        help = "No games Found"
                        )
    parser.add_argument('total_game_time',
                        type = float,
                        required = False,
                        help = "No time added"
                        )

    def get(self):
        """ Returns total time of run as JSON
            Parameters
            ----------
            
            username: str, required
            game_run: int, required
            """
            
        data = total_games.parser.parse_args()
        
        if not User.find_user(data['username']):
            return {"message": "No user was found."}
            
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        
        query = "SELECT * FROM {table} WHERE username=?".format(table=self.TABLE_NAME)
        
        rows = cursor.execute(query, (data['username'],))
        
        for row in rows:
            if row[1] == data['game_run']:
                return {"username": row[0], "game_run":row[1], "total_game_time":row[2]}
        
        connection.commit()
        connection.close()
        return {"message": "No Game Found"}
        
    def post(self):
    """ Sends game run data to database for storage and further processing
            Parameters
            ----------
            
            username: str, required
            game_run: int, required
            total_game_time: float, required
            """
        data = total_games.parser.parse_args()
        
        if not User.find_user(data['username']):
            return {"message": "No user was found."}
        
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()

        query = "INSERT INTO {table} VALUES (?,?, ?)".format(table=self.TABLE_NAME)
        cursor.execute(query, (data['username'], data['game_run'], data['total_game_time']))

        connection.commit()
        connection.close()
        
        return {"message": "Game Run added"}
        
class single_games(Resource):
    TABLE_NAME = 'game_total_table'
	
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Error: Generic"
                        )
    parser.add_argument('game_type',
                        type = int,
                        required = False,
                        help = "No games Found"
                        )
    parser.add_argument('game_time',
                        type = float,
                        required = False,
                        help = "No time added"
                        )
                        
        
    def post(self):
        return