import json
from flask_sqlalchemy import SQLAlchemy

from ModelUtil import generateUUID
from settings import app

db = SQLAlchemy(app)


class Image(db.Model):
    __tablename__ = 'Image'

    id = db.Column(db.String, primary_key=True, unique=True)
    playingFieldId = db.Column(db.String, nullable=False)
    imagePath = db.Column(db.String, nullable=False)

    def json(self):
        return {
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "imagePath": self.imagePath
        }

    def __repr__(self):
        availableTime_object = str({
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "imagePath": self.imagePath
        })
        return json.dumps(availableTime_object)

    def imageExist(_playingFieldId, _imagePath):
        image = Image.query.filter_by(playingFieldId=_playingFieldId).filter_by(imagePath=_imagePath).first()
        if image is None:
            return False
        else:
            return True

    def addImage(_playingFieldId, _imagePath):
        _id = generateUUID()
        if Image.imageExist(_playingFieldId, _imagePath):
            return False
        else:
            new_image = Image(id=_id, playingFieldId=_playingFieldId, imagePath=_imagePath)
            db.session.add(new_image)
            db.session.commit()
            return True

    def getImage(_playingFieldId):
        images = Image.query.filter_by(playingFieldId=_playingFieldId).all()
        if images is None:
            return "No image found for playingFiled with id: " + _playingFieldId
        else:
            return [image.imagePath for image in images]

    def deleteByPlayingFieldId(_playingFieldId):
        address = Image.query.filter_by(playingFieldId=_playingFieldId).first()
        if address is None:
            return False
        else:
            Image.query.filter_by(playingFieldId=_playingFieldId).delete()
            db.session.commit()
            return True
