import math
import statistics
import warnings

import numpy as np
from hmmlearn.hmm import GaussianHMM
from sklearn.model_selection import KFold
from asl_utils import combine_sequences


class ModelSelector(object):
    '''
    base class for model selection (strategy design pattern)
    '''

    def __init__(self, all_word_sequences: dict, all_word_Xlengths: dict, this_word: str,
                 n_constant=3,
                 min_n_components=2, max_n_components=10,
                 random_state=14, verbose=False):
        self.words = all_word_sequences
        self.hwords = all_word_Xlengths
        self.sequences = all_word_sequences[this_word]
        self.X, self.lengths = all_word_Xlengths[this_word]
        self.this_word = this_word
        self.n_constant = n_constant
        self.min_n_components = min_n_components
        self.max_n_components = max_n_components
        self.random_state = random_state
        self.verbose = verbose

    def select(self):
        raise NotImplementedError

    def base_model(self, num_states):
        # with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=DeprecationWarning)
        # warnings.filterwarnings("ignore", category=RuntimeWarning)
        try:
            hmm_model = GaussianHMM(n_components=num_states, covariance_type="diag", n_iter=1000,
                                    random_state=self.random_state, verbose=False).fit(self.X, self.lengths)
            if self.verbose:
                print("model created for {} with {} states".format(self.this_word, num_states))
            return hmm_model
        except:
            if self.verbose:
                print("failure on {} with {} states".format(self.this_word, num_states))
            return None


class SelectorConstant(ModelSelector):
    """ select the model with value self.n_constant

    """

    def select(self):
        """ select based on n_constant value

        :return: GaussianHMM object
        """
        best_num_components = self.n_constant
        return self.base_model(best_num_components)


class SelectorBIC(ModelSelector):
    """ select the model with the lowest Bayesian Information Criterion(BIC) score

    http://www2.imm.dtu.dk/courses/02433/doc/ch6_slides.pdf
    Bayesian information criteria: BIC = -2 * logL + p * logN
    """
    def internalSelectorBIC(self, n):
        """
        :return: best score and GaussianHMM object
        """

        model = self.base_model(n)


        #logN = math.log(self.X.shape[0])
        logN = math.log(len(self.X))
        logL = model.score(self.X, self.lengths)

        #p = n * (n - 1) + 2 * d * n#n**2 + 2*d*n-1

        #d = len(self.X[0])
        d = sum(self.lengths)
        p = (n**2) + (2*n*d)-1

        bic = -2 * logL + p * logN
        return model, bic

    def select(self):
        """ select the best model for self.this_word based on
        BIC score for n between self.min_n_components and self.max_n_components

        :return: GaussianHMM object
        """
        warnings.filterwarnings("ignore", category=DeprecationWarning)

        # TODO implement model selection based on BIC scores
        # raise NotImplementedError

        best_model = None
        best_score = float("-inf")

        for n_components in range(self.min_n_components, self.max_n_components+1):
            try:
                model, score = self.internalSelectorBIC(n_components)
                if score > best_score:
                    best_score = score
                    best_model = model
            except:
                continue

        return best_model


class SelectorDIC(ModelSelector):
    ''' select best model based on Discriminative Information Criterion

    Biem, Alain. "A model selection criterion for classification: Application to hmm topology optimization."
    Document Analysis and Recognition, 2003. Proceedings. Seventh International Conference on. IEEE, 2003.
    http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.58.6208&rep=rep1&type=pdf
    DIC = log(P(X(i)) - 1/(M-1)SUM(log(P(X(all but i))
    '''

    def internalSelectorDIC(self, n):
        """
        :return: dic likelihood score and GaussianHMM object
        """

        M = 1.0
        model = self.base_model(n)
        LogL = model.score(self.X, self.lengths)

        scores = []
        for word in self.hwords:
            if word != self.this_word:
                X, lengths = self.hwords[word]
                try:
                    score = model.score(X, lengths)
                    scores.append(score)
                    M = M + 1.0
                except Exception as e:
                    continue

        dic = (LogL - ((1/(M-1)) * np.sum(scores))) * 1.0

        return model, dic

    def select(self):
        warnings.filterwarnings("ignore", category=DeprecationWarning)

        # TODO implement model selection based on DIC scores
        #raise NotImplementedError
        best_model = None
        best_score = float("-inf")

        for n_components in range(self.min_n_components, self.max_n_components+1):
            try:
                model, score = self.internalSelectorDIC(n_components)
                if score > best_score:
                    best_score = score
                    best_model = model
            except Exception as e:
                continue

        return best_model


class SelectorCV(ModelSelector):
    ''' select best model based on average log Likelihood of cross-validation folds

    '''
    def internalSelectorCV(self, n):
        """
        :return: tuple likelihood score and GaussianHMM object
        """
        score = []
        model = None
        min_split = min(len(self.lengths), 3)

        split_method = KFold(n_splits=min_split)

        for cv_train_idx, cv_test_idx in split_method.split(self.sequences):
            self.X, self.lengths = combine_sequences(cv_train_idx, self.sequences)
            test_X, test_Lengths = combine_sequences(cv_test_idx, self.sequences)

            model = self.base_model(n)
            score.append(model.score(test_X, test_Lengths))

        cv = np.mean(score)

        return model, cv

    def select(self):
        warnings.filterwarnings("ignore", category=DeprecationWarning)

        # TODO implement model selection using CV
        #raise NotImplementedError

        best_model = None
        best_score = float("-inf")

        for n_components in range(self.min_n_components, self.max_n_components+1):
            try:
                model, score = self.internalSelectorCV(n_components)
                if score > best_score:
                    best_score = score
                    best_model = model
            except Exception as e:
                continue

        return best_model


