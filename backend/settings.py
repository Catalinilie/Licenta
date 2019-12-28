from flask import Flask
from flask_cors import CORS, cross_origin
from flask_mail import Mail

app = Flask(__name__)
cors = CORS(app)

UPLOAD_FOLDER = './static'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'playingfieldbooking@gmail.com',
    "MAIL_PASSWORD": 'owfoklzzxydikkkc',
    "MAIL_DEFAULT_SENDER": 'playingfieldbooking@gmail.com'
}
 # google password: asd9(d8*&4S8(sFAw

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config.update(mail_settings)
mail = Mail(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/ilie.prisacariu/Desktop/li/project/backend/database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
