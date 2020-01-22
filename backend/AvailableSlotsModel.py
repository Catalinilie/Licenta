from ModelUtil import generateUUID
import json
from flask_sqlalchemy import SQLAlchemy
from settings import app

db = SQLAlchemy(app)


class AvailableSlots(db.Model):
    __tablename__ = 'AvailableSlots'

    id = db.Column(db.String, primary_key=True, unique=True)
    playingFieldId = db.Column(db.String, nullable=False)
    start = db.Column(db.String, nullable=False)
    end = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)

    def json(self):
        return {
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "start": self.start,
            "end": self.end,
            "title": self.title
        }

    def __repr__(self):
        availableSlot_object = str({
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "start": self.start,
            "end": self.end,
            "title": self.title
        })
        return json.dumps(availableSlot_object)

    def availableSlotExist(_playingFieldId):
        availableTime = AvailableSlots.query.filter_by(playingFieldId=_playingFieldId).first()

        if availableTime is None:
            return False
        else:
            return True

    def createAvailableSlot(_playingFieldId, _start, _end, _title):
        _id = generateUUID()
        if AvailableSlots.query.filter_by(id=_id).first() is None:
            newAvailableSlot = AvailableSlots(
                id=_id,
                playingFieldId=_playingFieldId,
                start=_start,
                end=_end,
                title=_title
            )
            db.session.add(newAvailableSlot)
            db.session.commit()
            return AvailableSlots.json(newAvailableSlot), 200
        else:
            AvailableSlots.createAvailableSlot(_playingFieldId, _start, _end, _title)

    def getAvailableSlotsByPlayingFieldId(_playingFieldId):
        availableSlots = AvailableSlots.query.filter_by(playingFieldId=_playingFieldId).all()

        if availableSlots is None:
            return "No available time found for the playingField with id: " + _playingFieldId, 404
        else:
            return json.dumps([AvailableSlots.json(availableSlot) for availableSlot in availableSlots]), 200

    def updateAvailableTimeByPlayingFieldId(_playingFieldId, _start, _end, _title):
        if AvailableSlots.availableSlotExist(_playingFieldId):
            availableSlot = AvailableSlots.query.filter_by(_playingFieldId).first()

            availableSlot.start = _start
            availableSlot.end = _end
            availableSlot.title = _title

            db.session.commit()
            return "Available slot updated with success."
        else:
            return "Available slot with id: " + _playingFieldId + " does not exist."

    def deleteByPlayingFieldId(_playingFieldId):
        timeSlots = AvailableSlots.query.filter_by(playingFieldId=_playingFieldId).all()
        if timeSlots is None:
            return False
        else:
            AvailableSlots.query.filter_by(playingFieldId=_playingFieldId).delete()
            db.session.commit()
            return True

    def deleteAvailableSlot(_id):
        availableSlot = AvailableSlots.query.filter_by(id=_id).first()
        if availableSlot is None:
            return "No time slot found.", 404
        else:
            AvailableSlots.query.filter_by(id=_id).delete()
            db.session.commit()
            return "Time Slot deleted.", 200
