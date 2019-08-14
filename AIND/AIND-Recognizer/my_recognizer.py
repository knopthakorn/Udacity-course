import warnings
from asl_data import SinglesData


def recognize(models: dict, test_set: SinglesData):
    """ Recognize test word sequences from word models set

   :param models: dict of trained models
       {'SOMEWORD': GaussianHMM model object, 'SOMEOTHERWORD': GaussianHMM model object, ...}
   :param test_set: SinglesData object
   :return: (list, list)  as probabilities, guesses
       both lists are ordered by the test set word_id
       probabilities is a list of dictionaries where each key a word and value is Log Liklihood
           [{SOMEWORD': LogLvalue, 'SOMEOTHERWORD' LogLvalue, ... },
            {SOMEWORD': LogLvalue, 'SOMEOTHERWORD' LogLvalue, ... },
            ]
       guesses is a list of the best guess words ordered by the test set word_id
           ['WORDGUESS0', 'WORDGUESS1', 'WORDGUESS2',...]N
   """
    warnings.filterwarnings("ignore", category=DeprecationWarning)
    probabilities = []
    guesses = []
    # TODO implement the recognizer
    # return probabilities, guesses
    #raise NotImplementedError

    for item in test_set.get_all_sequences().keys():
      prob_word = dict()
      guess_word = ''
      best_score = float('-inf')

      X, lengths = test_set.get_item_Xlengths(item)
      for word, model in models.items():
        try:
          guess_score = model.score(X, lengths)
          prob_word[word] = guess_score

          if guess_score > best_score:
            best_score = guess_score
            guess_word = word
        except Exception as e:
          prob_word[word] = float('-inf')

      probabilities.append(prob_word)
      guesses.append(guess_word)

    return probabilities, guesses