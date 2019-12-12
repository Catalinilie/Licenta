from ModelUtil import generateUUID
from flask_sqlalchemy import SQLAlchemy
import json

from AddressModel import Address
from settings import app

db = SQLAlchemy(app)


class PlayingField(db.Model):
    __tablename__ = 'PlayingField'

    id = db.Column(db.String, primary_key=True, unique=True)
    type = db.Column(db.String(250), nullable=False)
    numberOfPlayers = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.String, nullable=False)
    addressId = db.Column(db.String, nullable=False)
    createdOn = db.Column(db.DateTime, server_default=db.func.now())
    updatedOn = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def json(self):
        return {
            "id": self.id,
            "type": self.type,
            "numberOfPlayers": self.numberOfPlayers,
            "userId": self.userId,
            "addressId": self.addressId,
            "address": Address.getAddressByPlayingFieldId(self.id)
        }

    def __repr__(self):
        palyingField_object = str({
            "id": self.id,
            "type": self.type,
            "numberOfPlayers": self.numberOfPlayers,
            "userId": self.userId,
            "addressId": self.addressId,
            "address": Address.getAddressByPlayingFieldId(self.id)
        })
        return json.dumps(palyingField_object)

    def getAllPlayingFields():
        return json.dumps([PlayingField.json(playingField) for playingField in PlayingField.query.all()])

    def getPlayingFieldByUserId(_userId):
        playingFields = PlayingField.query.filter_by(userId=_userId).all()
        return json.dumps(playingFields)

    def getPlayingFieldByType(_type):
        playingFields = PlayingField.query.filter_by(type=_type)
        return playingFields

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

    def createPlayingField(_type, _numberOfPlayers, _userId, address):
        if PlayingField.verifyIfPlayingFieldWithAddressExist(_type, _numberOfPlayers, _userId, address) is False:
            _id = generateUUID()
            if PlayingField.query.filter_by(id=_id).first() is None:
                addressId = Address.createAddress(_id,
                                                  address["street"],
                                                  address["streetNr"],
                                                  address["city"],
                                                  address["region"],
                                                  address["country"],
                                                  address["addressCode"])

                if addressId is not None:
                    newPlayingField = PlayingField(
                        id=_id,
                        type=_type,
                        numberOfPlayers=_numberOfPlayers,
                        userId=_userId,
                        addressId=addressId
                    )
                    db.session.add(newPlayingField)
                    db.session.commit()
                    return "Playing field created with succes.", 200
            else:
                PlayingField.createPlayingField(_type, _numberOfPlayers, _userId)
        else:
            return "The playing field already exist.", 409

    def updatePlyingFieldType(_id, _type):
        playingField = PlayingField.query.filter_by(id=_id).first()
        playingField.type = _type
        db.session.commit()

    def updatePlayingFieldNumberOfPlayers(_id, _numberOfPlayers):
        playingField = PlayingField.query.filter_by(id=_id).first()
        playingField.numberOfPlayers = _numberOfPlayers
        db.session.commit()
