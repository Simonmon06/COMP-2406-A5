


The node version is 8.11.4 and npm version is 5.6.0.

Open 2406fall2018Assignment5 Rev2.html to see requirments for this project.

First get mongod running. That is, start up the mongodb database listening
on its default port of 27017.
You need to clean the database if you want to test locally.
By using the following commends
use myShoppingApp3

db.departments.remove({})
db.categories.remove({})
db.products.remove({})
db.variants.remove({})

Next run the populate-for-startup.js
file inside the seed directory to populate the mongodb database.
You can run the file with below command (after locating in the terminal)
node populate-for-startup.js

** Important
Open terminal on the folder ShoppingApp.
Before starting application please make sure your mongo database runs.
To test the code from local , 
type the command: 
npm start
then you can access from localhost at
http://localhost:3000

Test the code on OpenStack
visit http://134.117.216.176:3000/ （not available for now, OpenStack is closed）


Login to the app using the dummy user for project:
username : admin@admin.com
password : admin



