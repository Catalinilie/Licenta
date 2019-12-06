import uuid

from flask_sqlalchemy import SQLAlchemy

from settings import app
import json

db = SQLAlchemy(app)


def generateUUID():
    return uuid.uuid4()


class User(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    firstName = db.Column(db.String(80), nullable=False)
    lastName = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "password": self.password
        }

    def __repr__(self):
        user_object = str({
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "password": self.password
        })
        return json.dumps(user_object)

    def username_password_match(_username, _password):
        user = User.query.filter_by(username=_username).filter_by(password=_password).first()

        if user is None:
            return False
        else:
            return True

    def updatePassword(_userId, _password):
        user = User.query.filter_by(id=_userId).first()

        if user is None:
            return False

        user.password = _password
        db.session.commit()
        return True

    def updateUserName(_id, _newUsername):
        user = User.query.filter_by(id=_id).first()

        if user is None:
            return False

        user.username = _newUsername
        db.session.commit()
        return True

    def updateUsernameAndPassword(_userId, _password, _username):
        user = User.query.filter_by(id=_userId).first()

        if user is None:
            return False

        user.username = _username
        user.password = _password
        db.session.commit()
        return True

    def getAllUsers():
        return json.dumps([User.json(user) for user in User.query.all()])

    def getUserIdByUsername(_username):
        user = User.query.filter_by(username=_username).first()
        return user.id

    def getUserById(_id):
        user = User.query.filter_by(id=_id)
        return user

    def usernameExist(_username):
        user = User.query.filter_by(username=_username).first()
        if user is None:
            return False
        else:
            return True

    def userExist(_id):
        user = User.query.filter_by(id=_id).first()
        if user is None:
            return False
        else:
            return True

    def emailAlreadyExist(_email):
        user = User.query.filter_by(email=_email).first()
        if user is None:
            return False
        else:
            return True

    def create_user(_email, _username, _firstName, _lastName, _password):
        id1 = generateUUID()
        if User.query.filter_by(id=id1).first() is not None:
            new_user = User(email=_email, username=_username, firstName=_firstName, lastName=_lastName, password=_password)
            db.session.add(new_user)
            db.session.commit()
            return
        else:
            User.create_user(_email, _username, _firstName, _lastName, _password)

    def deleteUser(_id):
        user = User.getUserById(_id)
        if user is None:
            return False
        else:
            User.query.filter_by(id=_id).delete()
            db.session.commit()
            return True
