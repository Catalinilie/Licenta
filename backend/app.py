import jwt
from flask import request, Response
from AvailableTimeModel import AvailableTime
from PlayingFieldModel import *
from UserModel import *
from appUtil import deleteUser, updateUser, getUser, token_required
from settings import *

app.config['SECRET_KEY'] = "secret"


@app.route('/')
@app.route('/login', methods=['POST'])
@cross_origin()
def get_token():
    requestData = json.loads(request.data)
    username = requestData["username"]
    password = requestData["password"]
    userId = User.getUserIdByUsername(username)

    if User.username_password_match(username, password):
        token = jwt.encode({"": requestData}, app.config['SECRET_KEY'], algorithm='HS256')
        result = {
            "token": str(token.decode()),
            "id": userId
        }
        return json.dumps(result), 200
    else:
        return Response('The username or password are wrong.', 401, mimetype='application.json')


@app.route('/users', methods=['GET'])
def getAllUsers():
    users = User.getAllUsers()
    return users, 200


@app.route('/playingField', methods=['GET'])
@token_required
def getPlayingFields():
    requestData = json.loads(request.data)
    id = requestData["id"]
    return PlayingField.getPlayingFieldsByUserId(id), 200


@app.route('/playingFields', methods=['GET'])
# @token_required
def getAllPlayingFields():
    return PlayingField.getAllPlayingFields(), 200


@app.route('/playingField', methods=['POST'])
@token_required
def createPlayingField():
    playingField = json.loads(request.data)
    userId = playingField["userId"]
    type = playingField["type"]
    numberOfPlayers = playingField["numberOfPlayers"]
    address = playingField["address"]
    phoneNumber = User.getPhoneNumber(userId)
    email = User.getEmail(userId)
    return PlayingField.createPlayingField(type, numberOfPlayers, userId, address, phoneNumber, email)


@app.route('/')
@app.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data)
    if User.usernameExist(data["username"]):
        return "User already exist.", 409
    if User.emailAlreadyExist(data["email"]):
        return "Email already used by another user.", 409
    else:
        User.create_user(
            data["email"],
            data["username"],
            data["phoneNumber"],
            data["firstName"],
            data["lastName"],
            data["password"]
        )
        return "User created with succes", 201


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


@app.route('/availableTime/<id>', methods=['POST', 'GET', 'PATCH'])
def addAvailableTimeToPlayingField(id):
    if request.method == 'GET':
        return AvailableTime.getAvailableTimeByPlayingFieldId(id)

    availableTime = json.loads(request.data)
    dayOfWeekFrom = availableTime["dayOfWeekFrom"]
    dayOfWeekTo = availableTime["dayOfWeekTo"]
    hourOfOpening = availableTime["hourOfOpening"]
    hourOfClosing = availableTime["hourOfClosing"]

    if request.method == 'POST':

        return AvailableTime.createAvailableTime(id, dayOfWeekFrom, dayOfWeekTo, hourOfOpening, hourOfClosing)

    elif request.method == 'PATCH':

        return AvailableTime.updateAvailableTimeByPlayingFieldId(id, dayOfWeekFrom, dayOfWeekTo, hourOfOpening,
                                                                 hourOfClosing)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=4996)
