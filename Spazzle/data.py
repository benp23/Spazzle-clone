"""
    File: data.py
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: This class provides the data analytics
                
"""
import sqlite3
from sqlite3 import Error
from User import User
class data:
    """
        
        To DO:
            implement error for user registration 
    """
    tempuser = User()
    username = ''
    
    def __init__(self, name):
        global username
        #if not tempuser.find_user(name_):
           #return "Please Register First" 
        username = name.capitalize()
        
    def change_username(self, name):
        global username 
        #if not tempuser.find_user(name_):
           #return "Please Register First" 
        username = name.capitalize()
        
    
    #COUNTS
    def get_run_count(self, game_mode):
        global username
        TABLE_NAME = username + '_game_total_table'
        
        if not User.find_user(username):
           return {"Message":"Please Register First" }
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            
            if game_mode == None:
                query = '''SELECT Count(*) FROM {table}'''.format(table=TABLE_NAME)
                count = cursor.execute(query).fetchone()[0]  
                connection.close()
                return count
            query = '''SELECT Count(*) FROM {table} WHERE game_mode = ?'''.format(table=TABLE_NAME)
            count = cursor.execute(query, (game_mode,)).fetchone()[0]  
            connection.close()
            return count
        except Error:
            connection.close()
            return Error
        
    def get_counts(self, game_mode, game_type):
        global username
        TABLE_NAME = "{name}_game_times_table".format(name = username)
        

        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
                
            #query = '''SELECT Count(*) from {table} WHERE game_type = ?'''.format(table = TABLE_NAME)
            
        if game_mode is None and game_type is None: #all modes | all games
            query = '''SELECT count(*) from {table}'''.format(table = TABLE_NAME)
            rows = cursor.execute(query).fetchone()[0]
            connection.close()
            return rows
                    
        elif game_mode is None: #All Modes | specific games
            query = '''SELECT count(*) from {table} WHERE game_type =?'''.format(table = TABLE_NAME)
            rows = cursor.execute(query, (game_type,)).fetchone()[0]
            connection.close()
            return rows
                    
        elif game_type is None: # Specific Modes | all games
            query = '''SELECT count(*) from {table} WHERE game_mode = ?'''.format(table = TABLE_NAME)
            rows = cursor.execute(query, (game_mode,)).fetchone()[0]
            connection.close()
            return rows
                    
                #specific modes | specific games
        query = '''SELECT count(*) from {table} WHERE game_mode =? AND game_type = ?'''.format(table = TABLE_NAME)
        rows = cursor.execute(query, (game_mode, game_type)).fetchone()[0]
        connection.close()
        return rows
         
        
        
    #AVERAGES
    def get_run_average(self, game_mode):
        global username
        TABLE_NAME = username + '_game_total_table'
        
        if not User.find_user(username):
           return {"Message":"Please Register First" }
        
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            if game_mode == None:
                query = '''SELECT AVG(game_total_time) from {table}'''.format(table = TABLE_NAME)
                rows = cursor.execute(query).fetchone()[0]
                connection.close()
                return rows
            query = '''SELECT AVG(game_total_time) from {table} WHERE game_mode = ?'''.format(table = TABLE_NAME)
            rows = cursor.execute(query, (game_mode,)).fetchone()
            connection.close()
            return rows
        except Error:
            connection.close()
            return 
    
    def get_averages(self, game_mode, game_type):
        global username
        TABLE_NAME = "{name}_game_times_table".format(name = username)
        
        try:
            connection = sqlite3.connect('data.db') 
            cursor = connection.cursor()
            if game_type is None and game_mode is None: # All Modes | All Games
                query = '''SELECT AVG(game_time) from {table}'''.format(table = TABLE_NAME)
                rows = cursor.execute(query).fetchone()[0]
                connection.close()
                return rows
                
            elif game_mode is None: # All Modes | Specific Games
                query = '''SELECT AVG(game_time) from {table} WHERE game_type =?'''.format(table = TABLE_NAME)
                rows = cursor.execute(query, (game_type,)).fetchone()[0]
                connection.close()
                return rows
                
            elif game_type is None: # Specific Modes | All Games
                query = '''SELECT AVG(game_time) from {table} WHERE game_mode =?'''.format(table = TABLE_NAME)
                rows = cursor.execute(query, (game_mode,)).fetchone()[0]
                connection.close()
                return rows
                
            else: # Specific Modes | Specific Games
                query = '''SELECT AVG(game_time) from {table} WHERE game_mode =? AND game_type =?'''.format(table = TABLE_NAME)
                rows = cursor.execute(query, (game_mode, game_type)).fetchone()[0]
                connection.close()
                return rows

        except Error:
            connection.close()
            return 
    
    #HIGHEST
    def get_run_highest(self, game_mode):
        global username
        TABLE_NAME = username + '_game_total_table'
        
        if not User.find_user(username):
           return "Please Register First" 
        
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            if game_mode is None:
                query = '''SELECT * from {table} ORDER BY level_reached DESC'''.format(table = TABLE_NAME)
                rows = cursor.execute(query).fetchone()
                
                connection.close()
                return rows
            query = '''SELECT * from {table} WHERE game_mode =? ORDER BY level_reached DESC '''.format(table = TABLE_NAME)
            rows = cursor.execute(query, (game_mode,)).fetchone()
            connection.close()
            return rows
        except Error:
            connection.close()
            return 
    
    #Not currently functional
    def get_best_speed_run(self):
        global username
        TABLE_NAME = username + '_game_total_table'
        
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            
            query = '''SELECT * from {table} ORDER BY level_reached DESC'''.format(table = TABLE_NAME)
            rows = cursor.execute(query).fetchone()
            connection.close()
            
            return rows
        except Error:
            connection.close()
            return 
   
   