# cooknet
Description:
In this project, we build an interactive web application for new recipe creation. 
Our website interface contains two parts: the main page for user inputs and the result page. In the main page 'http://127.0.0.1:5000/', user needs to select several ingredients  as well as some tags for recipe creation. After pressing the 'Start' button, the website will go to the result page 'http://127.0.0.1:5000/result_page' which will display ingredients network, histograms and recommended recipes found in our dataset.

--------------------------
To check published website:
	Visit https://coonet.herokuapp.com/
NOTE: running locally is PREFERRED since the performance of published website is unstable due to limited memory quota. When multiple users are using the published website, the results can overlap. Please refresh the page if you couldn't see the expected results.


--------------------------
First time setup: 
1). navigate to the project folder in terminal
2). install libomp to prevent 'image not found' when later installing lightgbm
	```
	brew install libomp
	```
3). to install all dependent packages:
	```
	pip install -r requirements.txt 
	```
4). make sure your pip is upgraded to do step 1):
	```
	pip install --upgrade pip
	```


--------------------------
To run the website locally:
1). navigate to the project folder in terminal
2). run flask:
	```
	python app.py
	```
	```
OR  	flask run
	```
3). open the localhost in Google Chrome 'http://127.0.0.1:5000/' as prompted in terminal.
