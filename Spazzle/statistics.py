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


    def get(self, username, game_mode,  stat, game):
        #json_input = statistics.parser.parse_args()
        #Game Modes: total_runs | speed | level | infinite
        #stat: average | count | highest(total only) | 
        #game: total | all_games | levels | color, image, word, sort, addition, number
        stat_dat = data(username.capitalize())
        
        #stat_choice = "{game}_{stat}".format(game = game, stat = stat)
        #game_type = "{game}_game".format(game = game)
        
        game_mode = game_mode.lower()
        stat = stat.lower()
        game = game.lower()
        
        
        if game_mode == 'total_runs':
            if game == 'total':
                #all modes of all runs
                if stat == 'average':
                    #average of all modes and total runs
                    return {"average": stat_dat.get_run_average(None)}
                elif stat == 'count':
                    return {"count": stat_dat.get_run_count(None)}
                elif stat == 'highest':
                    return {"highest": stat_dat.get_run_highest(None)}
                else:
                    return {"message": "No such stat"}   
                    
            elif game == 'all_games':
                #all games of all runs
                if stat == 'average':
                    return {"average": stat_dat.get_averages(None, None)}
                elif stat == 'count':
                    return {"count": stat_dat.get_counts(None, None)}
                else:
                    return {"message": "No such stat"}
                    
            elif (game == 'color' or game == 'image' or game == 'word' or game == 'levels'
                    or game == 'sort' or game == 'addition' or game == 'number'):
                # game_type = lambda f: game == 'levels' else 
                
                if game == 'levels':
                    game_type = "level"
                else: 
                    game_type = "{game_name}_game".format(game_name = game)
                    
                if stat == 'average':
                    return {"average": stat_dat.get_averages(None, game_type)}
                elif stat == 'count':
                    return {"count": stat_dat.get_counts(None, game_type)}
                else:
                    return {"message": "No such stat"}
            else: 
                return {"message": "Not a supported game type"} 
                
        elif game_mode == 'speed' or game_mode == 'level' or game_mode == 'infinite':
            if game == 'total':
                #all modes of all runs
                if stat == 'average':
                    #average of all modes and total runs
                    return {"average": stat_dat.get_run_average(game_mode)}
                elif stat == 'count':
                    return {"count": stat_dat.get_run_count(game_mode)}
                elif stat == 'highest':
                    return {"highest": stat_dat.get_run_highest(game_mode)}
                else:
                    return {"message": "No such stat"}   
                    
            elif game == 'all_games':
                #all games of all runs
                if stat == 'average':
                    return {"average": stat_dat.get_averages(game_mode, None)}
                elif stat == 'count':
                    return {"count": stat_dat.get_counts(game_mode, None)}
                else:
                    return {"message": "No such stat"}
                    
            elif (game == 'color' or game == 'image' or game == 'word' or game == 'level'
                    or game == 'sort' or game == 'addition' or game == 'number'):
                # game_type = lambda f: game == 'levels' else 
                
                if game == 'level':
                    game_type = 'level'
                else: 
                    game_type = "{game_name}_game".format(game_name = game)
                    
                #return{"":game_type}
                if stat == 'average':
                    return {"average": stat_dat.get_averages(game_mode, game_type)}
                elif stat == 'count':
                    return {"count": stat_dat.get_counts(game_mode, game_type)}
                else:
                    return {"message": "No such stat"}
            else: 
                return {"message": "Not a supported game type"}
        else:
            return {"message": "Not a Supported Game Mode"}
    
   