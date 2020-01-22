from ModelUtil import generateUUID
import json
from flask_sqlalchemy import SQLAlchemy
from settings import app

db = SQLAlchemy(app)


class Facility(db.Model):
    __tablename__ = 'Facility'

    id = db.Column(db.String, primary_key=True, unique=True)
    playingFieldId = db.Column(db.String, nullable=False)
    facility = db.Column(db.String(12), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "facility": self.facility
        }

    def __repr__(self):
        availableTime_object = str({
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "facility": self.facility
        })
        return json.dumps(availableTime_object)

    def facilityExist(_playingFieldId, _facility):
        facility = Facility.query.filter_by(playingFieldId=_playingFieldId).filter_by(facility=_facility).first()

        if facility is None:
            return False
        else:
            return True

    def createFacility(_playingFieldId, _facility):
        if Facility.facilityExist(_playingFieldId, _facility):
            return False
        else:
            _id = generateUUID()
            if Facility.query.filter_by(id=_id).first() is None:
                newFacility = Facility(
                    id=_id,
                    playingFieldId=_playingFieldId,
                    facility=_facility
                )
                db.session.add(newFacility)
                db.session.commit()
                return True
            else:
                Facility.createFacility(_playingFieldId, _facility)

    def getFacilitiesByPlayingFieldId(_playingFieldId):
        facilities = Facility.query.filter_by(playingFieldId=_playingFieldId).all()

        if facilities is None:
            return "No facility found for the playingField with id: " + _playingFieldId, 404
        else:
            return json.dumps([{"facility": facility.facility} for facility in facilities]), 200

    def addOrUpdateFacilities(_playingFieldId, _facilities):
        Facility.deleteAllFacilities(_playingFieldId)
        success = True
        for facility in _facilities:
            result = Facility.createFacility(_playingFieldId, facility)
            if not result:
                success = False
        if success:
            return "Facilities added with success.", 200
        else:
            return "Some facilities already exists.", 400

    def deleteFacility(_playingFieldId, _facility):
        _facility = Facility.query.filter_by(playingFieldId=_playingFieldId).filter_by(facility=_facility).first()
        if _facility is None:
            return False, 400
        else:
            Facility.query.filter_by(playingFieldId=_playingFieldId).filter_by(facility=_facility).delete()
            db.session.commit()
            return True, 200

    def deleteAllFacilities(_playingFieldId):
        _facility = Facility.query.filter_by(playingFieldId=_playingFieldId).all()
        if _facility is None:
            return False, 400
        else:
            Facility.query.filter_by(playingFieldId=_playingFieldId).delete()
            db.session.commit()
            return True, 200
