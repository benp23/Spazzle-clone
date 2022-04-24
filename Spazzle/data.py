"""
    File: data.py
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: This class provides the data analytics
                
"""
import sqlite3
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
        username = name
        
    def change_username(self, name):
        global username 
        #if not tempuser.find_user(name_):
           #return "Please Register First" 
        username = name
        
    
    def get_game_count(self):
        global username
        TABLE_NAME = username + '_game_total_table'
        
        if not User.find_user(username):
           return "Please Register First" 
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
        
        query = "SELECT Count(*) FROM {table}".format(table=TABLE_NAME)
        
        rows = cursor.execute(query)
        count = rows.fetchone()[0]  
        
        connection.close()
        
        return count
        
        
    def get_average_time(self, count):
        
        global username
        TABLE_NAME = username + '_game_total_table'
        
        if not User.find_user(username):
           return "Please Register First" 
        connection = sqlite3.connect('data.db')
        cursor = connection.cursor()
                
        query = "SELECT AVG(game_total_time) from {table}".format(table = TABLE_NAME)
        
        rows = cursor.execute(query).fetchone()[0]
        
        connection.close()
        
        return rows
        
      

    
    