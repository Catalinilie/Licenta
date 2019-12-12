from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/ilie.prisacariu/Desktop/li/project/backend/database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False