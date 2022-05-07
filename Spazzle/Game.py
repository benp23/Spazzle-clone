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
    global class_user 
    class_user = User()
    TABLE_NAME = '_game_total_table'
        
    #Set up parser for json input. Set input variable accepted
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Error: Generic"
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
    
    def find_current_game_run_number(self, username):
        table_name = username.capitalize() + self.TABLE_NAME
        
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        
        query = '''SELECT game_run FROM {table} ORDER BY game_run DESC'''.format(table = table_name)
        
        rows = cursor.execute(query).fetchone()[0]
        
        connection.close()
        
        return rows
        
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
        
        if not User.find_user(data['username'].capitalize()):
            return {"message": "{name} was not found.".format(name = data['username'].capitalize())}
       
        global class_user
        table_name = data['username'].capitalize()+self.TABLE_NAME
        
        row = self.find_game(table_name, data['game_run'])
        if row:
            return {"game_run":row[0], "game_mode":row[1], "Level Reached":row[2], "total_game_time":row[3]} 
            #return row
        return {"message": "No Game Found"}
       
    def put(self, game_run):
        data = total_games.parser.parse_args()
        
        if not User.find_user(data['username'].capitalize()):
            return {"message": "No user was found."}
        
        global class_user
        
        table_name = data['username'].capitalize() + self.TABLE_NAME
        #current_game_run = class_user.find_current_game_run_number(table_name) 
        #try:
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        query = '''UPDATE {table} SET level_reached = ?, game_total_time =? WHERE game_run = ?'''.format(table = table_name)
        cursor.execute(query, (data['level_reached'], data['total_game_time'], game_run))
        connection.commit()
        current_game_mode = class_user.get_game_mode()
            #check leaderboard
            #lb = leaderboard()
            #lb.check_leaderboard(data['username'], data['total_game_time'], data['level_reached'], current_game_mode)
            #push to leaderboard?
        if current_game_mode == "infinite":
            return {"Message":"Updated"}
        add_leaderboard = self.check_leaderboard(data['username'].capitalize(), data['level_reached'], data['total_game_time'])
            
        if add_leaderboard:
            connection.close()
            return {"message": "Added"}
        return {"message": "something went wrong"}
            #return {"Message": "Game run {game_num} updated".format(game_num = current_game_run), "level_reached":data['level_reached'], "total_game_time":data['total_game_time']}        
        #except Error:
            #connection.close()
            #return Error
            
            
    def check_leaderboard(self, username, level_reached, total_game_time):
        global class_user
        
        current_game_mode = class_user.get_game_mode()
        
        #return table_name
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            
            table_name = "{type}_leaderboard".format(type = current_game_mode)
            query = '''SELECT * FROM {table} ORDER BY position ASC'''.format(table = table_name)        
            
            '''
            Table:
                Position | Username | Game Level | Game_time | Game_Mode 
            '''
        
            rows = cursor.execute(query).fetchall()
            
            for row in rows:
                if row[2] == -1:
                    query = '''UPDATE {table} SET username = ?, game_level =?, game_time = ? WHERE position is ?'''.format(table = table_name)
                    
                    cursor.execute(query, (username, level_reached, total_game_time, row[0]))
                    
                    connection.commit()
                    connection.close()
                    return True
                elif level_reached > row[2]: #if current run is further along
                    self.shift_rows(row[0], username) 
                    
                    #return row[0]
                    query = '''UPDATE {table} SET username = ?, game_level =?, game_time = ? WHERE position is ?'''.format(table = table_name)
                    
                    cursor.execute(query, (username, level_reached, total_game_time, row[0]))
                    
                    connection.commit()
                    connection.close()
                    return True
                elif level_reached == row[2] and current_game_mode != "speed":
                    if total_game_time < row[3]:
                        #move the rest down
                        continue
            return False
        except Error:
            connection.close()
            return Error
    
    
    def shift_rows(self, current_row, username):
        current_game_mode = class_user.get_game_mode()
        table_name = current_game_mode+"_leaderboard"
        
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            
            for number in range(99, current_row-1, -1):
                query = ''' SELECT * FROM {table} WHERE position = ?'''.format(table=table_name)
                row = cursor.execute(query, (number,)).fetchone()
                
                query = '''UPDATE {table} SET username = ?, game_level =?, game_time = ? WHERE position is ?'''.format(table = table_name)
                
                adjusted_number = number + 1
                
                cursor.execute(query, (row[1], row[2], row[3], adjusted_number))
                
            connection.commit()
            connection.close
        except Error:
            connection.close()
            return Error
            
    #DeprecationWarning
    '''def post(self):
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
    '''    
    
    
        
        
class single_games(Resource):
    TABLE_NAME = '_game_times_table'
	
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Error: Generic"
                        )
    parser.add_argument('game_run',
                        type = int,
                        required = False,
                        help = "Not accepted format for Game run"
                        )
    parser.add_argument('game_mode',
                        required = False,
                        help = "no game mode"
                        )
    parser.add_argument('game_level',
                        type = int,
                        required = False,
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
        
        if not User.find_user(data['username'].capitalize()):
            return {"message": "No user was found."}
        
        
        table_name = data['username'].capitalize() +self.TABLE_NAME
        
        #row = self.find_game(table_name, data['game_run'])
        
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()

        query = "INSERT INTO {table} VALUES (?,?,?,?,?)".format(table=table_name)
        cursor.execute(query, (data['game_run'], data['game_mode'].lower(), data['game_level'], 
                                    data['game_type'], data['game_time']))
        connection.commit()
        connection.close()
            
        return {"message": "Game Run added", "game_run":data['game_run'], "game_mode":data['game_mode'], 
                    "game_level": data['game_level'], "game_type": data['game_type'], "game_time": data['game_time']}
        
        
    def get(self):
        return {"message": "No functionality"}
    
    
    @classmethod
    def find_game(cls, table_name, game_run):
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            
            query = "SELECT * FROM {table} WHERE game_run =?".format(table = table_name) 
            #This is going to grab all rows; can specific w/ this lster
            
            rows = cursor.execute(query, (game_run,))
            
            row = rows.fetchone()
            
            return row
        except Error:
            connection.close()
            return