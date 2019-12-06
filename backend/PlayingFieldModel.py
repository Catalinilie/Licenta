from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import json
from sqlalchemy import DateTime

from settings import app

db = SQLAlchemy(app)


class PlayingField(db.Model):
    __tablename__ = 'PlayingField'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    type = db.Column(db.String(250), nullable=False)
    numberOfPlayers = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.Integer, nullable=False)
    createdOn = db.Column(db.DateTime, server_default=db.func.now())
    updatedOn = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def json(self):
        return {
            "type": self.type,
            "numberOfPlayers": self.numberOfPlayers,
            "userId": self.userId,
            "createdOn": self.createdOn
        }

    def __repr__(self):
        palyingField_object = str({
            "type": self.type,
            "numberOfPlayers": self.numberOfPlayers,
            "userId": self.userId,
            "createdOn": self.createdOn
        })
        return json.dumps(palyingField_object)

    def getAllPlayingFields():
        return json.dumps([PlayingField.json(user) for user in PlayingField.query.all()])

    def getPlayingFieldByUserId(_userId):
        playingFields = PlayingField.query.filter_by(userId=_userId).all()
        return json.dumps(playingFields)

    def getPlayingFieldByType(_type):
        playingFields = PlayingField.query.filter_by(type=_type)
        return playingFields

    def createPlayingField(_type, _numberOfPlayers, _userId):
        playingField = PlayingField(
            type=_type,
            numberOfPlayers=_numberOfPlayers,
            userId=_userId
        )
        db.session.add(playingField)
        db.session.commit()

    def updatePlyingFieldType(_id, _type):
        playingField = PlayingField.query.filter_by(id=_id).first()
        playingField.type = _type
        db.session.commit()

    def updatePlayingFieldNumberOfPlayers(_id, _numberOfPlayers):
        playingField = PlayingField.query.filter_by(id=_id).first()
        playingField.numberOfPlayers = _numberOfPlayers
        db.session.commit()
