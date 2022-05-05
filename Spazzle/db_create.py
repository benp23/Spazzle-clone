"""
    File: db_create
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Class to make sqlite3 data base and tables to be used by other classes
                separated for clarity
"""

import sqlite3
from sqlite3 import Error

class db_c:
    dbname=''
    
    def __init__(self, name):
        """Creates the database with passed name"
        Parameters
        ----------
        name : str, required
        """
        global dbname 
        dbname = name +'.db' #makes a database
        try:
            connection = sqlite3.connect(dbname)
            if connection:
                create_user_table = '''
                                CREATE TABLE IF NOT EXISTS user_table
                                (username TEXT NOT NULL PRIMARY KEY,
                                ID INTEGER);
                                '''
                self.create(create_user_table)              
                create_speed_board = '''
                                    CREATE TABLE IF NOT EXISTS speed_leaderboard
                                    (position INT PRIMARY KEY,
                                    username TEXT,
                                    game_level INT,
                                    game_time REAL,
                                    game_mode TEXT
                                    );
                                    '''
                self.create(create_speed_board)
                create_level_board = '''
                                    CREATE TABLE IF NOT EXISTS level_leaderboard
                                    (position INT PRIMARY KEY,
                                    username TEXT,
                                    game_level INT,
                                    game_time REAL,
                                    game_mode TEXT
                                    );
                                    '''
                self.create(create_level_board)
                connection.close()
                
                return
        except Error:
            return Error
            
    #def create(self):
        """
        Description: Sets up tables when called. Additions may be made for more personalization
        Parameters
        ----------
        None
        """
    def create(self, table_info):
        try:
            global dbname
            connection = sqlite3.connect(dbname)
            cursor = connection.cursor()
            cursor.execute(table_info)
            connection.commit()
            connection.close()
            
        except Error:
            return Error
            


    def leader_set(self, positions):
        try:
            global dbname
            connection = sqlite3.connect(dbname)
            cursor = connection.cursor()
            
            for number in range(positions):
                query = '''INSERT INTO {table} VALUES (?,'', -1, -1, '');'''.format(table = "speed_leaderboard")
                cursor.execute(query, (number + 1,))
                query = '''INSERT INTO {table} VALUES (?,'', -1, -1, '');'''.format(table = "level_leaderboard")
                cursor.execute(query, (number + 1,))
            connection.commit()
            connection.close()
        except Error:
            return Error
    """
  try:
            global dbname
            connection = sqlite3.connect(dbname)
            cursor = connection.cursor()
            
            create_user_table = '''
                                CREATE TABLE IF NOT EXISTS user_table
                                (username TEXT NOT NULL PRIMARY KEY,
                                ID INTEGER);
                                '''
            cursor.execute(create_user_table)
            connection.commit()
            #ADD feature to make it so each user has own
            create_game_times_table = '''
                                    CREATE TABLE IF NOT EXISTS game_times_table
                                    (username TEXT NOT NULL, 
                                    game_type INTEGER NOT NULL, 
                                    level_reached INTEGER,
                                    game_time REAL);
                                    '''
            cursor.execute(create_game_times_table)
            connection.commit()
            create_game_total_table = '''
                                    CREATE TABLE IF NOT EXISTS game_total_table
                                    (username TEXT NOT NULL, 
                                    game_run INT PRIMARY KEY NOT NULL,
                                    game_total_time REAL);
                                    '''
            cursor.execute(create_game_total_table)
            connection.commit()
            connection.close()
        
        except Error:
            return Error
       """