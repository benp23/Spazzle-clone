"""
    File: Register.py
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: Class to make and store user information.
                Limited functions as of now, will add more later.
                
"""
import sqlite3
from User import User
from flask_restful import Resource, reqparse
from db_create import db_c
#using reqparse despite its depreciated status

class Register(Resource):
    """
        Description: Checks and registers username
    """
    TABLE_NAME = 'user_table'
    
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Please enter a username"
    )
    
    def post(self):
        """
            Description: Post user information. Will return if username is taken or if successful. No limits on usernames
            Parameters:
                username: str, required
        """
        
        data = Register.parser.parse_args()
        
        connect = sqlite3.connect('data.db')
        cursor = connect.cursor()
        
        username_string = data['username']
        
        #return {"Message":username_string}
        
        if User.find_user(username_string):
            return {"message": "Username is alreadly in use. Please choose another"}
        
        insert_username_table = '''
                                INSERT INTO {table} (username, id) Values (?, 0);
                                '''.format(table=Register.TABLE_NAME)

        
        cursor.execute(insert_username_table, (username_string,))
        connect.commit()
        
        create_total_game_table_for_user = '''
                                    CREATE TABLE IF NOT EXISTS {user}_game_total_table
                                    (username TEXT NOT NULL, 
                                    game_run INT PRIMARY KEY NOT NULL,
                                    game_total_time REAL);
                                    '''.format(user=username_string)
                                    
        
        create_single_game_table_for_user = '''
                                    CREATE TABLE IF NOT EXISTS {user}_game_times_table
                                    (game_run INT NOT NULL, 
                                    game_type INT NOT NULL, 
                                    game_time REAL);
                                    '''.format(user=username_string)
                                    
        db = db_c('data')
        db.create(create_total_game_table_for_user)
        db.create(create_single_game_table_for_user)
        
        connect.close()
        return {"message": "Username Acceped"}

      