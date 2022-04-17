import sqlite3
from User import User
from flask_restful import Resource, reqparse
#using reqparse despite its depreciated status

class Register(Resource):
    TABLE_NAME = 'user_table'
    
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Please enter a username"
    )
    
    def post(self):
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
        connect.close()
        
        return {"message": "Username Acceped"}

      