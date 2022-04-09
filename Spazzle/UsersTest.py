import sqlite3
from flask_restful import Resource, reqparse


class User(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        type=str,
                        required=True,
                        help="This field cannot be left blank!"
                        )
    
    def post(self):
        
        data = User.parser.parse_args()
        connection = sqlite3.connect('databank.db')
        cursor = connection.cursor()
        
        query = "INSERT INTO users(username) VALUES(?)"
        cursor.execute(query, data['username'])
        connection.commit()
        connection.close()
        
        return {"message" : "worked that time"}
        
    
    def get(self):
        data = User.parser.parse_args()
        connection = sqlite3.connect('databank.db')
        cursor = connection.cursor()
        
        query = "SELECT * FROM users WHERE username=?"
        for name in query:
            if name[0] == data['username']:
                return {"message": name}
            return {"message": "Couldn't find it!"}
        
        
        connection.close()