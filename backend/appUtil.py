import json
from functools import wraps
import jwt
from flask import request, jsonify
from UserModel import User
from settings import app


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

    if "password" in data and "username" in data and "phoneNumber" in data:
        user = User.updateUser(user_id, data["username"], data["password"], data["phoneNumber"])
        if not user:
            return "User does not exist.", 404
        else:
            return "User updated with success.", 200

    if "password" in data and "username" in data:
        user = User.updateUsernameAndPassword(user_id, data["password"], data["username"])
        if not user:
            return "User does not exist.", 404
        else:
            return "Username and password updated with success.", 200

    if "password" in data:
        user = User.updatePassword(user_id, data["password"])
        if not user:
            return "User does not exist.", 404
        else:
            return "User password updated with success.", 200
    if "username" in data:
        user = User.updateUserName(user_id, data["username"])
        if user == False:
            return "User does not exist.", 404
        else:
            return "Username updated with success.", 200


def getUser(_id):
    result = User.getUserById(_id)
    if result is None:
        return "No user with id:" + _id + " found"
    else:
        return result
