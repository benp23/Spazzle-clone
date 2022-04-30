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
    TABLE_NAME = '_game_total_table'
        
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
    parser.add_argument('game_mode',
                        required = False,
                        help = "no game mode"
                        )
    parser.add_argument('level_reached',
                        type = int,
                        required = False,
                        help = "No level entered"
                        )
    parser.add_argument('total_game_time',
                        type = float,
                        required = False,
                        help = "No time added"
                        )

    @classmethod
    def find_game(cls, table_name, game_run):
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        
        query = "SELECT * FROM {table} WHERE game_run =?".format(table = table_name) 
        #This is going to grab all rows; can specific w/ this lster
        
        rows = cursor.execute(query, (game_run,))
        
        row = rows.fetchone()
        
        return row
        
    def get(self):
        """ Returns total time of run as JSON
            Parameters
            ----------
            
            username: str, required
            game_run: int, required
            """
        data = total_games.parser.parse_args()
        
        if not User.find_user(data['username']):
            return {"message": "{name} was not found.".format(name = data['username'])}
       
       
        table_name = data['username']+self.TABLE_NAME
        
        row = self.find_game(table_name, data['game_run'])
        if row:
            return {"game_run":row[0], "game_mode":row[1], "Level Reached":row[2], "total_game_time":row[3]} 
       
        return {"message": "No Game Found"}
       
        
    def post(self):
        """Sends game run data to database for storage and further processing
            Parameters
            ----------
            
            username: str, required
            game_run: int, required
            total_game_time: float, required"""
        
        data = total_games.parser.parse_args()
        
        if not User.find_user(data['username']):
            return {"message": "No user was found."}
        
        table_name = data['username']+self.TABLE_NAME
        
        row = self.find_game(table_name, data['game_run'])
        
        if row:
            #return {"message": "That game is already entered. Use Put if changes are needed"}
            return {"message": "Game Run is already entered", "game_run": data['game_run'], "game_mode": data['game_mode'],
                    "Level Reached": data['level_reached'], "total_game_time": data['total_game_time']}
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        query = "INSERT INTO {table} VALUES (?, ?, ?, ?)".format(table=table_name)
        cursor.execute(query, (data['game_run'], data['game_mode'], data['level_reached'], data['total_game_time']))

        connection.commit()
        connection.close()
        
        return {"message": "Game Run added", "game_run": data['game_run'], "game_mode": data['game_mode'], 
                "level_reached": data['level_reached'], "total_game_time": data['total_game_time']}
        
        
        
class single_games(Resource):
    TABLE_NAME = '_game_times_table'
	
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Error: Generic"
                        )
    parser.add_argument('game_run',
                        type = int,
                        required = True,
                        help = "Not accepted format for Game run"
                        )
    parser.add_argument('game_mode',
                        required = False,
                        help = "no game mode"
                        )
    parser.add_argument('game_level',
                        type = int,
                        required = True,
                        help = "No level entered"
                        )
    parser.add_argument('game_type',
                        required = True,
                        help = "No games Found"
                        )
    parser.add_argument('game_time',
                        type = float,
                        required = True,
                        help = "No time added"
                        )
                        
        
    def post(self):
        data = single_games.parser.parse_args()
        
        if not User.find_user(data['username']):
            return {"message": "No user was found."}
        
        table_name = data['username']+self.TABLE_NAME
        
        #row = self.find_game(table_name, data['game_run'])
   
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()

        query = "INSERT INTO {table} VALUES (?,?,?,?,?)".format(table=table_name)
        cursor.execute(query, (data['game_run'], data['game_mode'], data['game_level'], 
                                data['game_type'], data['game_time']))
        connection.commit()
        connection.close()
        
        return {"message": "Game Run added", "game_run":data['game_run'], "game_mode":data['game_mode'], 
                "game_level": data['game_level'], "game_type": data['game_type'], "game_time": data['game_time']}
        
        
    def get(self):
        return {"message": "No functionality"}
    
    @classmethod
    def find_game(cls, table_name, game_run):
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        
        query = "SELECT * FROM {table} WHERE game_run =?".format(table = table_name) 
        #This is going to grab all rows; can specific w/ this lster
        
        rows = cursor.execute(query, (game_run,))
        
        row = rows.fetchone()
        
        return row
        