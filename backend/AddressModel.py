from ModelUtil import generateUUID
import json
from flask_sqlalchemy import SQLAlchemy
from settings import app

db = SQLAlchemy(app)


class Address(db.Model):
    __tablename__ = 'Address'

    id = db.Column(db.String, primary_key=True, unique=True)
    playingFieldId = db.Column(db.String, nullable=False)
    street = db.Column(db.String(80), nullable=False)
    streetNr = db.Column(db.String(8), nullable=False)
    city = db.Column(db.String(60), nullable=False)
    region = db.Column(db.String(60), nullable=False)
    country = db.Column(db.String(60), nullable=False)
    addressCode = db.Column(db.String(10), nullable=False)
    contactPhone = db.Column(db.String(20), nullable=False)
    contactEmail = db.Column(db.String(80), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "street": self.street,
            "streetNr": self.streetNr,
            "city": self.city,
            "region": self.region,
            "country": self.country,
            "addressCode": self.addressCode,
            "contactPhone": self.contactPhone,
            "contactEmail": self.contactEmail
        }

    def __repr__(self):
        address_object = str({
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "street": self.street,
            "streetNr": self.streetNr,
            "city": self.city,
            "region": self.region,
            "country": self.country,
            "addressCode": self.addressCode,
            "contactPhone": self.contactPhone,
            "contactEmail": self.contactEmail
        })
        return json.dumps(address_object)

    def addressExist(_street, _streetNr, _city, _region, _country, _addressCode):
        return Address.query.filter_by(street=_street) \
            .filter_by(streetNr=_streetNr) \
            .filter_by(city=_city) \
            .filter_by(region=_region) \
            .filter_by(country=_country) \
            .filter_by(addressCode=_addressCode).first()

    def createAddress(_playingFieldId, _street, _streetNr, _city, _region, _country, _addressCode, _contactPhone,
                      _contactEmail):
        _id = generateUUID()
        if Address.query.filter_by(id=_id).first() is None:
            newAddress = Address(
                id=_id,
                playingFieldId=_playingFieldId,
                street=_street,
                streetNr=_streetNr,
                city=_city,
                region=_region,
                country=_country,
                addressCode=_addressCode,
                contactPhone=_contactPhone,
                contactEmail=_contactEmail
            )
            db.session.add(newAddress)
            db.session.commit()
            return _id
        else:
            Address.createAddress(_playingFieldId, _street, _streetNr, _city, _region, _country, _addressCode,
                                  _contactPhone,
                                  _contactEmail)

    def updateAddress(_playingFieldId, _street, _streetNr, _city, _region, _country, _addressCode):
        address = Address.query.filter_by(playingFieldId=_playingFieldId).first()

        if _street is not None:
            address.street = _street
        if _streetNr is not None:
            address.streetNr = _streetNr
        if _city is not None:
            address.city = _city
        if _region is not None:
            address.region = _region
        if _country is not None:
            address.country = _country
        if _addressCode is not None:
            address.addressCode = _addressCode

        db.session.commit()
        return True

    def getAddressByPlayingFieldId(_playingFieldId):
        address = Address.query.filter_by(playingFieldId=_playingFieldId).first()

        if address is None:
            return "No address found for playingField with id: " + _playingFieldId, 404
        else:
            return address.json()

    def deleteByPlayingFieldId(_playingFieldId):
        address = Address.query.filter_by(playingFieldId=_playingFieldId).first()
        if address is None:
            return False
        else:
            Address.query.filter_by(playingFieldId=_playingFieldId).delete()
            db.session.commit()
            return True
