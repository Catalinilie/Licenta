from functools import wraps

import jwt
from flask import request, Response

from PlayingFieldModel import *
from UserModel import *
from settings import *

app.config['SECRET_KEY'] = "secret"


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


@app.route('/')
@app.route('/login', methods=['POST'])
def get_token():
    requestData = json.loads(request.data)
    username = requestData["username"]
    password = requestData["password"]

    if User.username_password_match(username, password):
        token = jwt.encode({"": requestData}, app.config['SECRET_KEY'], algorithm='HS256')
        return token
    else:
        return Response('The username or password are wrong.', 401, mimetype='application.json')


@app.route('/users', methods=['GET'])
def getAllUsers():
    users = User.getAllUsers()
    return users, 200


@app.route('/playingField', methods=['GET'])
# @token_required
def getAllPlayingFields():
    return PlayingField.getAllPlayingFields(), 200


@app.route('/playingField', methods=['POST'])
# @token_required
def createPlayingField():
    playingField = json.loads(request.data)
    address = playingField["address"]
    return  PlayingField.createPlayingField(playingField["type"], playingField["numberOfPlayers"],
                                    playingField["userId"], address)


@app.route('/')
@app.route('/register', methods=['POST'])
def register():
    Credential = json.loads(request.data)
    if User.usernameExist(Credential["username"]):
        return "User already exist.", 409
    if User.emailAlreadyExist(Credential["email"]):
        return "Email already used by another user.", 409
    else:
        User.create_user(
            Credential["email"],
            Credential["username"],
            Credential["firstName"],
            Credential["lastName"],
            Credential["password"]
        )
        return "User created with succes", 201


def deleteUser(user_id):
    result = User.deleteUser(user_id)
    if result == False:
        return "No user with id " + user_id + " exist.", 404
    else:
        return "User deleted with succes.", 200


def updateUser(user_id):
    data = json.loads(request.data)

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


@app.route('/users/<id>', methods=['GET', 'PATCH', 'DELETE'])
def userFunction(id):
    if request.method == 'GET':
        return getUser(id)

    elif request.method == 'PATCH':
        return updateUser(id)

    elif request.method == 'DELETE':
        return deleteUser(id)


@app.route('/users/username', methods=['GET'])
def getUserByUsername():
    data = json.loads(request.data)
    _username = data["username"]
    result = User.getUserByUsername(_username)
    if result is None:
        return "No user with username:" + _username + " found"
    else:
        return result


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=4996)
