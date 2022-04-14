import sqlite3
from flask_restful import Resource, reqparse


class User(Resource):

    item = ""
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required=True,
                        help="This field cannot be left blank!"
                        )
    
    def post(self):
        '''
        try:
            connection = sqlite3.connect('databank.db')
            create_table = ''''''CREATE TABLE test(
                            id INTEGER PRIMARY KEY,
                            name TEXT NOT NULL,
                            email text NOT NULL UNIQUE,
                            joining_date datetime,
                            salary REAL NOT NULL);
                            ''''''
            
            cursor = connection.cursor()
            cursor.execute(create_table)
            connection.commit()
            cursor.close()
            return {"message" : "Table Created"}
        except sqlite3.Error as error:
            afd = error
            return {"message": afd}
        finally:
            if connection:
                connection.close()
        '''
        data = User.parser.parse_args()
        connection = sqlite3.connect('databank.db')
        cursor = connection.cursor()

        insert_query = """ INSERT INTO users
                            (username) VALUES (?);"""
        cursor.execute(insert_query, (data['username'],))
        connection.commit()
        connection.close()
        return{"message": "Username Accepted"}
                
    
    def get(self):
        data = User.parser.parse_args()
        user = self.find_user(data['username'])
        if user:
            return user
        return {'message': 'username not found'}
       
    
    def find_user(self, username):
        connection = sqlite3.connect('databank.db')
        cursor = connection.cursor()
        
        select_query = """SELECT username from users WHERE username=?"""
        result = cursor.execute(select_query, (username,))
        row = result.fetchone()
        connection.close()
        
        if row:
            return {'user': row[0]}
        
        