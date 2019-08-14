#!/usr/bin/python

import sys
import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
sys.path.append("../tools/")
from time import time
from tester import test_classifier, dump_classifier_and_data
from feature_format import featureFormat, targetFeatureSplit
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import RobustScaler, StandardScaler, Imputer, MinMaxScaler
from sklearn.grid_search import GridSearchCV
from sklearn.feature_selection import SelectKBest
from sklearn.cross_validation import StratifiedShuffleSplit, cross_val_score, train_test_split


def getFeaturesAndLabels(data_dict, features_list):
    '''
    Split data to label and feature for cross_validation
    param:
        data_dict     : dataset dict
        features_list : features list
    return:
        labels , features
    '''
    data = featureFormat(data_dict, features_list, sort_keys = True)

    return targetFeatureSplit(data)

def selectBestFeatures(data_dict, features_list, k, print_result):
    '''
    Using SelectKBest, find k best features.

    param:
        data_dict     : data set
        features_list : dlist of feature
        k             : number of max feature
    return:
        best_features : list of select features
    '''
    best_features = {}
    
    #data = featureFormat(data_dict, features_list)
    #labels, features = targetFeatureSplit(data)
    labels, features = getFeaturesAndLabels(data_dict, features_list)

    k_best = SelectKBest(k=k)
    k_best.fit(features, labels)
    
    unsorted_pair_list = zip(features_list[1:], k_best.scores_)
    sorted_pair_list   = sorted(unsorted_pair_list, key = lambda x: x[1], reverse = True)
    
    k_features = [pair[0] for pair in sorted_pair_list]
    k_scores   = [pair[1] for pair in sorted_pair_list]

    best_features['feature'] = k_features[:k]
    best_features['score']   = k_scores[:k]
    
    if print_result:
        #print final result
        print "--- Selet K Best Score ---"
        print pd.DataFrame(best_features)
        
    return best_features['feature']
    

def getClfScore(classifier, features, labels, cv):
    '''Evaluating performance of estimator

    param:
        classifier : classifiers list
        features   : data to fit
        labels     : samples data
        cv         : cross validation iterator
    return:
        test_score : dict of classification score
    '''
    
    test_score = {}

    for idx, clfname in enumerate(sorted(classifier.keys())):
        clf_score = {}
        clf = classifier[clfname]
        precision = cross_val_score(clf, features, labels, 'precision', cv)
        recall    = cross_val_score(clf, features, labels, 'recall', cv)
        
        clf_score['precision'] = np.mean(precision)
        clf_score['recall']    = np.mean(recall)
        
        test_score[clfname] = clf_score
    return test_score



def getBestClf(gridsearches, features, labels, cv):
    '''
    Evaluating performance of Classifiers

    param:
        gridsearches: classifiers list
        features    : data to fit
        labels      : samples data
        cv          : cross validation iterator
    return:
        test_score  : dict of classification score
    '''
    ### Run estimator to initial classification para
    classifiers = {}
    test_score  = {}
    for idx, clfname in enumerate(sorted(gridsearches.keys())):
        clf = gridsearches[clfname]
        clf.fit(features, labels)
        classifiers[clfname] = clf.best_estimator_
        print("Best parameters set found on:")
        print clfname
        print(clf.best_params_)

    ### Evaluating performance of estimator
    test_score = getClfScore(classifiers, features, labels, cv)

    return test_score


def getNewFeatures(df):
    '''
    Create new features list.
    param:
        df         : dataframe
    return:
        my_feature : new feature

    '''

    df['net_earnings'] = df['total_payments'] + df['total_stock_value']
    df['poi_sending_ratio'] = df['from_poi_to_this_person'] / df['to_messages']
    df['poi_receive_ratio'] = df['from_this_person_to_poi'] / df['from_messages']
    df['poi_overall_ratio'] = df['poi_sending_ratio']  + df['poi_receive_ratio']
    df['shared_receipt_ratio'] = df['shared_receipt_with_poi'] /(df['to_messages'] + df['from_messages'])

    my_features = ['net_earnings',
                   'poi_sending_ratio',
                   'poi_receive_ratio', 
                   'poi_overall_ratio',
                   'shared_receipt_ratio']

    return my_features

def removeOutlier(df, outliers):
    '''
    Remove a list of outliers from dataframe
    param:
        df       : datafram
        outliers : outliers list
    '''
    ### Remove outlier and missing data
    return df.drop(outliers)

def fillMissing(df):
    '''
    Fill missing value in dataframe

    param:
        df       : datafram
    '''
    ### Fill in missing values with median
    return df.fillna(df.median())

def get_classifier_score(clf, dataset, feature_list, folds = 200):
    data = featureFormat(dataset, feature_list, sort_keys = True)
    labels, features = targetFeatureSplit(data)
    cv = StratifiedShuffleSplit(labels, folds, random_state = 142)
    true_negatives = 0
    false_negatives = 0
    true_positives = 0
    false_positives = 0
    for train_idx, test_idx in cv: 
        features_train = []
        features_test  = []
        labels_train   = []
        labels_test    = []
        for ii in train_idx:
            features_train.append( features[ii] )
            labels_train.append( labels[ii] )
        for jj in test_idx:
            features_test.append( features[jj] )
            labels_test.append( labels[jj] )
        
        ### fit the classifier using training set, and test on test set
        clf.fit(features_train, labels_train)
        predictions = clf.predict(features_test)
        for prediction, truth in zip(predictions, labels_test):
            if prediction == 0 and truth == 0:
                true_negatives += 1
            elif prediction == 0 and truth == 1:
                false_negatives += 1
            elif prediction == 1 and truth == 0:
                false_positives += 1
            elif prediction == 1 and truth == 1:
                true_positives += 1
            else:
                break
    clf_score = {}
    try:
        total_predictions = true_negatives + false_negatives + false_positives + true_positives
        clf_score['accuracy']  = 1.0*(true_positives + true_negatives)/total_predictions
        clf_score['precision']  = 1.0*true_positives/(true_positives+false_positives)
        clf_score['recall']  = 1.0*true_positives/(true_positives+false_negatives)
        clf_score['f1']  = 2.0 * true_positives/(2*true_positives + false_positives+false_negatives)
        #clf_score['f2']  = (1+2.0*2.0) * precision*recall/(4*precision + recall)

    except:
        print "Got a divide by zero when trying out:", clf
        print "Precision or recall may be undefined due to a lack of true positive predicitons."

    return clf_score

def validateFeaturesSelection(data_dict, features_list, classifier):
    '''
    validate given classifier with using stratifie shuffle split cross validation. 
    param:
        data_dict     : datafram
        features_list : outliers list
        classifier    : classifiers
    '''
    
    poi_feature  = ['poi']
    k_max = len(features_list)
    input_features = poi_feature + features_list 
    test_score = {}

    for idx, clfname in enumerate(sorted(classifier.keys())):
        clf = classifier[clfname]
        f_sel = {}
        recall_ = []
        precision_ = []
        accuracy_ = []
        f1_ = []
        kfeature_ = []
        clfname_ = []
        for k in range(2, k_max):
            cv_score = {}
            select_feature = selectBestFeatures(data_dict, input_features, k, False)
       
            cv_score = get_classifier_score(clf, data_dict, poi_feature + select_feature)

            accuracy_.append(format(cv_score['accuracy'], '.3f'))
            precision_.append(format(cv_score['precision'], '.3f'))
            recall_.append(format(cv_score['recall'], '.3f'))
            f1_.append(format(cv_score['f1'], '.3f'))

            kfeature_.append(k)
            clfname_.append(clfname)

        f_sel['clf'] = clfname_
        f_sel['feature'] = kfeature_
        f_sel['accuracy'] = accuracy_
        f_sel['precision'] = precision_
        f_sel['recall'] = recall_
        f_sel['f1'] = f1_

        test_score[clfname] = f_sel

    ### Plot  feature score
    col = 150
    plt.figure(figsize = (20,5))
    for clfname, score in test_score.iteritems():
        col = col + 1
        x  = score['feature']
        y1 = score['accuracy']
        y2 = score['precision']
        y3 = score['recall']
        y4 = score['f1']
        plt.subplot(col)
        plt.axis([1, 25, 0, 1]) 
        plt.plot(x,y1,'r', label = 'accuracy')
        plt.plot(x,y2,'g', label = 'precision')
        plt.plot(x,y3,'b', label = 'recall')
        plt.plot(x,y4,'k', label = 'f1')
        plt.legend(loc='upper left')
        plt.xlabel('features')
        plt.ylabel('score')
        plt.title(clfname)
        print "---------------------------------------------------"
        print clfname
        print "---------------------------------------------------"
        print "K         ", x
        print "accuracy  ", y2
        print "precision ", y2
        print "recall    ", y1
        print "f1        ", y1
        
    plt.savefig('feature_selection_v2.png', bbox_inches='tight')
    plt.show()

    return test_score

t0 = time()

'''
### Task 0 Load data
'''

### Load the dictionary containing the dataset
data_dict = pickle.load(open("final_project_dataset.pkl", "r") )

'''
-------------------------------------------------------------------------------
### Task 1: Select what features you'll use.
-------------------------------------------------------------------------------
'''

### features_list is a list of strings, each of which is a feature name.
### The first feature must be "poi".


poi_feature  = ['poi']

fin_features = ['salary', 
                'deferral_payments', 
                'total_payments', 
                'bonus', 
                'deferred_income',
                'total_stock_value',  
                'restricted_stock',
                'expenses', 
                'exercised_stock_options', 
                'other', 
                'long_term_incentive']

email_features = ['to_messages', 
                  'from_poi_to_this_person', 
                  'from_messages', 
                  'from_this_person_to_poi', 
                  'shared_receipt_with_poi']

features_list = poi_feature + fin_features + email_features

'''
-------------------------------------------------------------------------------
### Task 2: Remove outliers
-------------------------------------------------------------------------------
'''

### Convert dictionary to pandas dataframe
enrondf = pd.DataFrame.from_dict(data_dict, orient = 'index')

### Fixed type from object to numeric and re-check
enrondf = enrondf.apply(pd.to_numeric, args = ('coerce',))
#print "--- Check type of the data ---"
#enrondf.info()

### List of outlier/missing value item
dropped_row_list = ['TOTAL',
                    'THE TRAVEL AGENCY IN THE PARK', 
                    'LOCKHART EUGENE E']

### Update dataset
enrondf = enrondf[features_list]

### Remove outlier and missing data
enrondf = removeOutlier(enrondf, dropped_row_list)

### Fill in missing values with median
enrondf = fillMissing(enrondf)

enrondf.info()

'''
-------------------------------------------------------------------------------
### Task 3: Create new feature(s)
-------------------------------------------------------------------------------

'''
### Get new features
new_features_list = getNewFeatures(enrondf)
### TODO : uncomment to check log
'''
print "--- Create New features ---"
print new_features_list
'''

'''
--- Create New features ---
['net_earnings', 'poi_sending_ratio', 'poi_receive_ratio', 'poi_overall_ratio', 'shared_receipt_ratio']
'''


'''
### Task 4: Try a varity of classifiers
'''
### Please name your classifier clf for easy export below.
### Note that if you want to do PCA or other multi-stage operations,
### you'll need to use Pipelines. For more info:
### http://scikit-learn.org/stable/modules/pipeline.html

### Convert pandas datafram to dictionary
tmp_df = enrondf.T
data_dict = tmp_df.to_dict()

### Construct a simple classifiers to validate features set. 
clf_cv = {}
clf_cv['Naive Bayes']   = GaussianNB()
clf_cv['Decision Tree'] = DecisionTreeClassifier()
clf_cv['Random Forest'] = RandomForestClassifier()
clf_cv['AdaBoost']      = AdaBoostClassifier()

### validate features selection
validate_features = fin_features + email_features + new_features_list
### TODO : uncomment to check log
'''
fcv_score = validateFeaturesSelection(data_dict, validate_features, clf_cv)
'''
'''
---------------------------------------------------
Random Forest
---------------------------------------------------
K          [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
accuracy   ['0.327', '0.418', '0.434', '0.478', '0.447', '0.355', '0.454', '0.422', '0.407', '0.446', '0.354', '0.423', '0.458', '0.450', '0.367', '0.400', '0.352', '0.368', '0.389']
precision  ['0.327', '0.418', '0.434', '0.478', '0.447', '0.355', '0.454', '0.422', '0.407', '0.446', '0.354', '0.423', '0.458', '0.450', '0.367', '0.400', '0.352', '0.368', '0.389']
recall     ['0.842', '0.857', '0.857', '0.864', '0.859', '0.848', '0.861', '0.857', '0.856', '0.861', '0.851', '0.858', '0.862', '0.861', '0.852', '0.855', '0.853', '0.852', '0.856']
f1         ['0.842', '0.857', '0.857', '0.864', '0.859', '0.848', '0.861', '0.857', '0.856', '0.861', '0.851', '0.858', '0.862', '0.861', '0.852', '0.855', '0.853', '0.852', '0.856']
---------------------------------------------------
Naive Bayes
---------------------------------------------------
K          [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
accuracy   ['0.425', '0.444', '0.474', '0.474', '0.474', '0.472', '0.484', '0.440', '0.437', '0.436', '0.429', '0.429', '0.428', '0.433', '0.431', '0.431', '0.432', '0.389', '0.375']
precision  ['0.425', '0.444', '0.474', '0.474', '0.474', '0.472', '0.484', '0.440', '0.437', '0.436', '0.429', '0.429', '0.428', '0.433', '0.431', '0.431', '0.432', '0.389', '0.375']
recall     ['0.854', '0.857', '0.862', '0.862', '0.862', '0.861', '0.863', '0.853', '0.852', '0.852', '0.851', '0.851', '0.850', '0.852', '0.852', '0.852', '0.852', '0.844', '0.841']
f1         ['0.854', '0.857', '0.862', '0.862', '0.862', '0.861', '0.863', '0.853', '0.852', '0.852', '0.851', '0.851', '0.850', '0.852', '0.852', '0.852', '0.852', '0.844', '0.841']
---------------------------------------------------
AdaBoost
---------------------------------------------------
K          [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
accuracy   ['0.290', '0.421', '0.351', '0.338', '0.339', '0.280', '0.317', '0.292', '0.314', '0.340', '0.314', '0.288', '0.286', '0.277', '0.268', '0.299', '0.296', '0.290', '0.272']
precision  ['0.290', '0.421', '0.351', '0.338', '0.339', '0.280', '0.317', '0.292', '0.314', '0.340', '0.314', '0.288', '0.286', '0.277', '0.268', '0.299', '0.296', '0.290', '0.272']
recall     ['0.828', '0.854', '0.834', '0.832', '0.832', '0.809', '0.816', '0.814', '0.827', '0.830', '0.821', '0.818', '0.816', '0.816', '0.813', '0.821', '0.822', '0.821', '0.817']
f1         ['0.828', '0.854', '0.834', '0.832', '0.832', '0.809', '0.816', '0.814', '0.827', '0.830', '0.821', '0.818', '0.816', '0.816', '0.813', '0.821', '0.822', '0.821', '0.817']
---------------------------------------------------
Decision Tree
---------------------------------------------------
K          [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
accuracy   ['0.226', '0.306', '0.321', '0.364', '0.312', '0.277', '0.349', '0.326', '0.298', '0.312', '0.282', '0.253', '0.260', '0.262', '0.231', '0.237', '0.243', '0.236', '0.226']
precision  ['0.226', '0.306', '0.321', '0.364', '0.312', '0.277', '0.349', '0.326', '0.298', '0.312', '0.282', '0.253', '0.260', '0.262', '0.231', '0.237', '0.243', '0.236', '0.226']
recall     ['0.797', '0.816', '0.816', '0.825', '0.811', '0.800', '0.825', '0.820', '0.811', '0.815', '0.806', '0.802', '0.801', '0.803', '0.796', '0.797', '0.799', '0.796', '0.794']
f1         ['0.797', '0.816', '0.816', '0.825', '0.811', '0.800', '0.825', '0.820', '0.811', '0.815', '0.806', '0.802', '0.801', '0.803', '0.796', '0.797', '0.799', '0.796', '0.794']
'''


### Select the final features
my_feature_list = poi_feature + selectBestFeatures(data_dict, poi_feature + validate_features, 8, True)

### TODO : uncomment to check log
'''
print "--- My Features List ---"
print my_feature_list
'''
'''
                   feature      score
0  exercised_stock_options  27.171364
1        total_stock_value  23.435005
2             net_earnings  16.283011
3                    bonus  15.823410
4        poi_receive_ratio  12.818278
5        poi_overall_ratio  12.733175
6                   salary  10.881501
7          deferred_income  10.254185

--- My Features List ---
['poi', 'exercised_stock_options', 'total_stock_value', 'net_earnings', 'bonus', 'poi_receive_ratio', 'poi_overall_ratio', 'salary', 'deferred_income']
'''


### Update features_list
features_list = my_feature_list;
### TODO : uncomment to check log
'''
print "--- Update Features List ---"
print features_list
'''
'''
['poi', 'exercised_stock_options', 'total_stock_value', 'net_earnings', 'bonus', 'poi_receive_ratio', 'poi_overall_ratio', 'salary', 'deferred_income']
'''

### Get number features (exclude poi)
max_feature_len = len(features_list) - 1

### Convert pandas to dict
to_my_dataset = enrondf[my_feature_list]
tmp_to_my_dataset = to_my_dataset.T

### Store to my_dataset for easy export below.
my_dataset = tmp_to_my_dataset.to_dict()

### Extract features and labels from dataset for local testing
data = featureFormat(my_dataset, features_list, sort_keys = True)
labels, features = targetFeatureSplit(data)


### Prepare param for classification test  
score = 'f1_weighted'
#score = 'recall'

### Scaling and impute data
#scaling = StandardScaler()
#scaling = MinMaxScaler()
scaling = RobustScaler()

### Split data to train test sets for cross validation iterator
cv = StratifiedShuffleSplit(labels, test_size = 0.5, n_iter = 200, random_state = 42)


### Set the parameters for cross-validation
param_grid = {}

param_grid['Decision Tree'] = {'decisiontreeclassifier__min_samples_split':range(5,14),
                              'decisiontreeclassifier__min_samples_leaf':range(5,14)}

param_grid['SVM'] = {'selectkbest__k':range(3, max_feature_len - 1),
                     'svc__C':[10**n for n in range(-3,3)], 
                     'svc__gamma':[10**n for n in range(-4,3)]}

param_grid['Naive Bayes']   = {'selectkbest__k':range(3, max_feature_len - 1)}

param_grid['Random Forest'] = {'randomforestclassifier__n_estimators':range(10, 20),
                               'randomforestclassifier__min_samples_split':range(10,20),
                               'randomforestclassifier__max_features':['auto', 'sqrt', 'log2']}

param_grid['AdaBoost']      = {'adaboostclassifier__n_estimators':range(10,20),
                               'adaboostclassifier__algorithm': ['SAMME', 'SAMME.R'],
                               'adaboostclassifier__learning_rate': [x * .1 for x in range(1,11)]}

### Construct a Pipeline
pipe = {}

pipe['Decision Tree'] = make_pipeline(Imputer(), 
                                      scaling,
                                      DecisionTreeClassifier())

pipe['SVM'] = make_pipeline(Imputer(),
                            scaling,
                            SelectKBest(), 
                            SVC(kernel='rbf'))

pipe['Naive Bayes'] = make_pipeline(Imputer(),
                                    scaling,
                                    SelectKBest(),
                                    GaussianNB())

pipe['Random Forest'] = make_pipeline(Imputer(),
                                      scaling, 
                                      RandomForestClassifier())

pipe['AdaBoost'] = make_pipeline(Imputer(), 
                                 scaling, 
                                 AdaBoostClassifier())

### Construct parameter for an estimatoe
gridCV = {}

gridCV['Decision Tree'] = GridSearchCV(pipe['Decision Tree'], 
                                       param_grid['Decision Tree'], 
                                       scoring = 'f1_weighted',
                                       cv = cv)

gridCV['SVM'] = GridSearchCV(pipe['SVM'],  
                             param_grid['SVM'] , 
                             cv=cv, 
                             scoring='f1_weighted')

gridCV['Naive Bayes'] = GridSearchCV(pipe['Naive Bayes'],
                                     param_grid['Naive Bayes'],
                                     scoring = 'f1_weighted',
                                     cv = cv)

gridCV['Random Forest'] = GridSearchCV(pipe['Random Forest'],
                                       param_grid['Random Forest'], 
                                       scoring = 'f1_weighted',
                                       cv = cv)

gridCV['AdaBoost'] = GridSearchCV(pipe['AdaBoost'], 
                                  param_grid['AdaBoost'], 
                                  scoring = 'f1_weighted',
                                  cv = cv)

### TODO : uncomment to run
'''
### Verify of classifiers
print "--- Run classification estimator test ---"
cv_score = getBestClf(gridCV, features, labels, cv)
clf_df=pd.DataFrame(cv_score)
print clf_df
'''
'''
--- Run classification estimator test ---
Best parameters set found on:
Decision Tree
{'decisiontreeclassifier__min_samples_leaf': 6, 'decisiontreeclassifier__min_samples_split': 10}
Naive Bayes
{'selectkbest__k': 7}
Best parameters set found on:
SVM
{'svc__gamma': 0.001, 'selectkbest__k': 3, 'svc__C': 100}
Best parameters set found on:
AdaBoost
{'adaboostclassifier__algorithm': 'SAMME', 'adaboostclassifier__n_estimators': 16, 'adaboostclassifier__learning_rate': 0.6000000000000001}
Best parameters set found on:
Random Forest
{'randomforestclassifier__min_samples_split': 11, 'randomforestclassifier__n_estimators': 15, 'randomforestclassifier__max_features': 'auto'}

           Decision Tree  Naive Bayes  SVM       AdaBoost  Random Forest
precision       0.303511  0.482596     0.390497  0.447699  0.485884
recall          0.250556  0.248333     0.098333  0.239444  0.161111
'''

'''
### Task 5: Tune your classifier to achieve better than .3 precision and recall 
'''
### using our testing script. Check the tester.py script in the final project
### folder for details on the evaluation method, especially the test_classifier
### function. Because of the small size of the dataset, the script uses
### stratified shuffle split cross validation. For more info: 
### http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.StratifiedShuffleSplit.html

'''
### GaussianNB classifier
clf = GaussianNB()
'''
'''
GaussianNB()
    Accuracy: 0.86407   Precision: 0.48728  Recall: 0.37350 F1: 0.42287 F2: 0.39180
    Total predictions: 15000    True positives:  747    False positives:  786   False negatives: 1253   True negatives: 12214
'''

'''
### SVM classifier
clf = SVC(kernel='rbf',
          gamma =0.001,  
          C=100)
'''
'''
Got a divide by zero when trying out: SVC(C=100, cache_size=200, class_weight=None, coef0=0.0,
  decision_function_shape=None, degree=3, gamma=0.001, kernel='rbf',
  max_iter=-1, probability=False, random_state=None, shrinking=True,
  tol=0.001, verbose=False)
Precision or recall may be undefined due to a lack of true positive predicitons.
'''
'''
### DecisionTree classifier
clf = DecisionTreeClassifier(criterion='gini', 
                             splitter='best', 
                             min_samples_split=8, 
                             min_samples_leaf=2,
                             max_features='sqrt', 
                             random_state=142, 
                             presort=True)
'''
'''
DecisionTreeClassifier(class_weight=None, criterion='gini', max_depth=None,
            max_features='sqrt', max_leaf_nodes=None, min_samples_leaf=2,
            min_samples_split=8, min_weight_fraction_leaf=0.0,
            presort=True, random_state=142, splitter='best')
    Accuracy: 0.85913   Precision: 0.45603  Recall: 0.29300 F1: 0.35677 F2: 0.31556
    Total predictions: 15000    True positives:  586    False positives:  699   False negatives: 1414   True negatives: 12301


'''

'''
### AdaBoost classifier
clf = AdaBoostClassifier(n_estimators=10, 
                         learning_rate=0.3, 
                         algorithm='SAMME', 
                         random_state=142)
'''
'''
AdaBoostClassifier(algorithm='SAMResponseQuestions_R2-2.htmlME', base_estimator=None, learning_rate=0.3,
          n_estimators=10, random_state=142)
    Accuracy: 0.87073   Precision: 0.58689  Recall: 0.10300 F1: 0.17524 F2: 0.12334
    Total predictions: 15000    True positives:  206    False positives:  145   False negatives: 1794   True negatives: 12855
'''


### Tune classifier model
clf = RandomForestClassifier(bootstrap = True,
                             criterion ='entropy',
                             max_features = 'sqrt', 
                             #min_samples_split = 5,
                             n_estimators = 35,
                             n_jobs = 1,
                             random_state = 142,
                             warm_start = True)

'''
RandomForestClassifier(bootstrap=True, class_weight=None, criterion='entropy',
            max_depth=None, max_features='sqrt', max_leaf_nodes=None,
            min_samples_leaf=1, min_samples_split=2,
            min_weight_fraction_leaf=0.0, n_estimators=35, n_jobs=1,
            oob_score=False, random_state=142, verbose=0, warm_start=True)
    Accuracy: 0.98407   Precision: 1.00000  Recall: 0.88050 F1: 0.93645 F2: 0.90206
    Total predictions: 15000    True positives: 1761    False positives:    0   False negatives:  239   True negatives: 13000
'''

### Verify of classifiers
test_classifier(clf, my_dataset, features_list)


'''
### Task 6: Dump your classifier, dataset, and features_list so anyone can
'''
### check your results. You do not need to change anything below, but make sure
### that the version of poi_id.py that you submit can be run on its own and
### generates the necessary .pkl files for validating your results.

dump_classifier_and_data(clf, my_dataset, features_list)

### Compute time check
print 'Time:',round(time()-t0,3) ,'s\n'

#print my_feature_list_test