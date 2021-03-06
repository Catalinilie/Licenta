from ModelUtil import generateUUID
from flask_sqlalchemy import SQLAlchemy
import json

from AddressModel import Address
from settings import app

db = SQLAlchemy(app)


class PlayingField(db.Model):
    __tablename__ = 'PlayingField'

    id = db.Column(db.String, primary_key=True, unique=True)
    title = db.Column(db.String)
    type = db.Column(db.String(250), nullable=False)
    numberOfPlayers = db.Column(db.Integer, nullable=False)
    price = db.Column(db.String, nullable=False)
    userId = db.Column(db.String, nullable=False)
    addressId = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    createdOn = db.Column(db.DateTime, server_default=db.func.now())
    updatedOn = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def json(self):
        return {
            "id": self.id,
            "title": self.title,
            "type": self.type,
            "numberOfPlayers": self.numberOfPlayers,
            "price": self.price,
            "userId": self.userId,
            "addressId": self.addressId,
            "description": self.description,
            "address": Address.getAddressByPlayingFieldId(self.id)
        }

    def __repr__(self):
        palyingField_object = str({
            "id": self.id,
            "title": self.title,
            "type": self.type,
            "numberOfPlayers": self.numberOfPlayers,
            "price": self.price,
            "userId": self.userId,
            "addressId": self.addressId,
            "description": self.description,
            "address": Address.getAddressByPlayingFieldId(self.id)
        })
        return json.dumps(palyingField_object)

    def playingFieldCount():
        count = PlayingField.query.count()
        return json.dumps({"count": count}), 200


    def getAllPlayingFields(index, count):
        playingFields = PlayingField.query.order_by(PlayingField.createdOn.desc()).limit(count).offset(index)
        return json.dumps([PlayingField.json(playingField) for playingField in playingFields])

    def getPlayingFieldsByUserId(_userId):
        playingFields = PlayingField.query.filter_by(userId=_userId).all()
        return json.dumps(
            [PlayingField.json(playingField) for playingField in playingFields])

    def getPlayingFieldsByType(_type):
        playingFields = PlayingField.query.filter_by(type=_type)
        return json.dumps([PlayingField.json(playingField) for playingField in playingFields])

    def getPlayingFieldInfo():
        playingFieldType = PlayingField.query.group_by(PlayingField.type).all()
        playingFieldCity = Address.query.group_by(Address.city).all()
        playingFieldNumberOfPlayers = PlayingField.query.group_by(PlayingField.numberOfPlayers).all()
        return json.dumps([[playingFieldType.type for playingFieldType in playingFieldType],
                          [playingFieldType.city for playingFieldType in playingFieldCity],
                          [playingFieldType.numberOfPlayers for playingFieldType in playingFieldNumberOfPlayers]]), 200

    def getPlayingFieldsById(_id):
        playingField = PlayingField.query.filter_by(id=_id).first()
        return PlayingField.json(playingField)

    def verifyIfPlayingFieldWithAddressExist(_type, _numberOfPlayers, _userId, address):
        playingField = PlayingField.query.filter_by(type=_type) \
            .filter_by(numberOfPlayers=_numberOfPlayers).filter_by(userId=_userId).first()
        addressExist = Address.addressExist(address["street"],
                                            address["streetNr"],
                                            address["city"],
                                            address["region"],
                                            address["country"],
                                            address["addressCode"])
        if (playingField is None) or (addressExist is None):
            return False
        else:
            return True

    def createPlayingField(_title, _type, _numberOfPlayers, _price, _userId, _description, address, _phoneNumber,
                           _email):
        if PlayingField.verifyIfPlayingFieldWithAddressExist(_type, _numberOfPlayers, _userId, address) is False:
            _id = generateUUID()
            if PlayingField.query.filter_by(id=_id).first() is None:
                addressId = Address.createAddress(_id,
                                                  address["street"],
                                                  address["streetNr"],
                                                  address["city"],
                                                  address["region"],
                                                  address["country"],
                                                  address["addressCode"],
                                                  _phoneNumber,
                                                  _email)

                if addressId is not None:
                    newPlayingField = PlayingField(
                        id=_id,
                        title=_title,
                        type=_type,
                        numberOfPlayers=_numberOfPlayers,
                        price=_price,
                        userId=_userId,
                        description=_description,
                        addressId=addressId
                    )
                    db.session.add(newPlayingField)
                    db.session.commit()
                    return json.dumps({"id": _id}), 200
            else:
                PlayingField.createPlayingField(_title, _type, _numberOfPlayers, _price, _userId, _description, address,
                                                _phoneNumber,
                                                _email)
        else:
            return "The playing field already exist.", 409

    def updatePlayingField(_id, _title, _type, _numberOfPlayers, _description, _price):
        playingField = PlayingField.query.filter_by(id=_id).first()
        if playingField is None:
            return False
        else:
            if _title is not None:
                playingField.title = _title
            if _type is not None:
                playingField.type = _type
            if _numberOfPlayers is not None:
                playingField.numberOfPlayers = _numberOfPlayers
            if _description is not None:
                playingField.description = _description
            if _price is not None:
                playingField.price = _price

            db.session.commit()
            return True

    def updatePlyingFieldType(_id, _type):
        playingField = PlayingField.query.filter_by(id=_id).first()
        if playingField is None:
            return False
        else:
            playingField.type = _type
            db.session.commit()
            return True

    def updatePlayingFieldNumberOfPlayers(_id, _numberOfPlayers):
        playingField = PlayingField.query.filter_by(id=_id).first()
        if playingField is None:
            return False
        else:
            playingField.numberOfPlayers = _numberOfPlayers
            db.session.commit()
            return True

    def updatePlayingFieldDescription(_id, _description):
        playingField = PlayingField.query.filter_by(id=_id).first()
        if playingField is None:
            return False
        else:
            playingField.description = _description
            db.session.commit()
            return True

    def search(_type, _numberOfPlayers, _city):
        playingFields = None
        if _type is not None:
            playingFields = PlayingField.query.filter_by(type=_type)
        else:
            playingFields = PlayingField.query
        if _numberOfPlayers is not None:
            playingFields = playingFields.filter_by(numberOfPlayers=_numberOfPlayers)
        if playingFields is None:
            return "No Playing Field found.", 404
        else:
            playingFields = playingFields.all()
        result = ([PlayingField.json(playingField) for playingField in playingFields])
        if _city is not None:
            newResult = list()
            for res in result:
                if res["address"]["city"] == _city:
                    newResult.append(res)
            return json.dumps(newResult)
        else:
            return json.dumps(result)

    def getLastsAddedPlayingFields(numberOfFields):
        playingFields = PlayingField.query.order_by(PlayingField.createdOn.desc()).limit(numberOfFields).all()
        if playingFields is None:
            return "No Playing Field found.", 404
        return json.dumps([PlayingField.json(playingField) for playingField in playingFields]), 200

    def deletePlayingField(_id):
        playingField = PlayingField.query.filter_by(id=_id).first()
        if playingField is None:
            return False
        else:
            PlayingField.query.filter_by(id=_id).delete()
            db.session.commit()
            return True
