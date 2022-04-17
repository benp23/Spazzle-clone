import sqlite3
from sqlite3 import Error

class db_c:
    dbname=''
    def __init__(self, name):
        global dbname 
        dbname = name +'.db'
        try:
            connection = sqlite3.connect(dbname)
            if connection:
                connection.close()
                return
        except Error:
            return Error
            
    def create(self):
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
       
      