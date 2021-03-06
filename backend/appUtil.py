import json
from functools import wraps
import jwt
from flask import request, jsonify

from AddressModel import Address
from AvailableSlotsModel import AvailableSlots
from ImageModel import Image
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

    password = None
    username = None
    phoneNumber = None
    firstName = None
    lastName = None

    if "password" in data:
        password = data["password"]
    if "username" in data:
        username = data["username"]
    if "phoneNumber" in data:
        phoneNumber = data["phoneNumber"]
    if "firstName" in data:
        firstName = data["firstName"]
    if "lastName" in data:
        lastName = data["lastName"]

    user = User.updateUser(user_id, username, password, phoneNumber, firstName, lastName)
    if not user:
        return "User does not exist.", 404
    else:
        return "User updated with success.", 200


def updatePlayingFieldById(playingFieldId):
    data = json.loads(request.data)
    if "title" in data:
        title = data["title"]
    else:
        title = None
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
    if "price" in data:
        price = data["price"]
    else:
        price = None

    if "street" in data:
        street = data["street"]
    else:
        street = None
    if "streetNr" in data:
        streetNr = data["streetNr"]
    else:
        streetNr = None
    if "city" in data:
        city = data["city"]
    else:
        city = None
    if "region" in data:
        region = data["region"]
    else:
        region = None
    if "country" in data:
        country = data["country"]
    else:
        country = None
    if "addressCode" in data:
        addressCode = data["addressCode"]
    else:
        addressCode = None

    playingField = PlayingField.updatePlayingField(playingFieldId, title, type, numberOfPlayers, description, price)
    address = Address.updateAddress(playingFieldId, street, streetNr, city, region, country, addressCode)
    if not playingField and not address:
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


def deletePlayingFieldById(playingFieldId):
    playingFieldDeleted = PlayingField.deletePlayingField(playingFieldId)
    addressDeleted = Address.deleteByPlayingFieldId(playingFieldId)
    imageDeleted = Image.deleteByPlayingFieldId(playingFieldId)
    timeSlots = AvailableSlots.deleteByPlayingFieldId(playingFieldId)
    if playingFieldDeleted and addressDeleted and imageDeleted and timeSlots:
        return "Playing Field deleted with success.", 200
    else:
        return "Something went wrong. Playing Field couldn't be deleted.", 404
