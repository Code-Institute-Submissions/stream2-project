from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

#MONGODB_HOST = 'ds135798.mlab.com'
#MONGODB_PORT = 35798
MONGODB_URI = os.getenv('MONGODB_URI')
COLLECTION_NAME = 'project'
DBS_NAME = 'heroku_hsp90fx4'

FIELDS = {'funding_status': True, 'school_state': True, 'resource_type': True, 'poverty_level': True,
         'date_posted': True, 'total_donations': True, '_id': False}

@app.route("/")
def index():
   return render_template("index.html")

@app.route("/donorsUS/projects")
def donor_projects():
   connection = MongoClient(MONGODB_URI)
   collection = connection[DBS_NAME][COLLECTION_NAME]
   projects = collection.find(projection=FIELDS, limit=20000)
   json_projects = []
   for project in projects:
       json_projects.append(project)
   json_projects = json.dumps(json_projects)
   connection.close()
   return json_projects

if __name__ == "__main__":
   app.run(debug=True)
