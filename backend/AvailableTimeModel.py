from ModelUtil import generateUUID
import json
from flask_sqlalchemy import SQLAlchemy
from settings import app

db = SQLAlchemy(app)


class AvailableTime(db.Model):
    __tablename__ = 'AvailableTime'

    id = db.Column(db.String, primary_key=True, unique=True)
    playingFieldId = db.Column(db.String, nullable=False)
    dayOfWeekFrom = db.Column(db.String(12), nullable=False)
    dayOfWeekTo = db.Column(db.String(12))
    hourOfOpening = db.Column(db.String(12), nullable=False)
    hourOfClosing = db.Column(db.String(12), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "dayOfWeekFrom": self.dayOfWeekFrom,
            "dayOfWeekTo": self.dayOfWeekTo,
            "hourOfOpening": self.hourOfOpening,
            "hourOfClosing": self.hourOfClosing
        }

    def __repr__(self):
        availableTime_object = str({
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "dayOfWeekFrom": self.dayOfWeekFrom,
            "dayOfWeekTo": self.dayOfWeekTo,
            "hourOfOpening": self.hourOfOpening,
            "hourOfClosing": self.hourOfClosing
        })
        return json.dumps(availableTime_object)

    def availableTimeExist(_playingFieldId):
        availableTime = AvailableTime.query.filter_by(playingFieldId=_playingFieldId).first()

        if availableTime is None:
            return False
        else:
            return True

    def createAvailableTime(_playingFieldId, _dayOfWeekFrom, _dayOfWeekTo, _hourOfOpening, _hourOfClosing):
        _id = generateUUID()
        if AvailableTime.query.filter_by(id=_id).first() is None:
            newAvailableTime = AvailableTime(
                id=_id,
                playingFieldId=_playingFieldId,
                dayOfWeekFrom=_dayOfWeekFrom,
                dayOfWeekTo=_dayOfWeekTo,
                hourOfOpening=_hourOfOpening,
                hourOfClosing=_hourOfClosing
            )
            db.session.add(newAvailableTime)
            db.session.commit()
            return True
        else:
            AvailableTime.createAvailableTime(_playingFieldId, _dayOfWeekFrom, _dayOfWeekTo, _hourOfOpening,
                                              _hourOfClosing)

    def getAvailableTimeByPlayingFieldId(_playingFieldId):
        availableTimes = AvailableTime.query.filter_by(playingFieldId=_playingFieldId).all()

        if availableTimes is None:
            return "No available time found for the playingField with id: " + _playingFieldId, 404
        else:
            return json.dumps([AvailableTime.json(availableTime) for availableTime in availableTimes]), 200


    def updateAvailableTimeByPlayingFieldId(_playingFieldId, _dayOfWeekFrom, _dayOfWeekTo, _hourOfOpening,
                                            _hourOfClosing):
        if AvailableTime.availableTimeExist(_playingFieldId):
            availableTime = AvailableTime.query.filter_by(_playingFieldId).first()

            availableTime.dayOfWeekFrom = _dayOfWeekFrom
            availableTime.dayOfWeekTo = _dayOfWeekTo
            availableTime.hourOfOpening = _hourOfOpening
            availableTime.hourOfClosing = _hourOfClosing

            db.session.commit()
            return "Available time updated with success."
        else:
            return "Available time with id: " + _playingFieldId + " does not exist."

    def deleteAvailableTime(_playingFieldId):
        availableTime = AvailableTime.query.filter_by(playingFieldId=_playingFieldId).all()
        if availableTime is None:
            return False, 404
        else:
            AvailableTime.query.filter_by(playingFieldId=_playingFieldId).delete()
            db.session.commit()
            return True, 200
