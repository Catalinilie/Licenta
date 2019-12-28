import json
from functools import wraps
import jwt
from flask import request, jsonify

from PlayingFieldModel import PlayingField
from UserModel import User
from settings import app, ALLOWED_EXTENSIONS


def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.args.get('token')
        try:
            jwt.decode(token, app.config['SECRET_KEY'])
            return f(*args, **kwargs)
        except:
            return jsonify({'error': "Need a valid token to view this page"}), 401

    return wrapper


def deleteUser(user_id):
    result = User.deleteUser(user_id)
    if result == False:
        return "No user with id " + user_id + " exist.", 404
    else:
        return "User deleted with succes.", 200


def updateUser(user_id):
    data = json.loads(request.data)
    password = data["password"]
    username = data["username"]
    phoneNumber = data["phoneNumber"]

    if password is not None and username is not None and phoneNumber is not None:
        user = User.updateUser(user_id, username, password, phoneNumber)
        if not user:
            return "User does not exist.", 404
        else:
            return "User updated with success.", 200

    elif password is not None and username is not None:
        user = User.updateUsernameAndPassword(user_id, password, username)
        if not user:
            return "User does not exist.", 404
        else:
            return "Username and password updated with success.", 200

    elif password is not None:
        user = User.updatePassword(user_id, password)
        if not user:
            return "User does not exist.", 404
        else:
            return "User password updated with success.", 200
    if username is not None:
        user = User.updateUserName(user_id, username)
        if not user:
            return "User does not exist.", 404
        else:
            return "Username updated with success.", 200

    elif phoneNumber is not None:
        user = User.updatePhoneNumber(user_id, phoneNumber)
        if not user:
            return "User does not exist.", 404
        else:
            return "PhoneNumber updated with success.", 200


def updatePlayingFieldById(playingFieldId):
    data = json.loads(request.data)
    if "type" in data:
        type = data["type"]
    else:
        type = None
    if "numberOfPlayers" in data:
        numberOfPlayers = data["numberOfPlayers"]
    else:
        numberOfPlayers = None
    if "description" in data:
        description = data["description"]
    else:
        description = None

    playingField = PlayingField.updatePlayingField(playingFieldId, type, numberOfPlayers, description)
    if not playingField:
        return "PlayingField does not exist.", 404
    else:
        return "PlayingField updated with success.", 200


def allowed_file(filename):
    if filename.split(".")[1] not in ALLOWED_EXTENSIONS:
        return False
    else:
        return True


def getUser(_id):
    result = User.getUserById(_id)
    if result is None:
        return "No user with id:" + _id + " found"
    else:
        return result


def createPlayingField(playingField):
    userId = playingField["userId"]
    type = playingField["type"]
    numberOfPlayers = playingField["numberOfPlayers"]
    address = playingField["address"]
    phoneNumber = User.getPhoneNumber(userId)
    email = User.getEmail(userId)
    return PlayingField.createPlayingField(type, numberOfPlayers, userId, address, phoneNumber, email)
