"""Finish all TODO items in this file to complete the isolation project, then
test your agent's strength against a set of known agents using tournament.py
and include the results in your report.
"""
import random
import math


class SearchTimeout(Exception):
    """Subclass base exception for code clarity. """
    pass


def custom_score(game, player):
    """Calculate the heuristic value of a game state from the point of view
    of the given player.

    This should be the best heuristic function for your project submission.

    Note: this function should be called from within a Player instance as
    `self.score()` -- you should not need to call this function directly.

    Parameters
    ----------
    game : `isolation.Board`
        An instance of `isolation.Board` encoding the current state of the
        game (e.g., player locations and blocked cells).

    player : object
        A player instance in the current game (i.e., an object corresponding to
        one of the player objects `game.__player_1__` or `game.__player_2__`.)

    Returns
    -------
    float
        The heuristic value of the current game state to the specified player.
    """
    # TODO: finish this function!
    # raise NotImplementedError

    #If our agent no room to move return -INF
    if game.is_loser(player):
        return float("-inf")

    #If our opponent no room to move return INF
    if game.is_winner(player):
        return float("inf")

    opponent = game.get_opponent(player)

    player_legal_moves      = game.get_legal_moves(player)
    opponent_legal_moves    = game.get_legal_moves(opponent)

    player_total_moves      = len(player_legal_moves)
    opponent_total_moves    = len(opponent_legal_moves)

    for move in player_legal_moves:
        board = game.forecast_move(move)
        player_total_moves += len(board.get_legal_moves(player))

    for move in opponent_legal_moves:
        board = game.forecast_move(move)
        opponent_total_moves += len(board.get_legal_moves(opponent))

    # ratio of total_move_agent and total_move_opponent is the heuristic score
    if opponent_total_moves <= 0:
        opponent_total_moves = 1

    score = float(player_total_moves/opponent_total_moves)

    return score


def custom_score_2(game, player):
    """Calculate the heuristic value of a game state from the point of view
    of the given player.

    Note: this function should be called from within a Player instance as
    `self.score()` -- you should not need to call this function directly.

    Parameters
    ----------
    game : `isolation.Board`
        An instance of `isolation.Board` encoding the current state of the
        game (e.g., player locations and blocked cells).

    player : object
        A player instance in the current game (i.e., an object corresponding to
        one of the player objects `game.__player_1__` or `game.__player_2__`.)

    Returns
    -------
    float
        The heuristic value of the current game state to the specified player.
    """
    # TODO: finish this function!
    #raise NotImplementedError

    #If our agent no room to move return -INF
    if game.is_loser(player):
        return float("-inf")

    #If our opponent no room to move return INF
    if game.is_winner(player):
        return float("inf")

    opponent            = game.get_opponent(player)
    player_moves        = len(game.get_legal_moves(player))
    opponent_moves      = len(game.get_legal_moves(opponent))

    """calculation the total distance between the player current
    location and its opponent's current location
    """
    player_location     = game.get_player_location(player)
    oppopent_location   = game.get_player_location(opponent)

    x_distance          = math.pow(player_location[0] - oppopent_location[0], 2)
    y_distance          = math.pow(player_location[1] - oppopent_location[1], 2)

    board_distance      = math.sqrt(x_distance + y_distance)

    # Reward player for choosing moves farther away from opponent's current position
    score = float(player_moves + board_distance - opponent_moves)
    return score



def custom_score_3(game, player):
    """Calculate the heuristic value of a game state from the point of view
    of the given player.

    Note: this function should be called from within a Player instance as
    `self.score()` -- you should not need to call this function directly.

    Parameters
    ----------
    game : `isolation.Board`
        An instance of `isolation.Board` encoding the current state of the
        game (e.g., player locations and blocked cells).

    player : object
        A player instance in the current game (i.e., an object corresponding to
        one of the player objects `game.__player_1__` or `game.__player_2__`.)

    Returns
    -------
    float
        The heuristic value of the current game state to the specified player.
    """
    # TODO: finish this function!
    #raise NotImplementedError

    #If our agent no room to move return -INF
    if game.is_loser(player):
        return float("-inf")

    #If our opponent no room to move return INF
    if game.is_winner(player):
        return float("inf")

    opponent            = game.get_opponent(player)

    player_moves        = len(game.get_legal_moves(player))
    opponent_moves      = len(game.get_legal_moves(opponent))

    player_location     = game.get_player_location(player)

    game_width          = game.width/2
    game_height         = game.height/2

    half_board          = (game_width * game_height)/2

    player_x_distance     = math.pow(player_location[0] - game_width, 2)
    player_y_distance     = math.pow(player_location[1] - game_height, 2)
    distant_from_center   = math.sqrt(player_x_distance + player_y_distance)

    score = 10
    if game.move_count < half_board:
        score = float(player_moves - (2 * opponent_moves) + distant_from_center)
    else:
        score = float(player_moves - 2 * opponent_moves)

    #score = float(player_moves - opponent_moves + distant_from_center)

    return score

class IsolationPlayer:
    """Base class for minimax and alphabeta agents -- this class is never
    constructed or tested directly.

    ********************  DO NOT MODIFY THIS CLASS  ********************

    Parameters
    ----------
    search_depth : int (optional)
        A strictly positive integer (i.e., 1, 2, 3,...) for the number of
        layers in the game tree to explore for fixed-depth search. (i.e., a
        depth of one (1) would only explore the immediate sucessors of the
        current state.)

    score_fn : callable (optional)
        A function to use for heuristic evaluation of game states.

    timeout : float (optional)
        Time remaining (in milliseconds) when search is aborted. Should be a
        positive value large enough to allow the function to return before the
        timer expires.
    """
    def __init__(self, search_depth=3, score_fn=custom_score, timeout=10.):
        self.search_depth = search_depth
        self.score = score_fn
        self.time_left = None
        self.TIMER_THRESHOLD = timeout


class MinimaxPlayer(IsolationPlayer):
    """Game-playing agent that chooses a move using depth-limited minimax
    search. You must finish and test this player to make sure it properly uses
    minimax to return a good move before the search time limit expires.
    """

    def get_move(self, game, time_left):
        """Search for the best move from the available legal moves and return a
        result before the time limit expires.

        **************  YOU DO NOT NEED TO MODIFY THIS FUNCTION  *************

        For fixed-depth search, this function simply wraps the call to the
        minimax method, but this method provides a common interface for all
        Isolation agents, and you will replace it in the AlphaBetaPlayer with
        iterative deepening search.

        Parameters
        ----------
        game : `isolation.Board`
            An instance of `isolation.Board` encoding the current state of the
            game (e.g., player locations and blocked cells).

        time_left : callable
            A function that returns the number of milliseconds left in the
            current turn. Returning with any less than 0 ms remaining forfeits
            the game.

        Returns
        -------
        (int, int)
            Board coordinates corresponding to a legal move; may return
            (-1, -1) if there are no available legal moves.
        """
        self.time_left = time_left

        # Initialize the best move so that this function returns something
        # in case the search fails due to timeout
        best_move = (-1, -1)

        try:
            # The try/except block will automatically catch the exception
            # raised when the timer is about to expire.
            return self.minimax(game, self.search_depth)

        except SearchTimeout:
            pass  # Handle any actions required after timeout as needed

        # Return the best move from the last completed search iteration
        return best_move

    def minimax(self, game, depth):
        """Implement depth-limited minimax search algorithm as described in
        the lectures.

        This should be a modified version of MINIMAX-DECISION in the AIMA text.
        https://github.com/aimacode/aima-pseudocode/blob/master/md/Minimax-Decision.md

        **********************************************************************
            You MAY add additional methods to this class, or define helper
                 functions to implement the required functionality.
        **********************************************************************

        Parameters
        ----------
        game : isolation.Board
            An instance of the Isolation game `Board` class representing the
            current game state

        depth : int
            Depth is an integer representing the maximum number of plies to
            search in the game tree before aborting

        Returns
        -------
        (int, int)
            The board coordinates of the best move found in the current search;
            (-1, -1) if there are no legal moves

        Notes
        -----
            (1) You MUST use the `self.score()` method for board evaluation
                to pass the project tests; you cannot call any other evaluation
                function directly.

            (2) If you use any helper functions (e.g., as shown in the AIMA
                pseudocode) then you must copy the timer check into the top of
                each helper function or else your agent will timeout during
                testing.
        """
        if self.time_left() < self.TIMER_THRESHOLD:
            raise SearchTimeout()

        # initialize the best move found in the current search
        #best_move = (-1, -1)

        legal_moves = game.get_legal_moves()
        # validate the search tree
        if depth <= 0 or len(legal_moves) == 0:
            #return best_move
            return game.get_player_location(self)
        #else:
            # return board coordinates of the best move
            #return self.max_value(game, depth)[1]

        best_score = float("-inf")
        best_move = (-1,-1)

        for move in legal_moves:
            score = self.min_value(game.forecast_move(move), depth-1)

            if score > best_score:
                best_score = score
                best_move = move

        return best_move



    def max_value(self, game, depth):
        """
        maximum value search algorithm for calculating minimax decisions.

        Parameters
        ----------
        game : isolation.Board
            An instance of the Isolation game `Board` class representing the
            current game state

        depth : int
            Depth is an integer representing the maximum number of plies to
            search in the game tree before aborting

        Returns
        -------
        float
            The board evaluation score

        """


        # terminal check
        if self.time_left() < self.TIMER_THRESHOLD:
            raise SearchTimeout()

        legal_moves = game.get_legal_moves()

        if depth <= 0 or len(legal_moves) == 0:
            return self.score(game, self)

        # initialize evaluation score
        best_score = float("-inf")

        for move in legal_moves:
            best_score = max(best_score, self.min_value(game.forecast_move(move),depth-1))

        return best_score

    def min_value(self, game, depth):
        """
        minimum value search algorithm for calculating minimax decisions.

        Parameters
        ----------
        game : isolation.Board
            An instance of the Isolation game `Board` class representing the
            current game state

        depth : int
            Depth is an integer representing the maximum number of plies to
            search in the game tree before aborting

        -------
        float
            The board evaluation score
        """


        # terminal check
        if self.time_left() < self.TIMER_THRESHOLD:
            raise SearchTimeout()

        legal_moves = game.get_legal_moves()

        if depth <= 0 or len(legal_moves) == 0:
            return self.score(game, self)

        # initialize evaluation score
        best_score = float("inf")

        for move in legal_moves:

            best_score = min(best_score, self.max_value(game.forecast_move(move), depth-1))

        return best_score

class AlphaBetaPlayer(IsolationPlayer):
    """Game-playing agent that chooses a move using iterative deepening minimax
    search with alpha-beta pruning. You must finish and test this player to
    make sure it returns a good move before the search time limit expires.
    """

    def get_move(self, game, time_left):
        """Search for the best move from the available legal moves and return a
        result before the time limit expires.

        Modify the get_move() method from the MinimaxPlayer class to implement
        iterative deepening search instead of fixed-depth search.

        **********************************************************************
        NOTE: If time_left() < 0 when this function returns, the agent will
              forfeit the game due to timeout. You must return _before_ the
              timer reaches 0.
        **********************************************************************

        Parameters
        ----------
        game : `isolation.Board`
            An instance of `isolation.Board` encoding the current state of the
            game (e.g., player locations and blocked cells).

        time_left : callable
            A function that returns the number of milliseconds left in the
            current turn. Returning with any less than 0 ms remaining forfeits
            the game.

        Returns
        -------
        (int, int)
            Board coordinates corresponding to a legal move; may return
            (-1, -1) if there are no available legal moves.
        """
        self.time_left = time_left

        # TODO: finish this function!

        best_move =  (-1, -1)
        depth = 1 #self.search_depth

        legal_moves = game.get_legal_moves()

        if len(legal_moves) == 0:
            return (-1, -1)

        best_move = legal_moves[0]

        while True:
            try:
                # The try/except block will automatically catch the exception
                # raised when the timer is about to expire.
                best_move = self.alphabeta(game, depth)
                depth += 1
            except SearchTimeout:
                break

        # Return the best move from the last completed search iteration
        return best_move

    def alphabeta(self, game, depth, alpha=float("-inf"), beta=float("inf")):
        """Implement depth-limited minimax search with alpha-beta pruning as
        described in the lectures.

        This should be a modified version of ALPHA-BETA-SEARCH in the AIMA text
        https://github.com/aimacode/aima-pseudocode/blob/master/md/Alpha-Beta-Search.md

        **********************************************************************
            You MAY add additional methods to this class, or define helper
                 functions to implement the required functionality.
        **********************************************************************

        Parameters
        ----------
        game : isolation.Board
            An instance of the Isolation game `Board` class representing the
            current game state

        depth : int
            Depth is an integer representing the maximum number of plies to
            search in the game tree before aborting

        alpha : float
            Alpha limits the lower bound of search on minimizing layers

        beta : float
            Beta limits the upper bound of search on maximizing layers

        Returns
        -------
        (int, int)
            The board coordinates of the best move found in the current search;
            (-1, -1) if there are no legal moves

        Notes
        -----
            (1) You MUST use the `self.score()` method for board evaluation
                to pass the project tests; you cannot call any other evaluation
                function directly.

            (2) If you use any helper functions (e.g., as shown in the AIMA
                pseudocode) then you must copy the timer check into the top of
                each helper function or else your agent will timeout during
                testing.
        """
        if self.time_left() < self.TIMER_THRESHOLD:
            raise SearchTimeout()

        # TODO: finish this function!
        #raise NotImplementedError

        best_score = float("-inf")
        best_move = (-1,-1)

        legal_moves = game.get_legal_moves()

        if depth <= 0 or len(legal_moves) == 0:
            return best_move

        best_move = legal_moves[0]

        for move in legal_moves:

            score = self.min_value(game.forecast_move(move), depth-1, best_score, beta)

            if score >= best_score:
                best_score = score
                best_move = move

            if best_score >= beta:
                return best_move

        return best_move

    def max_value(self, game, depth, alpha, beta):

        """
        maximum value search algorithm for calculating depth-limited minimax search with alpha-beta pruning.

        Parameters
            ----------
        game : isolation.Board
            An instance of the Isolation game `Board` class representing the
            current game state

        depth : int
            Depth is an integer representing the maximum number of plies to
            search in the game tree before aborting

        alpha : float
            Alpha limits the lower bound of search on minimizing layers

        beta : float
            Beta limits the upper bound of search on maximizing layers

        Returns
        -------
        float
            The board evaluation score
        """

        # terminal check
        if self.time_left() < self.TIMER_THRESHOLD:
            raise SearchTimeout()

        legal_moves = game.get_legal_moves()

        if depth <= 0 or len(legal_moves) == 0:
            return self.score(game, self)

        # initialize evaluation score
        best_score = float("-inf")

        for move in legal_moves:
            best_score = max(best_score, self.min_value(game.forecast_move(move), depth-1, alpha, beta))

            #pruning
            if best_score >= beta:
                return best_score

            alpha = max(alpha, best_score)

        return best_score

    def min_value(self, game, depth, alpha, beta):

        """
        minimum value search algorithm for calculating depth-limited minimax search with alpha-beta pruning.

        Parameters
        ----------
        game : isolation.Board
            An instance of the Isolation game `Board` class representing the
            current game state

        depth : int
            Depth is an integer representing the maximum number of plies to
            search in the game tree before aborting

        alpha : float
            Alpha limits the lower bound of search on minimizing layers

        beta : float
            Beta limits the upper bound of search on maximizing layers

        Returns
        -------
        float
            The board evaluation score

        """

        # terminal check
        if self.time_left() < self.TIMER_THRESHOLD:
            raise SearchTimeout()

        legal_moves = game.get_legal_moves()

        if depth <= 0 or len(legal_moves) == 0:
            return self.score(game, self)

        # initialize evaluation score
        best_score = float("inf")

        for move in legal_moves:

            best_score = min(best_score, self.max_value(game.forecast_move(move), depth-1, alpha, beta))

            #pruning
            if best_score <= alpha:
                return best_score
            beta = min(beta, best_score)

        return best_score

