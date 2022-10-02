from flask import Flask, render_template, request, jsonify, redirect, url_for
import pandas as pd
import json
import time
from models.model import Model
from models.TW_freq_filter import frequency, recipeFilter
#import zipfile


#zf = zipfile.ZipFile('realData/database.csv.zip')
df_frequency = pd.read_csv("realData/frequency.csv")
big_df1 = pd.read_csv("realData/Part1.csv")
big_df2 = pd.read_csv("realData/Part2.csv")
big_df3 = pd.read_csv("realData/Part3.csv")

#1. Declare application
app= Flask(__name__)

#2. Declare data stores
class DataStore():
    Selected_ingredients = None #e.g. ['potatoes', 'bananas', 'strawberries']
    Input_tags = None #e.g. [1,1,1,1,1]
    Cluster_ID = None #e.g. 2
    Network_data=None #json data
    Recipe_stats=None
    Rating=None

data=DataStore()

def generate_tags(string_tags):
    tags = pd.read_csv("realData/tags_new.csv")
    integer_tags = [0,0,0,0,0]
    for str in string_tags:
        str = str.replace(" ", "-")
        col_names = list(tags.columns)
        for i in range(len(col_names)):
            index = tags.index[tags[col_names[i]] == str].tolist()
            if len(index)!=0:
                integer_tags[i-1] = index[0]+1
    return integer_tags


@app.route("/main",methods=["GET","POST"])


#3. Define main code
@app.route("/",methods=["GET","POST"])
def homepage():
    if request.method == 'POST':
        print("Jump to result page...")
        return redirect(url_for('result_page'))
    return render_template("index.html")


@app.route("/result_page",methods=["GET","POST"])
def result_page():
    return render_template("Result.html")


@app.route("/get_ingredient_list")
def get_ingredient_list():
    with open('realData/ingredient_list.json') as f:
        ingredient_list = json.load(f)
    return jsonify(ingredient_list)


@app.route("/get_tags")
def get_tags():
    with open('realData/tag_list.json') as f:
        tags = json.load(f)
    return jsonify(tags)


@app.route("/generate_result",methods=["GET","POST"])
def generate_result():
    data.Network_data = None
    data.Recipe_stats = None
    print("------check data------")
    print(big_df1['name'].iloc[1])

    #-----get selected ingredients & input tags-----#
    print("-------request1-------")
    Selected_ingredients = request.args.getlist('selected[]')
    string_tags = request.args.getlist('tags[]')
    integer_tags = generate_tags(string_tags)
    #print(string_tags)

    if len(Selected_ingredients)==0:
        Selected_ingredients = data.Selected_ingredients
    if len(integer_tags)==0:
        integer_tags = data.Input_tags
    print("Selected ingredients: ", Selected_ingredients)
    print("Integer tags: ", integer_tags)
    data.Selected_ingredients = Selected_ingredients
    data.Input_tags = integer_tags

    #-----use model to predict results-----#
    model = Model()
    cluster_id = model.cluster(integer_tags)
    data.Cluster_ID = cluster_id[0]+1
    #print("Cluster id: ", cluster_id)
    output = model.regression(Selected_ingredients,cluster_id=cluster_id[0]+1)
    ingredients = output['name'].tolist()
    print("Recommended ingredients: ", ingredients)
    network_data = frequency(df_frequency, Selected_ingredients, ingredients)
    Recipe_stats1 = recipeFilter(big_df1, Selected_ingredients)

    time.sleep(0.2)
    Recipe_stats2 = recipeFilter(big_df2, Selected_ingredients)

    time.sleep(0.2)
    Recipe_stats3 = recipeFilter(big_df3, Selected_ingredients)
    Recipe_stats = pd.concat([Recipe_stats1, Recipe_stats2, Recipe_stats3], sort=False)
    Recipe_stats = Recipe_stats.to_json(orient='records')

    #-----store results-----#
    d2 = {"name": "network_data", "data": []}
    d2['data']=network_data
    e2 = json.dumps(d2)
    data.Network_data = json.loads(e2)

    d3 = {"name": "statistics", "data": []}
    d3['data']=Recipe_stats
    e3 = json.dumps(d3)
    data.Recipe_stats = json.loads(e3)
    print("-------updated1-------")
    return render_template("Result.html")


@app.route("/update_result",methods=["GET","POST"])
def update_result():
    data.Network_data = None
    data.Recipe_stats = None

    #-----get selected ingredients & input tags-----#
    print("-------request2-------")
    Selected_ingredients = request.args.getlist('selected[]')

    if len(Selected_ingredients)==0:
        Selected_ingredients = data.Selected_ingredients

    print("Selected ingredients: ", Selected_ingredients)
    data.Selected_ingredients = Selected_ingredients

    #-----use model to predict results-----#
    model = Model()
    cluster_id = data.Cluster_ID
    output = model.regression(Selected_ingredients,cluster_id)
    ingredients = output['name'].tolist()
    print("Recommended ingredients: ", ingredients)
    network_data = frequency(df_frequency, Selected_ingredients, ingredients)
    Recipe_stats1 = recipeFilter(big_df1, Selected_ingredients)

    time.sleep(0.2)
    Recipe_stats2 = recipeFilter(big_df2, Selected_ingredients)

    time.sleep(0.2)
    Recipe_stats3 = recipeFilter(big_df3, Selected_ingredients)
    Recipe_stats = pd.concat([Recipe_stats1, Recipe_stats2, Recipe_stats3], sort=False)
    Recipe_stats = Recipe_stats.to_json(orient='records')

    #-----store results-----#
    d2 = {"name": "network_data", "data": []}
    d2['data']=network_data
    e2 = json.dumps(d2)
    data.Network_data = json.loads(e2)

    d3 = {"name": "statistics", "data": []}
    d3['data']=Recipe_stats
    e3 = json.dumps(d3)
    data.Recipe_stats = json.loads(e3)
    print("-------updated2-------")
    return render_template("Result.html")


@app.route("/get_network_data",methods=["GET","POST"])
def get_network_data():
    wait = True
    mustend = time.time() + 60
    while wait == True:
        if data.Network_data is not None: #checks the condition
            wait = False
        if time.time()>=mustend:
            break
        time.sleep(0.1)

    Network_data = data.Network_data
    print("-------get network data-------")
    return jsonify(Network_data)


@app.route("/get_stats",methods=["GET","POST"])
def get_stats():
    wait = True
    mustend = time.time() + 60
    while wait == True:
        if data.Recipe_stats is not None: #checks the condition
            wait = False
        if time.time()>=mustend:
            break
        time.sleep(0.1)

    statistics = data.Recipe_stats
    print("-------get statistics-------")
    return jsonify(statistics)


@app.route("/get_prediction")
def get_prediction():
    Selected_ingredients = data.Selected_ingredients
    cluster_id = data.Cluster_ID
    model = Model()
    pred_rating = model.rating_prediction(Selected_ingredients, cluster_id)
    print("Predict rating: ", pred_rating)
    return pred_rating

@app.route("/groupinfo")
def groupinfo():
    return render_template("GroupInfo.html")


if __name__ == "__main__":
    app.run(debug=True)
