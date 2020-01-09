from flask_sqlalchemy import SQLAlchemy
from ModelUtil import generateUUID
from settings import app
import json

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.String, primary_key=True, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    phoneNumber = db.Column(db.String(20), nullable=False)
    firstName = db.Column(db.String(80), nullable=False)
    lastName = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "username": self.username,
            "phoneNumber": self.phoneNumber,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "password": self.password
        }

    def __repr__(self):
        user_object = str({
            "id": self.id,
            "username": self.username,
            "phoneNumber": self.phoneNumber,
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

        user.password = _password
        user.username = _username
        db.session.commit()
        return True

    def updatePhoneNumber(_userId, _phoneNumber):
        user = User.query.filter_by(id=_userId).first()

        if user is None:
            return False

        user.phoneNumber = _phoneNumber
        db.session.commit()
        return True

    def updateUser(_userId, _username, _password, _phoneNumber, _firstName, _lastName):
        user = User.query.filter_by(id=_userId).first()

        if user is None:
            return False
        if _username is not None:
            user.username = _username
        if _password is not None:
            user.password = _password
        if _phoneNumber is not None:
            user.phoneNumber = _phoneNumber
        if _firstName is not None:
            user.firstName = _firstName
        if _lastName is not None:
            user.lastName = _lastName
        db.session.commit()
        return True

    def getAllUsers():
        return json.dumps([User.json(user) for user in User.query.all()])

    def getUserIdByUsername(_username):
        user = User.query.filter_by(username=_username).first()
        if user is None:
            return False
        else:
            return user.id

    def getPhoneNumber(_id):
        user = User.query.filter_by(id=_id).first()
        if user is None:
            return False
        else:
            return user.phoneNumber

    def getEmail(_id):
        user = User.query.filter_by(id=_id).first()
        if user is None:
            return False
        else:
            return user.email

    def getUserById(_id):
        user = User.query.filter_by(id=_id).first()
        if user is not None:
            return User.json(user)
        else:
            return "No user with " + _id + " found."

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

    def create_user(_email, _username, _phoneNumber, _firstName, _lastName, _password):
        _id = generateUUID()
        if User.query.filter_by(id=_id).first() is None:
            new_user = User(id=_id, email=_email, phoneNumber=_phoneNumber, username=_username, firstName=_firstName,
                            lastName=_lastName,
                            password=_password)
            db.session.add(new_user)
            db.session.commit()
            return
        else:
            User.create_user(_email, _phoneNumber, _username, _firstName, _lastName, _password)

    def deleteUser(_id):
        user = User.query.filter_by(id=_id).first()
        if user is None:
            return False
        else:
            User.query.filter_by(id=_id).delete()
            db.session.commit()
            return True
