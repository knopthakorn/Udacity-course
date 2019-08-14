import numpy as np

from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Activation
from keras.layers import TimeDistributed
from keras.layers import Bidirectional
import keras

# TODO: fill out the function below that transforms the input series 
# and window-size into a set of input/output pairs for use with our RNN model
def window_transform_series(series, window_size):
    # containers for input/output pairs
    X = []
    y = []
    
    X = [series[i:i + window_size] for i in range(series.size - window_size)]
    y = [series[i + window_size] for i in range(series.size - window_size)]

    # reshape each 
    X = np.asarray(X)
    X.shape = (np.shape(X)[0:2])
    y = np.asarray(y)
    y.shape = (len(y),1)

    return X,y

# TODO: build an RNN to perform regression on our time series input/output data
def build_part1_RNN(window_size):
    # make sequential model
    model = Sequential()
    # layer 1 with LSTM module with 5 hidden layer
    model.add(LSTM(5, input_shape=(window_size,1)))
    # layer 2 fully connected module with default linear output
    model.add(Dense(1))
    return model

### TODO: return the text input with only ascii lowercase and the punctuation given below included.
def cleaned_text(text):
    import re
    
    #punctuation = ['!', ',', '.', ':', ';', '?']
  
    # remove double dashes
    text = text.replace("--", "")
    # remove non-english characters and character 
    text = re.sub('[^a-zA-Z!,.:;?]', ' ', text)
    return text

### TODO: fill out the function below that transforms the input text and window-size into a set of input/output pairs for use with our RNN model
def window_transform_text(text, window_size, step_size):
    # containers for input/output pairs
    
    inputs= [text[i:i+window_size] for i in range(0,len(text)-window_size, step_size)]
    outputs= [text[i+window_size] for i in range(0,len(text)-window_size, step_size)]
    
    return inputs,outputs

# TODO build the required RNN model:
# a single LSTM hidden layer with softmax activation, categorical_crossentropy loss
def build_part2_RNN(window_size, num_chars):

    model = Sequential()
    # layer 1 with LSTM module with 200 hidden layer
    model.add(LSTM(200, input_shape=(window_size, num_chars)))
    # layer 2 fully connected module with default linear output
    model.add(Dense(num_chars, activation='linear'))
    model.add(Activation('softmax'))

    return model

# a Bidirectional LSTM hidden 
def build_part2_RNN_Bi(window_size, num_chars):

    model = Sequential()

    model.add(Bidirectional(LSTM(200, return_sequences=True), input_shape=(window_size, num_chars)))
    model.add(Bidirectional(LSTM(200)))
    model.add(Dense(num_chars))
    model.add(Activation('softmax'))
    
    return model
