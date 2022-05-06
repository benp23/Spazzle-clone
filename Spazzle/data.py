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
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
            
            query = "SELECT Count(*) FROM {table}".format(table=TABLE_NAME)
            
            rows = cursor.execute(query)
            count = rows.fetchone()[0]  
            
            connection.close()
            
            return count
        except Error:
            connection.close()
            return Error
        
    def get_average_time(self):
        
        global username
        TABLE_NAME = username + '_game_total_table'
        
        if not User.find_user(username):
           return "Please Register First" 
        
        try:
            connection = sqlite3.connect('data.db')
            cursor = connection.cursor()
                    
            query = "SELECT AVG(game_total_time) from {table}".format(table = TABLE_NAME)
            
            rows = cursor.execute(query).fetchone()[0]
            
            connection.close()
            
            return rows
        except Error:
            return Error
        
    def get_game_average(self, game_type):
        global username
        TABLE_NAME = "{name}_game_times_table".format(name = username)
        
        try:
            connection = sqlite3.connect('data.db') 
            cursor = connection.cursor()
            
            query = '''SELECT AVG(game_time) from {table} WHERE game_type =?'''.format(table = TABLE_NAME)
            
            rows = cursor.execute(query, (game_type,)).fetchone()
            
            return rows
        except Error:
            connection.close()
            return Error
        
    '''
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
    
    '''
    
    