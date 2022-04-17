import sqlite3
from User import User
from flask_restful import Resource, reqparse
#using reqparse despite its depreciated status

class total_games(Resource):
    TABLE_NAME = 'game_total_table'
	
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