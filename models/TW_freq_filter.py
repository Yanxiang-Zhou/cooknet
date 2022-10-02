import pandas as pd


################################################################################
# 1. Filter

#########################
# 1.1 Read "frequency.csv"

# df_frequency = pd.read_csv("frequency.csv")





##########################
# 2.2 call frequency

"""
Call find_frequency to generate the dataframe.

Input: df, use df_frequency
       selected, a list containing n selected ingredients.
       recommended, a list containing m (like 20) recommended ingredients, 
outout: json_out, json: "source", "target", "isSourceSelected", "isTourceSelected", "frequency"; 
"""


def frequency(df,selected,recommended): 
    
    # input: df, use df_frequency, the dataframe of the frequency.csv 
    #        selected, list of m selected ingredients
    #        recommended, list of n (like 20) recommended ingredients
    # output: df, DataFrame of the filtered recipes
    
    ingreList = selected + recommended
    ingreList.sort()
    
    df_out = pd.DataFrame()
    
    
    idx_1 = 0
    for i in range(len(ingreList)-1):
        a = ingreList[i]
       
        df = df.iloc[idx_1:]
        df_a = df[(df.source == a)]
        #inx = df_a.index[-1]
        
        for b in ingreList[i+1:]:
            df_ab = df_a[(df_a.target == b)]
            df_out = df_out.append (df_ab)  
            
            idx_2 =  df_ab.index
            
            if a in selected:
                df_out.at[idx_2,'isSourceSelected'] = 1
            else:
                df_out.at[idx_2,'isSourceSelected'] = 0
        
            if b in selected:
                df_out.at[idx_2,'isTargetSelected'] = 1
            else:
                df_out.at[idx_2,'isTargetSelected'] = 0
                
    out = df_out.to_json(orient='records')    
    return out







################################################################################
# 2. Recipe filter

##########################
# 2.1 Read "database.csv"

# df_database = pd.read_csv("database.csv")



##########################
# 2.2 call recipeFilter

"""
input: df: a dataframe containg recipes to be filtered.    
       ingreList: a list of ingredients
output: df, DataFrame of the found recipes.
"""
# Note: To use recipeFilter for the first time filter (when customer selected n ingredients
#       at the main page), use df_database for df, and use the selected n ingredients as ingreList.
#       Use df_filtered = recipeFilter(df_database,ingreList) to get the output dataframe.

#       For the further filter (when customer added m new ingredients from the network),
#       use df_filtered for df, and use the newly selected m ingredients as ingreList.


def recipeFilter(df,ingreList): 
    """
    input: df, a dataframe containg recipes to be filtered.
    output: df, DataFrame of the found recipes.
    """
    for i in range(len(ingreList)):
        df = df[df.ingredients.str.contains(ingreList[i])]
    return df
    # This output spark dataframe needs to be used by the next furtherFilter.
    # Use json_filtered = df_filtered.toJSON(orient='records') to convert the spark dataframe to json.
