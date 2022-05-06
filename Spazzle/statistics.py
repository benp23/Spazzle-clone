"""
    File: statistics.py
    Authors: Spencer Wheeler, Benjamin Paul, Troy Scites
    Description: This class provides API functionality for the statistics page
                as well as access to the data class 
                
"""

from data import data
from flask_restful import Resource, reqparse

class statistics(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        required = True,
                        help = "Please enter a username"
                        )
    parser.add_argument('stat',
                        required = True,
                        help = "Select Stat Desired"
                        )
    parser.add_argument('games_back',
                        type = int,
                        required = False,
                        help = "Not a number"
                        )
    
    def post(self):
        return {"message": "Function not supported"}


    def get(self, username, stat):
        #json_input = statistics.parser.parse_args()
            
        d = data(username)
        if stat == 'average':
            return {"average": d.get_average_time()}
        elif stat == 'total_game_count':
            return {"Games Played: ": d.get_game_count()}
        elif stat == '
        else:
            return {"message": "Stat not supported"}