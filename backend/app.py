import os

import jwt
from flask import request, Response, flash, send_from_directory, jsonify
from flask import url_for

from AvailableSlotsModel import AvailableSlots
from AvailableTimeModel import AvailableTime
from ImageModel import Image
from PlayingFieldModel import *
from UserModel import *
from appUtil import deleteUser, updateUser, getUser, token_required, updatePlayingFieldById, allowed_file, \
    deletePlayingFieldById
from settings import *
from flask_mail import Message

app.config['SECRET_KEY'] = "secret"


@app.route('/')
@app.route('/login', methods=['POST'])
@cross_origin()
def get_token():
    requestData = json.loads(request.data)
    username = requestData["username"]
    password = requestData["password"]
    userId = User.getUserIdByUsername(username)

    if userId == False:
        return Response('The username or password are wrong.', 401, mimetype='application.json')

    if User.username_password_match(username, password):
        token = jwt.encode({"": requestData}, app.config['SECRET_KEY'], algorithm='HS256')
        result = {
            "token": str(token.decode()),
            "userId": userId
        }
        return json.dumps(result), 200
    else:
        return Response('The username or password are wrong.', 401, mimetype='application.json')


@app.route('/playingFields', methods=['GET'])
# @token_required
def getPlayingFields():
    id = request.args.get('userId')
    return PlayingField.getPlayingFieldsByUserId(id), 200


@app.route('/playingField', methods=['GET'])
# @token_required
def getPlayingField():
    id = request.args.get('playingFieldId')
    if "index" in request.args:
        index = request.args.get('index')
    else:
        index = 1
    if "count" in request.args:
        count = request.args.get('count')
    else:
        count = 1
    if count == index == 1:
        return PlayingField.getPlayingFieldsById(id), 200
    if id is None:
        return PlayingField.getAllPlayingFields(index, count), 200
    else:
        return PlayingField.getPlayingFieldsByUserId(id), 200


@app.route('/search', methods=['GET'])
def search():
    if request.args.get('type') != "":
        type = request.args.get('type')
    else:
        type = None
    if request.args.get('city') != "":
        city = request.args.get('city')
    else:
        city = None
    if request.args.get('numberOfPlayers') != "":
        numberOfPlayers = request.args.get('numberOfPlayers')
    else:
        numberOfPlayers = None
    return PlayingField.search(type, numberOfPlayers, city)


@app.route('/lastAdded', methods=['GET'])
def lastAdded():
    numberOfFields = request.args.get('numberOfFields')
    return PlayingField.getLastsAddedPlayingFields(numberOfFields)


@app.route('/playingField', methods=['POST'])
@token_required
def createPlayingField():
    playingField = json.loads(request.data)
    userId = playingField["userId"]
    description = playingField["description"]
    title = playingField["title"]
    type = playingField["type"]
    numberOfPlayers = playingField["numberOfPlayers"]
    price = playingField["price"]
    address = playingField["address"]
    phoneNumber = User.getPhoneNumber(userId)
    email = User.getEmail(userId)
    return PlayingField.createPlayingField(title, type, numberOfPlayers, price, userId, description, address,
                                           phoneNumber,
                                           email)


@app.route('/playingField', methods=['PATCH'])
def updatePlayingField():
    id = request.args.get('id')
    return updatePlayingFieldById(id)


@app.route('/resetPassword', methods=['POST'])
def resetPassword():
    data = json.loads(request.data)
    mailAddress = data["email"]

    with app.app_context():
        msg = Message(subject="Hello",
                      sender=['playingfieldbooking@gmail.com', 'playingfieldbooking@gmail.com'],
                      recipients=[mailAddress],
                      body="The link is:")
        mail.send(msg)
        return "Mail sent with success.", 200


@app.route('/uploadImage', methods=['POST', 'GET'])
@cross_origin()
def upload_image():
    if request.method == 'POST':
        playingFieldId = request.args.get('playingFieldId')
        if 'image' in request.files:
            imageList = request.files.getlist("image")
            if len(imageList) == 0:
                return "No image uploaded."
            for image in imageList:
                if image and allowed_file(image.filename):
                    imagePath = os.getcwd() + "\static\\" + image.filename
                    result = Image.addImage(playingFieldId, imagePath)
                    if result == True:
                        image.save(imagePath)
                    else:
                        return "Image already exist."
                else:
                    return "File not allowed."
            return "Image added."
        else:
            return "No image was received from request.", 400
    if request.method == "GET":
        playingFieldId = request.args.get('playingFieldId')
        imagesPath = Image.getImage(playingFieldId)
        result = list()
        for imagePath in imagesPath:
            result.append(url_for("static", filename=imagePath.split("\\")[-1]))
        result = {i: result[i] for i in range(0, len(result))}
        return json.dumps(result)


@app.route('/')
@app.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data)
    if User.usernameExist(data["username"]):
        return "Username already exist.", 409
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


@app.route('/users', methods=['GET', 'PATCH', 'DELETE'])
@token_required
def userFunction():
    if request.method == 'GET':
        id = request.args.get("userId")
        return getUser(id)

    elif request.method == 'PATCH':
        data = json.loads(request.data)
        id = data["userId"]
        return updateUser(id)

    elif request.method == 'DELETE':
        data = json.loads(request.data)
        id = data["userId"]
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


@app.route('/deletePlayingField', methods=['DELETE'])
def deletePlayingField():
    playingFieldId = request.args.get('playingFieldId')
    return deletePlayingFieldById(playingFieldId)


@app.route('/deleteAvailableSlot', methods=['DELETE'])
@token_required
@cross_origin()
def deleteAvailableSlot():
    id = request.args.get('id')
    return AvailableSlots.deleteAvailableSlot(id)


@app.route('/addAvailableTime', methods=['POST'])
@token_required
def addAvailableTime():
    data = json.loads(request.data)
    playingFieldId = data["playingFieldId"]
    dayOfWeekFrom = data["dayOfWeekFrom"]
    dayOfWeekTo = data["dayOfWeekTo"]
    hourOfOpening = data["hourOfOpening"]
    hourOfClosing = data["hourOfClosing"]
    return AvailableTime.createAvailableTime(playingFieldId, dayOfWeekFrom, dayOfWeekTo, hourOfOpening, hourOfClosing)


@app.route('/getAvailableSlots', methods=['GET'])
def getAvailableSlots():
    playingFieldId = request.args.get('playingFieldId')
    return AvailableSlots.getAvailableSlotsByPlayingFieldId(playingFieldId)


@app.route('/addAvailableSlot', methods=['POST'])
@token_required
def addAvailableSlot():
    data = json.loads(request.data)
    playingFieldId = data["playingFieldId"]
    start = data["start"]
    end = data["end"]
    title = data["title"]
    return AvailableSlots.createAvailableSlot(playingFieldId, start, end, title)


@app.route('/updateAvailableTime', methods=['PATCH'])
def updateAvailableTime():
    data = json.loads(request.data)
    playingFieldId = data["playingFieldId"]
    dayOfWeekFrom = data["dayOfWeekFrom"]
    dayOfWeekTo = data["dayOfWeekTo"]
    hourOfOpening = data["hourOfOpening"]
    hourOfClosing = data["hourOfClosing"]
    return AvailableTime.updateAvailableTimeByPlayingFieldId(playingFieldId, dayOfWeekFrom, dayOfWeekTo, hourOfOpening,
                                                             hourOfClosing)


@app.route('/deleteAvailableSlot', methods=['DELETE'])
def deleteAvailableTime():
    data = json.loads(request.data)
    id = data["id"]
    return AvailableTime.deleteAvailableTime(id)


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
