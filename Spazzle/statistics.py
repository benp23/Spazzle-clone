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


    def get(self, username, stat, game):
        #json_input = statistics.parser.parse_args()
            
        d = data(username)
        
        stat_choice = "{game}_{stat}".format(game = game, stat = stat)
        game_type = "{game}_game".format(game = game)
        
        if stat_choice == 'total_average':
            return {"average": d.get_average_time()}
        elif stat_choice == 'total_game_count':
            return {"Games Played: ": d.get_game_count()}
        elif (stat_choice == 'color_average' or stat_choice == 'sort_average' or 
                stat_choice == 'image_average' or stat_choice == 'add_average' or 
                stat_choice == 'word_average' or stat_choice == 'number_average'):
            return d.get_game_average(game_type)
        else:
            return {"message": "Stat not supported"}
            
            
    """
  'color_game',
        'sort_game',
        'image_game',
        'addition_game',
        'word_scramble',
        'number_sort'
        'level'
        
        elif stat == 'sort_average':
            return
        elif stat == 'image_average':
            return
        elif stat == 'add_average':
            return
        elif stat == 'word_average':
            return
        elif stat == 'number_average':
            return
    """