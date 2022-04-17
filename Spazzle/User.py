import sqlite3
from flask_restful import Resource, reqparse
#using reqparse despite its depreciated status

class User(Resource):
    TABLE_NAME = 'user_table'
    
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Please enter a username"
                        )
    
    #def get(self):
    #if not in table, return error (do not register)
    #not really needed on its own. Might include as a method to "get all"
    
    #def post(self):
    
    
    @classmethod
    def find_user(cls, username):
        connect = sqlite3.connect('data.db')
        cursor = connect.cursor()
        
        query = "SELECT * FROM {table} WHERE username =?".format(table=cls.TABLE_NAME)
        
        result = cursor.execute(query, (username,))
        row = result.fetchone()
        connect.close()
        
        if row:
            return True
        return False