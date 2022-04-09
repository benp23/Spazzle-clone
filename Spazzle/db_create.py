import sqlite3
from sqlite3 import Error

class db_c:
    
    def create(self, name):
        
        dbname = name +'.db'
        try:
            connection = sqlite3.connect(dbname)
            cursor = connection.cursor()
            create_table = "CREATE TABLE IF NOT EXISTS users(username text)"
            cursor.execute(create_table)
            connection.commit()
            connection.close()
        except Error:
            return Error
        